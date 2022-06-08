import logging
import httpx
from http import HTTPStatus
from openpyxl import load_workbook
from tempfile import NamedTemporaryFile
import lxml.html
import re
from fastapi.concurrency import run_in_threadpool
from random import shuffle
from typing import List

from core.config import settings
from core.utils import average
from models.flights import Flight
from models.simple_flights import SimpleFlight
from models.final_marks import FinalMark
from models.judge_marks import JudgeMark
from models.competitions import CompetitionType
from models.tricks import Trick

logger = logging.getLogger(__name__)

async def simulate_score(flight: SimpleFlight, type: CompetitionType) -> FinalMark:
    logger.debug(flight)

    tricks = []
    errors = []
    for trick_name in flight.tricks:
        trick = await Trick.get_score(trick_name,
            solo  = (type==CompetitionType.solo),
            synchro = (type==CompetitionType.synchro),
        )
        if trick is None:
            errors.append(trick_name)
        else:
            tricks.append(trick)

    if len(errors) > 0:
        errors = ", ".join(errors)
        raise Exception(f"Some tricks are unknown for a {type} run: {errors}")

    logger.debug(tricks)
    f = Flight(
        pilot = "Jerry the Pilot",
        tricks=tricks,
        marks=[
            JudgeMark(
                judge="Jerry the Judge",
                technical=flight.mark.technical,
                choreography=flight.mark.choreography,
                landing=flight.mark.landing,
                synchro=flight.mark.synchro,
            )
        ]
    )

    return calculate_score(f, type)

def calculate_score(flight: Flight, type: CompetitionType) -> FinalMark:
    mark = FinalMark(
        judges_mark = JudgeMark(
            judge = "Average of judges marks",
            technical = 0,
            choreography = 0,
            landing = 0,
            synchro = 0,
        ),
        technicity=0,
        bonus_percentage=0,
        technical=0,
        choreography=0,
        landing=0,
        synchro=0,
        bonus=0,
        score=0,
    )

    technicals = []
    choreographies = []
    landings = []
    synchros = []
    for m in flight.marks:
        technicals.append(m.technical)
        choreographies.append(m.choreography)
        landings.append(m.landing)
        if type == CompetitionType.synchro:
            if m.synchro is None:
                raise Exception(f"synchro mark is missing. It is mandatory for {type} runs")
            synchros.append(m.synchro)

    mark.judges_mark.technical = average(technicals)
    mark.judges_mark.choreography = average(choreographies)
    mark.judges_mark.landing = average(landings)
    if type == CompetitionType.synchro:
        mark.judges_mark.synchro = average(synchros)
    logger.debug(f"{mark.judges_mark}")


    technicals = []
    bonuses = []
    for trick in flight.tricks:
        logger.debug(f"got trick {trick}")


        # calculate the bonus of the run as stated in 7B
        # §6.6.1 Twisted manoeuvres bonus
        # During each run, up to 5 manoeuvres can be performed twisted.
        if trick.bonus > 0:
            if len(bonuses) > settings.competitions.max_bonus_trick_per_run:
                logger.debug(f"ignoring trick {trick.name} as there are already {settings.competitions.max_bonus_trick_per_run} tricks with bonus in this run")
                next

            bonuses.append(trick.bonus)

        # append technical after bonus as the previous loop
        # can call next to ignore a trick if more than 5 bonus tricks are flown
        # as stated in 7B §
        # If more than 5 manoeuvres are flown twisted, the extra manoeuvres will not
        # be scored and their coefficients not taken into account for the
        # determination of the average coefficient.
        technicals.append(trick.technical_coefficient)

    # calculate the technicity of the run as stated in 7B 
    # §"6.3.1.1 Technicity in Solo"
    # The technicity is a difficulty coefficient calculated as the average
    # of the 3 highest coefficient manoeuvres flown during the run.
    technicals = sorted(technicals, reverse=True)
    mark.technicity = average(technicals[0:3])

    # calculate the bonus of the run as stated in 7B
    # §6.6.1 Twisted manoeuvres bonus
    # -> it is implied that the bonus is the sum of the bonuses limited to 5
    mark.bonus_percentage = sum(bonuses)

    mark.technical = mark.technicity * mark.judges_mark.technical * settings.competitions.marks_repartition[type]['technical'] / 100

    mark.choreography = mark.judges_mark.choreography * settings.competitions.marks_repartition[type]['choreography'] / 100

    mark.landing = mark.judges_mark.landing * settings.competitions.marks_repartition[type]['landing'] / 100

    if type == CompetitionType.synchro:
        mark.synchro = mark.judges_mark.synchro * settings.competitions.marks_repartition[type]['synchro'] / 100

    mark.bonus = (mark.technical + mark.choreography) * mark.bonus_percentage / 100

    mark.score = mark.technical + mark.choreography + mark.landing + mark.bonus

    logger.debug(f"calculate_score() -> {mark}")
    return mark

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
from datetime import date

from core.config import settings
from core.utils import average, weight_average
from models.flights import Flight, FlightNew
from models.final_marks import FinalMark
from models.judge_marks import JudgeMark
from models.competitions import Competition, CompetitionType, CompetitionConfig, CompetitionState
from models.tricks import Trick
from models.judges import Judge

logger = logging.getLogger(__name__)

async def simulate_score(flight: FlightNew, type: CompetitionType) -> FinalMark:
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
        pilot = 0,
        tricks=tricks,
        marks=flight.marks
    )

    comp = Competition(
        name="Simulated comp",
        start_date = date.today(),
        end_date = date.today(),
        state = CompetitionState.open,
        config = CompetitionConfig(),
        type = type,
        runs = []
    )

    return await calculate_score(f, comp)

async def calculate_score(flight: Flight, competition: Competition, run_i: int = -1) -> FinalMark:
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
        warnings=0,
    )

    if run_i < 0:
        run = None
    else:
        try:
            run = competition.runs[run_i]
        except IndexError:
            run = None

    if run is None:
        config = competition.config
    else:
        config = run.config


    #
    # count previous warnings and check if not previous DSQ
    #
    if run_i>0 and run is not None:
        warnings = 0

        # loop over all previous runs
        for i in range(len(compt.runs)):
            if i >= run_i:
                break
            r = comp.runs[i]
            for f in r.flights:
                if f.pilot == f.pilot:
                    warnings += f.warnings
                    break
        if warnings >= config.warnings_to_dsq:
            raise Exception("Can't calculate a score for a DSQ pilot")
    #
    # end of checking warning to DSQ
    #
    

    # calculate the average of judges marks
    # using the weight of each judge level
    technicals = []
    choreographies = []
    landings = []
    synchros = []
    for m in flight.marks:
        judge = await Judge.get(m.judge)
        if judge is None:
            raise Exception(f"judge '{m.judge}' not found")
        weight = dict(config.judge_weights)[judge.level.value]
        technicals.append((m.technical, weight))
        choreographies.append((m.choreography, weight))
        landings.append((m.landing, weight))
        if competition.type == CompetitionType.synchro:
            if m.synchro is None:
                raise Exception(f"synchro mark is missing. It is mandatory for {competition.type} runs")
            synchros.append((m.synchro, weight))

    mark.judges_mark.technical = weight_average(technicals)
    mark.judges_mark.choreography = weight_average(choreographies)
    mark.judges_mark.landing = weight_average(landings)
    if competition.type == CompetitionType.synchro:
        mark.judges_mark.synchro = weight_average(synchros)
    #
    # endof calculating the weight average of the judges marks
    #


    #
    # ignore trick with bonus higher than the maximum bonus tricks allowed
    #
    tricks = [] # the list of tricks that will be used to calculate the scores
    n_bonuses = {}
    i = 0
    logger.debug(config.max_bonus_per_run)
    for trick in flight.tricks:
        i += 1
        ignoring = False
        for bonus_type in trick.bonus_types:
            if bonus_type not in n_bonuses:
                n_bonuses[bonus_type] = 0

            n_bonuses[bonus_type] += 1

            max = dict(config.max_bonus_per_run)[bonus_type]

            if n_bonuses[bonus_type] > max:
                logger.warning(f"Ignoring trick #{i} ({trick}) because already {max} tricks have been flown")
                mark.notes.append(f"trick number #{i} ({trick.name}) has been ignored because more than {max} {bonus_type} tricks have been flown")
                ignoring = True
                break

        if not ignoring:
            tricks.append(trick)


    technicals = []
    bonuses = []
    for trick in tricks:


        # calculate the bonus of the run as stated in 7B
        # §6.6.1 Twisted manoeuvres bonus
        if trick.bonus > 0:
            bonuses.append(trick.bonus)

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

    mark_percentage = dict(config.mark_percentages)[competition.type.value]
    mark.technical = mark.technicity * mark.judges_mark.technical * mark_percentage.technical / 100

    mark.choreography = mark.judges_mark.choreography * mark_percentage.choreography / 100

    mark.landing = mark.judges_mark.landing * mark_percentage.landing / 100

    if type == CompetitionType.synchro:
        mark.synchro = mark.judges_mark.synchro * mark_percentage.synchro / 100

    mark.bonus = (mark.technical + mark.choreography) * mark.bonus_percentage / 100

    mark.score = mark.technical + mark.choreography + mark.landing + mark.bonus

    logger.debug(f"calculate_score() -> {mark}")
    return mark

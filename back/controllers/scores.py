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
from models.competitions import Competition, CompetitionNew, CompetitionType, CompetitionConfig, CompetitionState
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
        marks=flight.marks,
        did_not_start=flight.did_not_start,
        warnings=flight.warnings,
    )

    competition = Competition(
        name="Simulated comp",
        start_date = date.today(),
        end_date = date.today(),
        type = type,
        state = CompetitionState.init,
        config = CompetitionConfig(),
        repeatable_tricks = [str(trick.id) for trick in await Trick.getall(repeatable=True)],
        pilots = [],
        teams = [],
        judges = [],
        runs = [],
        deleted = None,
    )

    return await competition.calculate_score(flight=f)

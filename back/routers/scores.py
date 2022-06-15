import logging
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from core.config import settings

from controllers.scores import calculate_score, simulate_score
from models.flights import Flight, FlightNew
from models.final_marks import FinalMark
from models.competitions import CompetitionType

logger = logging.getLogger(__name__)
scores= APIRouter()

@scores.post(
    "/simulate/{t}",
    response_model=FinalMark,
    dependencies=[Depends(auth)]
)
async def simulate(t: CompetitionType, flight: FlightNew = Body(...)):
    return await simulate_score(flight, t)
    try:
        return await simulate_score(flight, t)
    except Exception as e:
        raise HTTPException(status_code= 400, detail=str(e))

#def simulate2(t: CompetitionType, flight: Flight = Body(...)):
#    logger.debug(f"type={t}")
#    return calculate_score(flight, t)

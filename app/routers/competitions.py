import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.competitions import CompetitionModel
from typing import List
from fastapi.responses import Response

logger = logging.getLogger(__name__)
competitions = APIRouter()

#
# Get all competitions
#
@competitions.get(
    "/",
    response_description="List all competitions",
    response_model=List[CompetitionModel],
    dependencies=[Depends(auth)],
)
async def list():
    return await CompetitionModel.getall()

#
# Get one competition
#
@competitions.get(
    "/{id}",
    response_description="Get a Competition",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    competition = await CompetitionModel.get(id, None)
    if competition is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")
    logger.debug(competition)
    return competition

@competitions.get(
    "/{id}/{year}",
    response_description="Get a Competition",
    dependencies=[Depends(auth)],
)
async def get(id: str, year: int):
    competition = await CompetitionModel.get(id, year)
    if competition is None:
        raise HTTPException(status_code=404, detail=f"Competition '{id} - {year}' not found")
    logger.debug(competition)
    return competition

#
# Create a new Competition
#
@competitions.post(
    "/",
    status_code=201,
    response_description="Add new Competition",
    response_model=CompetitionModel,
    dependencies=[Depends(auth)],
)
async def create(competition: CompetitionModel = Body(...)):
    try:
        return await competition.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Update an existing Competition
#
@competitions.put(
    "/{id}",
    response_description="Add new Competition",
    response_model=CompetitionModel,
    dependencies=[Depends(auth)],
)
async def update(id: str, competition: CompetitionModel = Body(...)):
    try:
        competition.id = id
        await competition.update()
        return competition
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Delete a Competition
#
@competitions.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Competition",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    if not await CompetitionModel.delete(id):
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

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
    "/{name}/{year}",
    response_description="Get a Competition",
    dependencies=[Depends(auth)],
)
async def get(name: str, year: int):
    competition = await CompetitionModel.get(name, year)
    if competition is None:
        raise HTTPException(status_code=404, detail=f"Competition '{name} - {year}' not found")
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

@competitions.put(
    "/{name}/{year}",
    response_description="Add new Competition",
    response_model=CompetitionModel,
    dependencies=[Depends(auth)],
)
async def update(name: str, year: int, competition: CompetitionModel = Body(...)):
    try:
        competition.name = name
        competition.year = year
        await competition.update()
        return competition
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Delete a Competition
#
@competitions.delete(
    "/{name}/{year}",
    status_code=204,
    response_description="Delete a Competition",
    dependencies=[Depends(auth)],
)
async def delete(name: str, year: int, force: bool = False):
    if not force:
        raise HTTPException(status_code=400, detail=f"Cannot delete a competition")
    if not await CompetitionModel.delete(name, year):
        raise HTTPException(status_code=404, detail=f"Competition '{name} - {year}' not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

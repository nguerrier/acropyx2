import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.competitions import Competition
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
    response_model=List[Competition],
)
async def list():
    competitions = []
    for c in await Competition.getall()

#
# Get one competition
#
@competitions.get(
    "/{id}",
    response_description="Get a Competition",
    response_model=Competition,
)
async def get_by_id(id: str):
    return await get(id, 0)

@competitions.get(
    "/{name}/{year}",
    response_description="Get a Competition",
    response_model=Competition,
)
async def get(name: str, year: int):
    competition = await Competition.get(name, year)
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
    response_model=Competition,
    dependencies=[Depends(auth)],
)
async def create(competition: Competition = Body(...)):
    try:
        return await competition.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Update an existing Competition
#
@competitions.put(
    "/{id}/{year}",
    status_code=204,
    response_description="Add new Competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def update(id: str, year: int, competition: Competition = Body(...)):
    try:
        res = await Competition.update(id, year, competition)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if res is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Delete a Competition
#
@competitions.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def delete_by_id(id: str, restore: bool = False):
    return await delete(id, 0, restore)

@competitions.delete(
    "/{name}/{year}",
    status_code=204,
    response_description="Delete a Competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def delete(name: str, year: int, restore: bool = False):
    try:
        res = await Competition.delete(name, year, restore)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if res is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

    if res is False:
        if restore:
            raise HTTPException(status_code=409, detail=f"Competition {id} is not marked as deleted")
        else:
            raise HTTPException(status_code=409, detail=f"Competition {id} is already marked as deleted")

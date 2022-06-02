import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.teams import TeamModel
from typing import List
from fastapi.responses import Response

logger = logging.getLogger(__name__)
teams = APIRouter()

#
# Get all teams
#
@teams.get(
    "/",
    response_description="List all teams",
    response_model=List[TeamModel],
    dependencies=[Depends(auth)],
)
async def list():
    return await TeamModel.getall()

#
# Get one team
#
@teams.get(
    "/{id}",
    response_description="Get a Team",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    team = await TeamModel.get(id)
    if team is None:
        raise HTTPException(status_code=404, detail=f"Team {id} not found")
    logger.debug(team)
    return team

#
# Create a new Team
#
@teams.post(
    "/",
    status_code=201,
    response_description="Add new Team",
    response_model=TeamModel,
    dependencies=[Depends(auth)],
)
async def create(team: TeamModel = Body(...)):
    try:
        return await team.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Update an existing Team
#
@teams.put(
    "/{id}",
    response_description="Add new Team",
    response_model=TeamModel,
    dependencies=[Depends(auth)],
)
async def update(id: str, team: TeamModel = Body(...)):
    try:
        team.id = id
        await team.update()
        return team
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Delete a Team
#
@teams.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Team",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    if not await TeamModel.delete(id):
        raise HTTPException(status_code=404, detail=f"Team {id} not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

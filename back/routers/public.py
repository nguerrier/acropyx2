import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Response
from typing import List

from models.competitions import Competition, CompetitionExport, CompetitionNew, CompetitionState, CompetitionPublicExport
from models.pilots import Pilot
from models.judges import Judge
from models.teams import Team, TeamExport

log = logging.getLogger(__name__)
public = APIRouter()

#
# Get all public
#
@public.get(
    "/pilots/",
    response_description="List all public",
    response_model=List[Pilot],
)
async def list():
    return await Pilot.getall()

#
# Get one pilot
#
@public.get(
    "/pilots/{civlid}",
    response_description="Get a Pilot",
    response_model=Pilot,
)
async def get(civlid: int):
    return await Pilot.get(civlid)

#
# Get all teams
#
@public.get(
    "/teams/",
    response_description="List all teams",
    response_model=List[TeamExport],
)
async def list():
    teams = []
    for team in await Team.getall(False):
        teams.append(await team.export())
    return teams

#
# Get one team
#
@public.get(
    "/teams/{id}",
    response_description="Get a Team",
    response_model=TeamExport,
)
async def get(id: str):
    team = await Team.get(id, False)
    return await team.export()

#
# Get all judges
#
@public.get(
    "/judges/",
    response_description="List all judges",
    response_model=List[Judge],
)
async def list():
    return await Judge.getall(False)
    log.debug(team)
    return await team.export()

#
# Get one judge
#
@public.get(
    "/judges/{id}",
    response_description="Get a Judge",
    response_model=Judge,
)
async def get(id: str):
    return await Judge.get(id, False)

#
# Get all competitions
#
@public.get(
    "/competitions/",
    response_description="List all competitions",
    response_model=List[CompetitionPublicExport],
)
async def list():
    comps = []
    for comp in await Competition.getall():
        comp = await comp.export_public()
        comps.append(comp)
    return comps

#
# Get one competition
#
@public.get(
    "/competitions/{id}",
    response_description="Get a Competition",
    response_model=CompetitionPublicExport,
)
async def get_by_id(id: str):
    comp = await Competition.get(id)
    return await comp.export_public()

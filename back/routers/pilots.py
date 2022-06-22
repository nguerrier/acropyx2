import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Response
from typing import List

from core.security import auth
from models.pilots import Pilot, collection
from controllers.pilots import PilotCtrl

log = logging.getLogger(__name__)
pilots = APIRouter()

#
# Get all pilots
#
@pilots.get(
    "/",
    response_description="List all pilots",
    response_model=List[Pilot],
)
async def list():
    return await Pilot.getall()

#
# Get one pilot
#
@pilots.get(
    "/{civlid}",
    response_description="Get a Pilot",
    response_model=Pilot,
)
async def get(civlid: int):
    return await Pilot.get(civlid)

#
# Create all pilots from CIVL database
#
@pilots.post(
    "/update_all",
    status_code=201,
    response_description="Create all missing pilots from CIVL database",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def sync():
    await PilotCtrl.update_pilots()

#
# Create a new Pilot
#
@pilots.post(
    "/{civlid}",
    status_code=201,
    response_description="Add new Pilot",
    response_model=Pilot,
    dependencies=[Depends(auth)],
)
async def create(civlid: int):
    return await PilotCtrl.update_pilot(civlid)

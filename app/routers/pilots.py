import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List

from core.security import auth
from models.pilots import Pilot, collection
from controllers.pilots import update_pilot, update_pilots, isTaskRunning

logger = logging.getLogger(__name__)
pilots = APIRouter()

#
# Get all pilots
#
@pilots.get(
    "/",
    response_description="List all pilots",
    response_model=List[Pilot],
    dependencies=[Depends(auth)],
)
async def list():
    logger.debug("list()")
    return await Pilot.getall()

#
# Get one pilot
#
@pilots.get(
    "/{id}",
    response_description="Get a Pilot",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    logger.debug("get(%s)", id)

    pilot = await Pilot.get(id)
    if pilot is None:
        raise HTTPException(status_code=404, detail=f"Pilot {id} not found")
    return pilot

#
# Create all pilots from CIVL database
#
@pilots.post(
    "/",
    status_code=201,
    response_description="Create all missing pilots from CIVL database",
    dependencies=[Depends(auth)],
)
async def sync(background_tasks: BackgroundTasks):
    if isTaskRunning():
        return "an update task is already running ..."
    background_tasks.add_task(update_pilots)
    return "OK"

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
    logger.debug("create or update pilot with civlid %d", civlid)
    return await update_pilot(civlid)

#
# Update an existing Pilot
#
@pilots.put(
    "/{id}",
    response_description="Add new Pilot",
    dependencies=[Depends(auth)],
)
async def update(id: str):
    raise HTTPException(status_code=501)

#
# Delete a Pilot
#
@pilots.delete(
    "/{id}",
    response_description="Delete a Pilot",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    raise HTTPException(status_code=501)

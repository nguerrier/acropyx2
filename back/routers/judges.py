import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.judges import Judge, JudgeLevel
from typing import List
from fastapi.responses import Response

logger = logging.getLogger(__name__)
judges = APIRouter()

#
# Get all judges
#
@judges.get(
    "/",
    response_description="List all judges",
    response_model=List[Judge],
)
async def list(deleted: bool = False):
    return await Judge.getall(deleted)

#
# get Judges levels
#
@judges.get(
    "/levels/",
    response_description="Get list of judges levels",
    response_model=List[JudgeLevel],
)
def get_levels():
    return [level.value for level in JudgeLevel]

#
# Get one judge
#
@judges.get(
    "/{id}",
    response_description="Get a Judge",
    response_model=Judge,
)
async def get(id: str, deleted: bool = False):
    judge = await Judge.get(id, deleted)
    if judge is None:
        raise HTTPException(status_code=404, detail=f"Judge {id} not found")
    logger.debug(judge)
    return judge

#
# Create a new Judge
#
@judges.post(
    "/",
    status_code=201,
    response_description="Add new Judge",
    response_model=Judge,
    dependencies=[Depends(auth)],
)
async def create(judge: Judge = Body(...)):
    try:
        return await judge.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Update an existing Judge
#
@judges.put(
    "/{id}",
    status_code=204,
    response_description="Add new Judge",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def update(id: str, judge: Judge = Body(...)):
    try:
        res = await Judge.update(id, judge)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if res is None:
        raise HTTPException(status_code=404, detail=f"Judge {id} not found")

#
# Delete a Judge
#
@judges.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Judge",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def delete(id: str, restore: bool = False):
    try:
        res = await Judge.delete(id, restore)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if res is None:
        raise HTTPException(status_code=404, detail=f"Judge {id} not found")

    if res is False:
        if restore:
            raise HTTPException(status_code=409, detail=f"Judge {id} is not marked as deleted")
        else:
            raise HTTPException(status_code=409, detail=f"Judge {id} is already marked as deleted")

import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.tricks import TrickModel
from typing import List
from fastapi.responses import Response

logger = logging.getLogger(__name__)
tricks = APIRouter()

#
# Get all tricks
#
@tricks.get(
    "/",
    response_description="List all tricks",
    response_model=List[TrickModel],
    dependencies=[Depends(auth)],
)
async def list():
    return await TrickModel.getall()

#
# Get one trick
#
@tricks.get(
    "/{id}",
    response_description="Get a Trick",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    trick = await TrickModel.get(id)
    if trick is None:
        raise HTTPException(status_code=404, detail=f"Trick {id} not found")
    logger.debug(trick)
    return trick

#
# Create a new Trick
#
@tricks.post(
    "/",
    status_code=201,
    response_description="Add new Trick",
    response_model=TrickModel,
    dependencies=[Depends(auth)],
)
async def create(trick: TrickModel = Body(...)):
    try:
        return await trick.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Import Tricks
#
@tricks.post(
    "/import",
    status_code=201,
    response_description="Add new Trick",
    dependencies=[Depends(auth)],
)
async def create(tricks: List[TrickModel] = Body(...)):
    errors = []
    count = 0
    for trick in tricks:
        try:
            await trick.create()
            count += 1
        except Exception as e:
            errors.append(str(e))
    if len(errors) > 0:
        count_error = len(errors)
        errors = ",".join(errors)
        msg = f"Imported successfully {count} pilots and {count_error} failed: {errors}"
        raise HTTPException(status_code=400, detail=msg)
    return f"Imported successfully {count} pilots without errors"

#
# Update an existing Trick
#
@tricks.put(
    "/{id}",
    response_description="Add new Trick",
    response_model=TrickModel,
    dependencies=[Depends(auth)],
)
async def update(id: str, trick: TrickModel = Body(...)):
    try:
        trick.id = id
        await trick.update()
        return trick
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Delete a Trick
#
@tricks.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Trick",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    if not await TrickModel.delete(id):
        raise HTTPException(status_code=404, detail=f"Trick {id} not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

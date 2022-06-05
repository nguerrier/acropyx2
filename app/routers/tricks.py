import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.tricks import Trick, UniqueTrick
from typing import List
from fastapi.responses import Response
from controllers.tricks import generate_tricks, check_tricks_unicity

logger = logging.getLogger(__name__)
tricks = APIRouter()

#
# Get all tricks
#
@tricks.get(
    "/",
    response_description="List all tricks",
    response_model=List[Trick],
    dependencies=[Depends(auth)],
)
async def list():
    return await Trick.getall()

#
# Get all scores
#
@tricks.get(
    "/scores",
    response_description="Get all tricks",
    response_model=List[UniqueTrick],
    dependencies=[Depends(auth)],
)
async def get_scores(solo: bool=True, synchro: bool=True):
    return await Trick.get_scores(solo, synchro)


#
# Get a score
#
@tricks.get(
    "/score/{id:path}", # https://github.com/tiangolo/fastapi/issues/4390#issuecomment-1019558295
    response_description="Get a Trick",
    response_model=UniqueTrick,
    dependencies=[Depends(auth)],
)
async def get_score(id):
    logger.debug(f"id: {id}")
    trick = await Trick.get_score(id)
    if trick is None:
        raise HTTPException(status_code=404, detail=f"Trick {id} not found")
    logger.debug(trick)
    return trick


#
# Get one trick
#
@tricks.get(
    "/{id}",
    response_description="Get a Trick",
    response_model=Trick,
    dependencies=[Depends(auth)],
)
async def get(id: str):
    trick = await Trick.get(id)
    if trick is None:
        raise HTTPException(status_code=404, detail=f"Trick {id} not found")
    return trick

#
# Create a new Trick
#
@tricks.post(
    "/",
    status_code=201,
    response_description="Add new Trick",
    response_model=Trick,
    dependencies=[Depends(auth)],
)
async def create(trick: Trick = Body(...), erase: bool=False):
    try:
        generate_tricks(trick)
        if erase:
            return await trick.create_or_update()
        else:
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
async def create_import(tricks: List[Trick] = Body(...), erase: bool=False):
    errors = []
    count = 0
    for trick in tricks:
        try:
            generate_tricks(trick)
            if erase:
                await trick.create_or_update()
            else:
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
    response_model=Trick,
    dependencies=[Depends(auth)],
)
async def update(id: str, trick: Trick = Body(...)):
    try:
        trick.id = id
        generate_tricks(trick)
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
    if not await Trick.delete(id):
        raise HTTPException(status_code=404, detail=f"Trick {id} not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

#
# Check scores unicity
#
@tricks.patch(
    "/scores",
    status_code=200,
    response_model=bool,
    dependencies=[Depends(auth)],
)
async def check_score_unicity():
    try:
        return await check_tricks_unicity()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

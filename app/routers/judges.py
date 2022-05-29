from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from core.database import db
from core.config import settings
from models.judges import JudgeModel, UpdateJudgeModel
from typing import Optional, List
from fastapi.encoders import jsonable_encoder
import pymongo
from pydantic.error_wrappers import ValidationError

judges = APIRouter()
collection = db.judges

def judges_start():
    collection.create_index([('name', pymongo.TEXT)], unique=True)

#
# Get all judges
#
@judges.get(
    "/",
    response_description="List all judges",
    response_model=List[JudgeModel],
    dependencies=[Depends(auth)],
)
async def list():
    judges = await collection.find().to_list(1000)
    return judges

#
# Get one judge
#
@judges.get(
    "/{id}",
    response_description="Get a Judge",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    res = await collection.find_one({"_id": id})
    if res is None:
        raise HTTPException(status_code=404, detail=f"Judge {id} not found")
    return res

#
# Create a new Judge
#
@judges.post(
    "/",
    status_code=201,
    response_description="Add new Judge",
    response_model=JudgeModel,
    dependencies=[Depends(auth)],
)
async def create(judge: JudgeModel = Body(...)):
    judge = jsonable_encoder(judge)
    try:
        judge = await collection.insert_one(judge)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Judge already exists")
    judge = await db.judges.find_one({"_id": judge.inserted_id})
    return judge

#
# Update an existing Judge
#
@judges.put(
    "/{id}",
    response_description="Add new Judge",
    response_model=JudgeModel,
    dependencies=[Depends(auth)],
)
async def update(id: str, judge: UpdateJudgeModel = Body(...)):
    judge = {k: v for k, v in judge.dict().items() if v is not None}
    judge = jsonable_encoder(judge)
    if len(judge) > 1: # only update if there are no None item
        try:
            res = await collection.update_one({"_id": id}, {"$set": judge})
        except ValidationError as e:
            raise HTTPException(status_code=400, detail=e)

    return await collection.find_one({"_id": id})

#
# Delete a Judge
#
@judges.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Judge",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    res = await collection.delete_one({"_id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Judge {id} not found")

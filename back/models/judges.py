import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from enum import Enum
from pycountry import countries
from typing import Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from datetime import datetime

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.judges

def check_country(cls, v):
    assert countries.get(alpha_3=v) is not None, f"Invalid country '{v}'"
    return v

class JudgeLevel(Enum):
    trainee = "trainee"
    certified = "certified"
    senior = "senior"


class Judge(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., description="The full name of the judge")
    country: str = Field(..., description="The country of the judge using the 3 letter acronym of the country")
    level: JudgeLevel = Field(..., description="The level of the judge")
    deleted: Optional[datetime]

    _normalize_country = validator('country', allow_reuse=True)(check_country)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "country": "fra",
                "level": "certified",
            }
        }

    async def create(self):
        try:
            judge = jsonable_encoder(self)
            judge['deleted'] = None
            res = await collection.insert_one(judge)
            self.id = res.inserted_id
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Judge '{self.name}' already exists")

    async def save(self):
        judge = jsonable_encoder(self)
        res =  await collection.update_one({"_id": str(self.id)}, {"$set": judge})
        return res.modified_count == 1

    @staticmethod
    def createIndexes():
        collection.create_index([('name', pymongo.ASCENDING), ('deleted', pymongo.ASCENDING)], unique=True)
        logger.debug('index created on "name,deleted"')

    @staticmethod
    async def get(id, deleted: bool = False):
        if deleted:
            search = {"_id": id}
        else:
            search = {"_id": id, "deleted": None}
        judge = await collection.find_one(search)
        if judge is not None:
            return Judge.parse_obj(judge)
        return None

    @staticmethod
    async def getall(deleted: bool = False):
        if deleted:
            search = {}
        else:
            search = {"deleted": None}
        judges = []
        for judge in await collection.find(search, sort=[("level", pymongo.DESCENDING), ("name", pymongo.ASCENDING)]).to_list(1000):
            judges.append(Judge.parse_obj(judge))
        return judges

    @staticmethod
    async def update(id: str, judge_update):
        judge = await Judge.get(id)
        if judge is None:
            return None

        judge_update.id = judge.id
        return await judge_update.save()

    @staticmethod
    async def delete(id: str, restore: bool = False):
        judge = await Judge.get(id, True)
        if judge is None:
            return None

        if restore ^ (judge.deleted is not None):
            return False

        if restore:
            judge.deleted = None
            action = "restoring"
        else:
            judge.deleted = datetime.now()
            action = "deleting"
        return await judge.save()

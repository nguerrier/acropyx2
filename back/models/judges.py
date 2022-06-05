import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from enum import Enum
from pycountry import countries
from typing import Optional
from fastapi.encoders import jsonable_encoder
import pymongo

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.judges

def check_country(cls, v):
    assert countries.get(alpha_2=v) is not None, f"Invalid country '{v}'"
    return v

class JudgeLevel(Enum):
    trainee = "trainee"
    certified = "certified"
    senior = "senior"


class JudgeModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    country: str
    level: JudgeLevel

    _normalize_country = validator('country', allow_reuse=True)(check_country)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "country": "fr",
                "level": "certified",
            }
        }

    async def create(self):
        try:
            judge = jsonable_encoder(self)
            res = await collection.insert_one(judge)
            self.id = res.inserted_id
            logger.debug("judge %s created with id %s", self.name, self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Judge '{self.name}' already exists")

    async def update(self):
        judge = jsonable_encoder(self)
        del judge['_id']
        await collection.update_one({"name": self.name}, {"$set": judge})
        res = await collection.find_one({"name": self.name})
        if res is None:
            raise Exception(f"Judge '{self.name}' not found")
        self.id = res['_id']
        logger.debug("judge '%s' updated with id %s", self.name, self.id)
        return self

    @staticmethod
    def createIndexes():
        collection.create_index('name', unique=True)
        logger.debug('index created on "name"')

    @staticmethod
    async def get(id):
        logger.debug("get(%s)", id)
        judge = await collection.find_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        if judge is not None:
            return JudgeModel.parse_obj(judge)
        return None

    @staticmethod
    async def getall():
        logger.debug("getall()")
        judges = []
        for judge in await collection.find().to_list(1000):
            judges.append(JudgeModel.parse_obj(judge))
        return judges

    @staticmethod
    async def delete(id: str):
        res = await collection.delete_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        return res.deleted_count == 1

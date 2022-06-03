import logging
import sys
from pydantic import BaseModel, Field, validator, root_validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from core.config import settings

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.tricks

class Bonus(BaseModel):
    name: str = Field(..., min_length=1)
    bonus: float = Field(..., ge=0.0)
#    pre_acronym: Optional[str]
#    post_acronym: Optional[str]

    @validator('name')
    def check_name(cls, v):
        bonuses = list(map(lambda x:x['name'], settings.tricks.available_bonuses))
        if v not in bonuses:
            bonuses = ", ".join(bonuses)
            raise ValueError(f"Invalid bonus ({v}), must be one of: {bonuses}")
        return v

#    @root_validator
#    def check_pre_acronym(cls, values):
#        if values['pre_acronym'] is None and values['post_acronym'] is None:
#            raise ValueError("At least pre_acronym or post_acronym must be set")
#        return values

class UniqueTrick(BaseModel):
    name: str
    acronym: str
    technical_coefficient: float
    bonus: float

class TrickModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1)
    acronym: str = Field(..., min_length=1)
    solo: bool
    synchro: bool
    directions: List[str]
    technical_coefficient: float = Field(..., ge=0.0)
    bonuses: List[Bonus]
    first_maneuver: int = Field(0, ge=0)
    no_first_maneuver: int = Field(0, ge=0)
    last_maneuver: int = Field(0, ge=0)
    no_last_maneuver: int = Field(0, ge=0)
    tricks: List[UniqueTrick] = Field([])

    @validator('directions')
    def check_directions(cls, v):
        if len(v) == 1:
            raise ValueError("directions must have 0 or at least 2 directions (not one)")

        if len(v) > 1:
            if len(v) != len(list(set(v))): # using set() to get unique values of directions
                raise ValueError("can have a same direction declared more than once")

        for direction in v:
            directions = list(map(lambda  x:x['name'], settings.tricks.available_directions))
            if direction not in directions:
                directions = ", ".join(directions)
                raise ValueError(f"invalid direction '{direction}', must be one of {directions} ")
        return v

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

    async def check(self):
#        for id in self.pilots:
#            pilot = await PilotModel.get(id)
#            if pilot is None:
#                raise Exception(f"Pilot '{id}' is unknown, only known pilots can be part of a trick")
        return

    async def create(self):
        try:
            await self.check()
            trick = jsonable_encoder(self)
            res = await collection.insert_one(trick)
            self.id = res.inserted_id
            logger.debug("trick %s created with id %s", self.name, self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Trick '{self.name}' already exists")

    async def update(self):
        await self.check()
        trick = jsonable_encoder(self)
        del trick['_id']
        await collection.update_one({"name": self.name}, {"$set": trick})
        res = await collection.find_one({"name": self.name})
        if res is None:
            raise Exception(f"Trick '{self.name}' not found")
        self.id = res['_id']
        logger.debug("trick '%s' updated with id %s", self.name, self.id)
        return self

    async def create_or_update(self):
        try:
            return await self.create()
        except:
            return await self.update()

    @staticmethod
    def createIndexes():
        collection.create_index('name', unique=True)
        collection.create_index('acronym', unique=True)
        logger.debug('index created on "name"')

    @staticmethod
    async def get(id):
        logger.debug("get(%s)", id)
        trick = await collection.find_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        if trick is not None:
            return TrickModel.parse_obj(trick)
        return None

    @staticmethod
    async def get_scores(solo: bool, synchro: bool):
        logger.debug(f"get_scores({solo}, {synchro})")
        if not solo and not synchro:
            return []
        tricks = []
        for trick in await collection.find({"$or": [{"solo": solo}, {"synchro": synchro}]}).sort("technical_coefficient").to_list(1000):
            for t in trick['tricks']:
                tricks.append(UniqueTrick.parse_obj(t))
        return tricks

    @staticmethod
    async def get_score(id):
        logger.debug(f"get_score({id})")
        trick = await collection.find_one({"tricks.name": id }, { "tricks.$": 1 })
        if trick is None:
            trick = await collection.find_one({"tricks.acronym": id }, { "tricks.$": 1 })

        if trick is None or len(trick['tricks']) != 1:
            return None

        bonus = UniqueTrick.parse_obj(trick['tricks'][0])
        return bonus

    @staticmethod
    async def getall():
        logger.debug("getall()")
        tricks = []
        for trick in await collection.find().to_list(1000):
            tricks.append(TrickModel.parse_obj(trick))
        return tricks

    @staticmethod
    async def delete(id: str):
        res = await collection.delete_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        return res.deleted_count == 1

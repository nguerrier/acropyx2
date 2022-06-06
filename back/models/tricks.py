import logging
import sys
from pydantic import BaseModel, Field, validator, root_validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from core.config import settings

from models.bonus import Bonus
from models.unique_tricks import UniqueTrick

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.tricks

class Trick(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_length=1, description="The name of the trick (without bonuses)")
    acronym: str = Field(..., min_length=1, description="The acronym of the trick (without bonuses)")
    solo: bool = Field(..., description="Is this trick valid for solo competitions")
    synchro: bool = Field(..., description="Is this trick valid for synchro competitions")
    directions: List[str] = Field(..., description="List of allowed diredctions for the trick. Empty list implies a trick with a unique direction")
    technical_coefficient: float = Field(..., ge=0.0, description="The technical coefficient of the trick")
    bonuses: List[Bonus] = Field(..., description="List of all bonuses that can apply to this trick")
    first_maneuver: int = Field(0, ge=0, description="If positive, indicates that the trick must be performed in the first N tricks of the run")
    no_first_maneuver: int = Field(0, ge=0, description="If positive, indicates that the trick must not be performed in the first N tricks of the run")
    last_maneuver: int = Field(0, ge=0, description="If positive, indicates that the trick must be performed in the last N tricks of the run")
    no_last_maneuver: int = Field(0, ge=0, description="If positive, indicates that the trick must not be performed in the last N tricks of the run")
    tricks: List[UniqueTrick] = Field([], description="List of all the variant of the trick (this is automatically generated)")

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
                "name": "Misty to Helicopter",
                "acronym": "MH",
                "solo": True,
                "synchro": True,
                "directions": ["left", "right"],
                "technical_coefficient": 1.75,
                "bonuses": [
                    {"name": "twisted", "bonus": 3},
                    {"name": "reverse", "bonus": 3}
                ],
                "first_maneuver": 0,
                "no_first_maneuver": 0, 
                "last_maneuver": 0,
                "no_last_maneuver": 0,
                "tricks": [
                    {      "name": "left Misty to Helicopter",      "acronym": "LMH",      "technical_coefficient": 1.75,      "bonus": 0    },
                    {      "name": "right Misty to Helicopter",      "acronym": "RMH",      "technical_coefficient": 1.75,      "bonus": 0    },
                    {      "name": "twisted left Misty to Helicopter",      "acronym": "/LMH",      "technical_coefficient": 1.75,      "bonus": 3    },
                    {      "name": "twisted right Misty to Helicopter",      "acronym": "/RMH",      "technical_coefficient": 1.75,      "bonus": 3    },
                    {      "name": "left Misty to Helicopter reverse",      "acronym": "LMHR",      "technical_coefficient": 1.75,      "bonus": 3    },
                    {      "name": "right Misty to Helicopter reverse",      "acronym": "RMHR",      "technical_coefficient": 1.75,      "bonus": 3    },
                    {      "name": "twisted left Misty to Helicopter reverse",      "acronym": "/LMHR",      "technical_coefficient": 1.75,      "bonus": 6    },
                    {      "name": "twisted right Misty to Helicopter reverse",      "acronym": "/RMHR",      "technical_coefficient": 1.75,      "bonus": 6    }
                ]
            }
        }

    async def check(self):
#        for id in self.pilots:
#            pilot = await Pilot.get(id)
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
            return Trick.parse_obj(trick)
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
            tricks.append(Trick.parse_obj(trick))
        return tricks

    @staticmethod
    async def delete(id: str):
        res = await collection.delete_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        return res.deleted_count == 1

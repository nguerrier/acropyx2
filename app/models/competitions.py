import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum

from models.pilots import PilotModel
from models.judges import JudgeModel

from core.database import db, PyObjectId
from core.config import settings

logger = logging.getLogger(__name__)
collection = db.competitions

class CompetitionType(str, Enum):
    solo = 'solo'
    synchro = 'synchro'

class CompetitionState(str, Enum):
    init = 'init'
    open = 'open'
    closed = 'closed'

class CompetitionConfig(BaseModel):
    nb_pilots_to_keep_for_next_run: int = Field(settings.competitions.nb_pilots_to_keep_for_next_run, ge=0)
    apply_penalties: bool = Field(settings.competitions.apply_penalties)

class CompetitionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_len=1)
    year: int = Field(..., gt=2000)
    pilots: List[str] = Field([])
    judges: List[str] = Field([])
    state: CompetitionState
    type: CompetitionType
    config: CompetitionConfig

#    @validator('pilots')
#    def check_pilots(cls, v):
#        if len(v) < 2:
#            raise ValueError('At least 2 pilots must be registered to a competition')
#        return v

#    @validator('judges')
#    def check_judges(cls, v):
#        if len(v) < 2:
#            raise ValueError('At least 2 judges are needed for a valid competition')
#        return v

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

    def title(self):
        return f"{self.name} - {self.year}"

    async def check(self):
        for id in self.pilots:
            pilot = await PilotModel.get(id)
            if pilot is None:
                raise Exception(f"Pilot '{id}' is unknown, only known pilots can take part of a competition")
        for id in self.judges:
            judge = await JudgeModel.get(id)
            if judge is None:
                raise Exception(f"Judge '{id}' is unknown, only known judges can take part of a competition")

        if self.state != CompetitionState.init:
            if len(self.pilots) < 2:
                raise Exception("At least 2 pilots are needed to open a competition")
            if len(self.judges) < 2:
                raise Exception("At least 2 judges are needed to open a competition")


    async def create(self):
        try:
            await self.check()
            competition = jsonable_encoder(self)
            res = await collection.insert_one(competition)
            self.id = res.inserted_id
            logger.debug("competition %s created with id %s", self.title(), self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            title = self.title()
            logger.debug("title %s", self.title())
            raise Exception(f"Competition '{title}' already exists")

    async def update(self):
        await self.check()
        competition = jsonable_encoder(self)
        del competition['_id']
        await collection.update_one({"name": self.name}, {"$set": competition})
        res = await collection.find_one({"name": self.name})
        if res is None:
            raise Exception(f"Competition '{self.name}' not found")
        self.id = res['_id']
        logger.debug("competition '%s' updated with id %s", self.name, self.id)
        return self

    @staticmethod
    def createIndexes():
        collection.create_index([('name', pymongo.ASCENDING), ('year', pymongo.ASCENDING)], unique=True)
        logger.debug('index created on "name"')

    @staticmethod
    async def get(name: str, year: int):
        logger.debug(f"get({name}, {year})")
        competition = await collection.find_one({"$and": [{"name": name}, {"year": year}]})
        if competition is not None:
            return CompetitionModel.parse_obj(competition)
        return None

    @staticmethod
    async def getall():
        logger.debug("getall()")
        competitions = []
        for competition in await collection.find().to_list(1000):
            competitions.append(CompetitionModel.parse_obj(competition))
        return competitions

    @staticmethod
    async def delete(name: str, year: int):
        res = await collection.delete_one({"$and": [{"name": name}, {"year": year}]})
        return res.deleted_count == 1

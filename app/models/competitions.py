import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List
from fastapi.encoders import jsonable_encoder
import pymongo

from models.pilots import PilotModel
from models.judges import JudgeModel

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.competitions


class CompetitionModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    year: int = Field(..., gt=2000)
    pilots: List[str]
    judges: List[str]

    @validator('pilots')
    def check_pilots(cls, v):
        if len(v) < 2:
            raise ValueError('At least 2 pilots must be registered to a competition')
        return v

    @validator('judges')
    def check_judges(cls, v):
        if len(v) < 2:
            raise ValueError('At least 2 judges are needed for a valid competition')
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
    async def get(id: str, year: int):
        logger.debug(f"get({id}, {year})")
        if year is None:
            cond = {"_id": id}
        else:
            cond = {"$and": [{"name": id}, {"year": year}]}
        competition = await collection.find_one(cond)
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
    async def delete(id: str):
        res = await collection.delete_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        return res.deleted_count == 1

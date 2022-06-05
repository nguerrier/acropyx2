import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List
from fastapi.encoders import jsonable_encoder
import pymongo

from models.pilots import Pilot

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.teams


class Team(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    pilots: List[str]

    @validator('pilots')
    def check_pilots(cls, v):
        if len(v) != 2:
            raise ValueError('2 pilots must compose a team')
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
        for id in self.pilots:
            pilot = await Pilot.get(id)
            if pilot is None:
                raise Exception(f"Pilot '{id}' is unknown, only known pilots can be part of a team")

    async def create(self):
        try:
            await self.check()
            team = jsonable_encoder(self)
            res = await collection.insert_one(team)
            self.id = res.inserted_id
            logger.debug("team %s created with id %s", self.name, self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Team '{self.name}' already exists")

    async def update(self):
        await self.check()
        team = jsonable_encoder(self)
        del team['_id']
        await collection.update_one({"name": self.name}, {"$set": team})
        res = await collection.find_one({"name": self.name})
        if res is None:
            raise Exception(f"Team '{self.name}' not found")
        self.id = res['_id']
        logger.debug("team '%s' updated with id %s", self.name, self.id)
        return self

    @staticmethod
    def createIndexes():
        collection.create_index('name', unique=True)
        logger.debug('index created on "name"')

    @staticmethod
    async def get(id):
        logger.debug("get(%s)", id)
        team = await collection.find_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        if team is not None:
            return Team.parse_obj(team)
        return None

    @staticmethod
    async def getall():
        logger.debug("getall()")
        teams = []
        for team in await collection.find().to_list(1000):
            teams.append(Team.parse_obj(team))
        return teams

    @staticmethod
    async def delete(id: str):
        res = await collection.delete_one({ "$or": [
            {"_id": id},
            {"name": id},
        ]})
        return res.deleted_count == 1

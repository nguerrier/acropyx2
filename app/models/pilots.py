import logging
from pydantic import BaseModel, Field, validator, HttpUrl
from core.database import PyObjectId
from bson import ObjectId
from enum import Enum
from pycountry import countries
from typing import Optional, List
from datetime import datetime
from core.database import db
from fastapi.encoders import jsonable_encoder
import pymongo

logger = logging.getLogger(__name__)
collection = db.pilots

class Link(BaseModel):
    name: str
    link: HttpUrl

class Sponsor(BaseModel):
    name: str
    link: HttpUrl
    img: str


class PilotModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    civlid: int
    name: str
    link: HttpUrl
    country: str
    about: str
    links: List[Link]
    sponsors: List[Sponsor]
    photo: HttpUrl
    background_picture: HttpUrl
    last_update: datetime = Field(default_factory=datetime.now)
    rank: Optional[int]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "civlid": 1234,
            }
        }

    async def save(self):
        pilot = jsonable_encoder(self)
        logger.debug(pilot)
        try:
            res = await collection.insert_one(pilot)
            self.id = res.inserted_id
            action = "created"
        except pymongo.errors.DuplicateKeyError:
            del pilot['_id']
            await collection.update_one({"name": self.name}, {"$set": pilot})
            res = await collection.find_one({"name": self.name})
            self.id = res['_id']
            action = "updated"

        logger.debug("pilot %s %s (CIVL ID=%d, id=%s)", self.name, action, self.civlid, self.id)
        return self

    @staticmethod
    async def get(id: str):
        try:
            civlid = int(id)
        except ValueError:
            civlid = -1

        pilot = await collection.find_one({ "$or": [
            {"_id": id},
            {"name": id},
            {"civlid": civlid},
        ]})
        if pilot is not None:
            return PilotModel.parse_obj(pilot)
        return None

    @staticmethod
    async def getall(list:List[str] = []):
        if len(list) > 0:
            cond = {"name": {"$in": list}}
        else:
            cond = {}
        pilots = []
        sort=[("rank", pymongo.ASCENDING),("name", pymongo.ASCENDING)]
        for pilot in await collection.find(filter=cond, sort=sort).to_list(1000):
            pilots.append(PilotModel.parse_obj(pilot))
        return pilots

    @staticmethod
    def createIndexes():
        collection.create_index('civlid', unique=True)
        collection.create_index('name', unique=True)
        logger.debug('indexes created on "civlid" and "name"')

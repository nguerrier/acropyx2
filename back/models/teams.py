import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from datetime import datetime
import pymongo

from models.pilots import Pilot

from core.database import db, PyObjectId
logger = logging.getLogger(__name__)
collection = db.teams


class Team(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., description="The name of the team")
    pilots: List[int] = Field(..., description="The 2 pilots composing the team (by CIVLID)")
    deleted: Optional[datetime]

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
                "_id": "687687687687aze",
                "name": "Team Rocket",
                "pilots": [1234, 4567]
            }
        }

    async def check(self):
        pilots = []
        for id in self.pilots:
            pilot = await Pilot.get(id)
            if pilot is None:
                raise Exception(f"Pilot '{id}' is unknown, only known pilots can be part of a team")
            pilots.append(pilot.civlid)
        self.pilots=pilots

    async def create(self):
        await self.check()
        try:
            team = jsonable_encoder(self)
            team['deleted'] = None
            res = await collection.insert_one(team)
            self.id = res.inserted_id
            logger.debug("team %s created with id %s", self.name, self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Team '{self.name}' already exists")

    async def save(self):
        await self.check()
        team = jsonable_encoder(self)
        res =  await collection.update_one({"_id": str(self.id)}, {"$set": team})
        logger.debug(f"[{self.name}] update_one({self.id}) returned match={res.matched_count} modifiy={res.modified_count}")
        return res.modified_count == 1

    @staticmethod
    def createIndexes():
        collection.create_index([('name', pymongo.ASCENDING), ('deleted', pymongo.ASCENDING)], unique=True)
        logger.debug('index created on "name,deleted"')

    @staticmethod
    async def get(id, deleted: bool = False):
        logger.debug("get(%s)", id)
        if deleted:
            search = {"_id": id}
        else:
            search = {"_id": id, "deleted": None}
        team = await collection.find_one(search)
        if team is not None:
            logger.debug(f"get find_one -> {team}")
            return Team.parse_obj(team)
        return None

    @staticmethod
    async def getall(deleted: bool = False):
        logger.debug("getall()")
        if deleted:
            search = {}
        else:
            search = {"deleted": None}
        teams = []
        for team in await collection.find(search, sort=[("name", pymongo.ASCENDING)]).to_list(1000):
            teams.append(Team.parse_obj(team))
        return teams

    @staticmethod
    async def update(id: str, team_update):
        team = await Team.get(id)
        if team is None:
            return None

        team_update.id = team.id
        team_update.deleted = team.deleted
        return await team_update.save()

    @staticmethod
    async def delete(id: str, restore: bool = False):
        team = await Team.get(id, True)
        if team is None:
            return None

        if restore ^ (team.deleted is not None):
            return False

        if restore:
            team.deleted = None
            action = "restoring"
        else:
            team.deleted = datetime.now()
            action = "deleting"
        logger.debug(f"{action} Team {team}")
        return await team.save()

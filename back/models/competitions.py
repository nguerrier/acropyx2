import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import date, datetime

from models.pilots import Pilot
from models.judges import Judge
from models.runs import Run

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

class Competition(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str = Field(..., min_len=1)
    year: int
    pilots: List[str] = Field([])
    judges: List[str] = Field([])
    state: CompetitionState
    type: CompetitionType
    config: CompetitionConfig
    start_date: Optional[date]
    end_date: Optional[date]
    runs: List[Run]
    deleted: Optional[datetime]

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
            }
        }

    def title(self):
        return f"{self.name} - {self.year}"

    async def check(self):
        if self.year is None:
            self.year = self.start_date.year

        for id in self.pilots:
            pilot = await Pilot.get(id)
            if pilot is None:
                raise Exception(f"Pilot '{id}' is unknown, only known pilots can take part of a competition")
        for id in self.judges:
            judge = await Judge.get(id)
            if judge is None:
                raise Exception(f"Judge '{id}' is unknown, only known judges can take part of a competition")

        if self.state != CompetitionState.init:
            if len(self.pilots) < 2:
                raise Exception("At least 2 pilots are needed to open a competition")
            if len(self.judges) < 2:
                raise Exception("At least 2 judges are needed to open a competition")

        if self.start_date is not None and self.end_date is not None and self.start_date >= self.end_date:
            raise Exception("End date must be higher than start date")

        if self.start_date is None and self.state != CompetitionState.init:
            raise Exception("start_date must be set when competition is opened")

        if self.end_date is None and self.state == CompetitionState.closed:
            raise Exception("end_date must be set when competition is closed")


    async def create(self):
        try:
            self.state = CompetitionState.init
            self.deleted = None
            self.runs = []
            await self.check()
            await self.sort_pilots()
            competition = jsonable_encoder(self)
            res = await collection.insert_one(competition)
            self.id = res.inserted_id
            logger.debug("competition %s created with id %s", self.title(), self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            title = self.title()
            raise Exception(f"Competition '{title}' already exists")

    async def save(self):
        await self.check()
        await self.sort_pilots()
        competition = jsonable_encoder(self)
        res = await collection.update_one({"_id": str(self.id)}, {"$set": competition})
        return res.modified_count == 1

    async def sort_pilots(self):
        pilots = []
        # Pilot.getall return a sorted list of pilots by rank and name
        for pilot in await Pilot.getall(self.pilots):
            pilots.append(pilot.name)
        self.pilots = pilots

    @staticmethod
    def createIndexes():
        collection.create_index([('name', pymongo.ASCENDING), ('year', pymongo.ASCENDING), ('deleted', pymongo.ASCENDING)], unique=True)
        logger.debug('index created on "name,year,deleted"')

    @staticmethod
    async def get(name: str, year: int):
        logger.debug(f"get({name}, {year})")
        competition = await collection.find_one({
            "$or": [
                {"_id": name}, 
                {"$and": 
                    [
                        {"name": name},
                        {"year": year},
                        {"deleted": None}
                    ]
                }
            ]
        })
        if competition is not None:
            return Competition.parse_obj(competition)
        return None

    @staticmethod
    async def getall():
        logger.debug("getall()")
        competitions = []
        sort=[("last_update", pymongo.ASCENDING), ("name", pymongo.ASCENDING), ("year", pymongo.ASCENDING)]
        for competition in await collection.find({"deleted": None}, sort=sort).to_list(1000):
            competitions.append(Competition.parse_obj(competition))
        return competitions

    @staticmethod
    async def update(id: str, year: int, competition_update):
        competition = await Competition.get(id, year)
        if competition is None:
            return None

        logger.debug(f"got competition: {competition}")
        competition_update.id = competition.id
        return await competition_update.save()

    @staticmethod
    async def delete(id: str, year: int, restore: bool = False):
        competition = await Competition.get(id, year)
        if competition is None:
            return None

        if restore ^ (competition.deleted is not None):
            return False

        if restore:
            competition.deleted = None
            action = "restoring"
        else:
            competition.deleted = datetime.now()
            action = "deleting"
        logger.debug(f"{action} competition {competition}")
        return await competition.save()

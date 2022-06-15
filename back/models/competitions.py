import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import date, datetime

from models.pilots import Pilot
from models.teams import Team
from models.judges import Judge
from models.runs import Run, RunState
from models.tricks import Trick
from models.flights import Flight, FlightNew
from models.final_marks import FinalMark
from models.competition_configs import CompetitionConfig

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

class CompetitionNew(BaseModel):
    name: str = Field(..., min_len=1)
    start_date: date
    end_date: date
    type: CompetitionType

    async def create(self):

        competition = Competition(
            name = self.name,
            start_date = self.start_date,
            end_date = self.end_date,
            type = self.type,
            state = CompetitionState.init,
            config = CompetitionConfig(),
            repeatable_tricks = [str(trick.id) for trick in await Trick.getall(repeatable=True)],
            pilots = [],
            teams = [],
            judges = [],
            runs = [],
            deleted = None,
        )

        return await competition.create()

class Competition(CompetitionNew):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    pilots: List[int] = Field([])
    teams: List[str] = Field([])
    judges: List[str] = Field([])
    repeatable_tricks: List[str] = Field([])
    state: CompetitionState
    config: CompetitionConfig
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

    async def check(self):
        if self.type == CompetitionType.solo:
            for id in self.pilots:
                pilot = await Pilot.get(id)
                if pilot is None:
                    raise Exception(f"Pilot '{id}' is unknown, only known pilots can take part of a competition")

        if self.type == CompetitionType.synchro:
            for id in self.teams:
                team = await Team.get(id)
                if team is None:
                    raise Exception(f"Team '{id}' is unknown, only known teams can take part of a competition")

        for id in self.judges:
            judge = await Judge.get(id)
            if judge is None:
                raise Exception(f"Judge '{id}' is unknown, only known judges can take part of a competition")

        if self.state != CompetitionState.init:
            if self.type == CompetitionType.solo and len(self.pilots) < 2:
                raise Exception("At least 2 pilots are needed to open a competition")
            if self.type == CompetitionType.synchro and len(self.teams) < 2:
                raise Exception("At least 2 pilots are needed to open a competition")
            if len(self.judges) < 2:
                raise Exception("At least 2 judges are needed to open a competition")

        if self.start_date > self.end_date:
            raise Exception("End date must be higher than start date")

    async def create(self):
        try:
            self.deleted = None
            self.runs = []
            await self.check()
            competition = jsonable_encoder(self)
            res = await collection.insert_one(competition)
            self.id = res.inserted_id
            logger.debug("competition %s created with id %s", self.name, self.id)
            return self
        except pymongo.errors.DuplicateKeyError:
            raise Exception(f"Competition '{self.name}' already exists")

    async def save(self):
        await self.check()
        competition = jsonable_encoder(self)
        res = await collection.update_one({"_id": str(self.id)}, {"$set": competition})
        return res.modified_count == 1

#    async def sort_pilots(self):
#        if len(self.pilots) == 0:
#            return
#
#        pilots = []
#        # Pilot.getall return a sorted list of pilots by rank and name
#        for pilot in await Pilot.getall(self.pilots):
#            pilots.append(pilot.name)
#        self.pilots = pilots

    async def update(self, updated_comp: CompetitionNew):
        self.name = updated_comp.name
        self.start_date = updated_comp.start_date
        self.end_date = updated_comp.end_date
        if self.type != updated_comp.type and self.state != CompetitionState.init:
            raise Exception("Can't change the type of an already open or closed competition")
        self.type = updated_comp.type
        await self.save()

    async def update_pilots(self, pilots: List[int]):
        if self.type != CompetitionType.solo:
            raise Exception("Pilot's list can only be changed on a solo competition")
        self.pilots = pilots
        await self.save()

    async def update_teams(self, teams: List[str]):
        if self.type != CompetitionType.synchro:
            raise Exception("Team's list can only be changed on a synchro competition")
        self.teams = teams
        await self.save()

    async def update_judges(self, judges: List[str]):
        self.judges = judges
        await self.save()

    async def update_repeatable_tricks(self, repeatable_tricks: List[str]):
        self.repeatable_tricks = repeatable_tricks
        await self.save()

    async def update_config(self, config: CompetitionConfig):
        self.config = config
        await self.save()

    async def open(self):
        if self.state != CompetitionState.init:
            raise Exception("Can't open a comp which is not in state 'init'")

        self.state = CompetitionState.open
        await self.save()

    async def close(self):
        if self.state != CompetitionState.open:
            raise Exception("Can't close a comp which is not in state 'open'")

        self.state = CompetitionState.closed
        await self.save()

    async def reopen(self):
        if self.state != CompetitionState.closed:
            raise Exception("Can't reopen a comp which is not in state 'closed'")

        self.state = CompetitionState.open
        await self.save()

    async def new_run(self, pilots_to_qualify: int = 0):
        if self.state != CompetitionState.open:
            raise Exception("Competition must be 'open' to create a new run")

        if self.type == CompetitionType.solo:
            l = self.pilots
        else:
            l = self.teams

        if len(self.runs) > 0: # take the list of pilots from the previous run
            # TODO order by the overall ranking after the previous run
            if self.type == CompetitionType.solo:
                l = self.runs[-1].pilots
            else:
                l = self.runs[-1].teams
        else: #  first run to be added, use the list of pilots of the competition
            if self.type == CompetitionType.solo:
                # TODO order by the CIVL ranking
                l = self.pilots
            else:
                # TOOD: order by team name, fine tuning the order will be made manually
                l = self.teams

        if pilots_to_qualify > 0: # only keep the N first (best) pilots/teams of the list
            l = l[0:pilots_to_qualify]

        run = Run(
            state=RunState.init,
            type=self.type, pilots=l,
            judges=self.judges,
            config=self.config,
            repeatable_tricks=self.repeatable_tricks,
            flights=[]
        )
        self.runs.append(run)
        await self.save()
        return run

    async def run_get(self, i: int) -> Run:
        try:
            return self.runs[i]
        except IndexError:
            return None

    async def run_update_pilots(self, i: int, pilots: List[int]):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")
        if self.type != CompetitionType.solo:
            raise Exception("Pilot's list can only be changed on a solo run")
        run.pilots = pilots
        self.runs[i] = run
        await self.save()

    async def run_update_teams(self, i: int, teams: List[str]):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")
        if self.type != CompetitionType.synchro:
            raise Exception("Team's list can only be changed on a synchro run")
        run.teams = teams
        self.runs[i] = run
        await self.save()

    async def run_update_judges(self, i: int, judges: List[str]):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")
        run.judges = judges
        self.runs[i] = run
        await self.save()

    async def run_update_repeatable_tricks(self, i: int, repeatable_tricks: List[str]):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")
        run.repeatable_tricks = repeatable_tricks
        self.runs[i] = run
        await self.save()

    async def run_update_config(self, i: int, config: CompetitionConfig):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")
        run.config = config
        self.runs[i] = run
        await self.save()

    async def run_open(self, i: int):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")

        if run.state != RunState.init:
            raise Exception("Can't open a run which is not in state 'init'")

        run.state = RunState.open
        self.runs[i] = run
        await self.save()

    async def run_close(self, i: int):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")

        if run.state != RunState.open:
            raise Exception("Can't close a run which is not in state 'open'")

        run.state = RunState.closed
        self.runs[i] = run
        await self.save()

    async def run_reopen(self, i: int):
        run = await self.run_get(i)
        if run is None:
            raise Exception(f"run #{i} not found")

        if run.state != RunState.closed:
            raise Exception("Can't reopen a run which is not in state 'close'")

        run.state = RunState.open
        self.runs[i] = run
        await self.save()

    async def flight_simulate(self, i: int, civlid: int, flight: FlightNew) -> FinalMark:
        return None

#
#
#   Static methods
#
#
    @staticmethod
    def createIndexes():
        collection.create_index([('name', pymongo.ASCENDING), ('deleted', pymongo.ASCENDING)], unique=True)
        logger.debug('index created on "name,deleted"')

    @staticmethod
    async def get(id: str, deleted: bool = False):
        if deleted:
            search = {"_id": id}
        else:
            search = {"_id": id, "deleted": None}
        competition = await collection.find_one(search)
        if competition is not None:
            return Competition.parse_obj(competition)
        return None

    @staticmethod
    async def getall():
        competitions = []
        for competition in await collection.find({"deleted": None}, sort=[("name", pymongo.ASCENDING)]).to_list(1000):
            competitions.append(Competition.parse_obj(competition))
        return competitions

    @staticmethod
    async def delete(id: str, restore: bool = False):
        competition = await Competition.get(id, True)
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
        return await competition.save()

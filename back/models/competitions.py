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
from models.judge_marks import JudgeMark

from core.database import db, PyObjectId
from core.config import settings
from core.utils import weight_average, average

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


        pilots = []
        teams = []
        if self.type == CompetitionType.solo:
            pilots = self.pilots
        else:
            teams = self.teams

        if len(self.runs) > 0: # take the list of pilots from the previous run
            # TODO order by the overall ranking after the previous run
            if self.type == CompetitionType.solo:
                pilots = self.runs[-1].pilots
            else:
                teams = self.runs[-1].teams
        else: #  first run to be added, use the list of pilots of the competition
            if self.type == CompetitionType.solo:
                # TODO order by the CIVL ranking
                pilots = self.pilots
            else:
                # TOOD: order by team name, fine tuning the order will be made manually
                teams = self.teams

        if pilots_to_qualify > 0: # only keep the N first (best) pilots/teams of the list
            pilots = pilots[0:pilots_to_qualify]
            teams = teams[0:pilots_to_qualify]

        run = Run(
            state=RunState.init,
            type=self.type,
            pilots=pilots,
            teams=teams,
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


    async def flight_convert(self, civlid: int, flight: FlightNew) -> Flight:
        tricks = []
        errors = []
        for trick_name in flight.tricks:
            trick = await Trick.get_score(trick_name,
                solo  = (self.type==CompetitionType.solo),
                synchro = (self.type==CompetitionType.synchro),
            )
            if trick is None:
                errors.append(trick_name)
            else:
                tricks.append(trick)

        if len(errors) > 0:
            errors = ' '.join(errors)
            raise Exception(f"Unknown trick(s): {errors}")


        return Flight(
                pilot = civlid,
                tricks = tricks,
                marks = flight.marks,
                did_not_start = flight.did_not_start,
                warnings = flight.warnings,
        )

    async def flight_save(self, run_i: int, civlid: int, flight: FlightNew, save: bool=False, published: bool=False) -> FinalMark:
        try:
            run = self.runs[run_i]
        except IndexError:
            raise Exception(f"Run number #{i} not found in this comp ({self.name})")

        if civlid not in run.pilots:
            raise Exception(f"Pilot #{civlid} does not participate in the run number #{i} of the comp ({self.name})")

        if civlid not in self.pilots:
            raise Exception(f"Pilot #{civlid} does not participate in this comp ({self.name})")

        new_flight = await self.flight_convert(civlid, flight)
        mark = await self.calculate_score(flight=new_flight, run_i=run_i)
        logger.debug(mark)
        if not save:
            return mark

        new_flight.final_marks = mark
        new_flight.published = published

        for i, f in enumerate(self.runs[run_i].flights):
            if f.pilot == new_flight.pilot:
                logger.debug(f"replace existing for {civlid}")
                self.runs[run_i].flights[i] = new_flight
                await self.save()
                return mark

        logger.debug(f"Adding new flight for {civlid}")
        self.runs[run_i].flights.append(new_flight)
        await self.save()
        return mark


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






    async def calculate_score(self, flight: Flight, run_i: int = -1) -> FinalMark:
        mark = FinalMark(
            judges_mark = JudgeMark(
                judge = "Average of judges marks",
                technical = 0,
                choreography = 0,
                landing = 0,
                synchro = 0,
            ),
            technicity=0,
            bonus_percentage=0,
            technical=0,
            choreography=0,
            landing=0,
            synchro=0,
            bonus=0,
            score=0,
            warnings=flight.warnings,
            malus=0,
        )

        if flight.did_not_start:
            mark.notes.append(f"Got 0 because of DNS")
            return mark

        if run_i < 0:
            run = None
        else:
            try:
                run = self.runs[run_i]
            except IndexError:
                run = None

        if run is None:
            config = self.config
        else:
            config = run.config


        #
        # count previous warnings and check if not previous DSQ
        #
        previous_warnings = 0
        if run_i>0 and run is not None:

            # loop over all previous runs
            for i in range(len(self.runs)):
                if i >= run_i:
                    break
                r = self.runs[i]
                for f in r.flights:
                    if flight.pilot == f.pilot:
                        previous_warnings += len(f.warnings)
                        break

            if previous_warnings >= config.warnings_to_dsq:
                mark.notes.append(f"Pilot has been DSQ because he/she already had {config.warnings_to_dsq} warnings")
                return mark

        if len(mark.warnings) + previous_warnings >= config.warnings_to_dsq:
            mark.notes.append(f"Pilot has been DSQ he/she's got {config.warnings_to_dsq} warnings")
            return mark
        #
        # end of checking warning to DSQ
        #


        # calculate the average of judges marks
        # using the weight of each judge level
        technicals = []
        choreographies = []
        landings = []
        synchros = []
        for m in flight.marks:
            judge = await Judge.get(m.judge)
            if judge is None:
                raise Exception(f"judge '{m.judge}' not found")
            weight = dict(config.judge_weights)[judge.level.value]
            technicals.append((m.technical, weight))
            choreographies.append((m.choreography, weight))
            landings.append((m.landing, weight))
            if self.type == CompetitionType.synchro:
                if m.synchro is None:
                    raise Exception(f"synchro mark is missing. It is mandatory for {self.type} runs")
                synchros.append((m.synchro, weight))

        mark.judges_mark.technical = weight_average(technicals)
        mark.judges_mark.choreography = weight_average(choreographies)
        mark.judges_mark.landing = weight_average(landings)
        if self.type == CompetitionType.synchro:
            mark.judges_mark.synchro = weight_average(synchros)
        #
        # endof calculating the weight average of the judges marks
        #


        #
        # ignore trick with bonus higher than the maximum bonus tricks allowed
        #
        tricks = [] # the list of tricks that will be used to calculate the scores
        n_bonuses = {}
        i = 0
        for trick in flight.tricks:
            i += 1
            ignoring = False
            for bonus_type in trick.bonus_types:
                if bonus_type not in n_bonuses:
                    n_bonuses[bonus_type] = 0

                n_bonuses[bonus_type] += 1

                max = dict(config.max_bonus_per_run)[bonus_type]

                if n_bonuses[bonus_type] > max:
                    logger.warning(f"Ignoring trick #{i} ({trick}) because already {max} tricks have been flown")
                    mark.notes.append(f"trick number #{i} ({trick.name}) has been ignored because more than {max} {bonus_type} tricks have been flown")
                    ignoring = True

            if not ignoring:
                tricks.append(trick)
        #
        # endof ignore tricks max_bonus_per_run
        #


        #
        # search for repetitions
        # §6.5.1 from 7B
        # each trick can be performed left/right and reversed without malus
        # during the same competition
        # search in the previous runs
        # and in the current un from the previous tricks flown
        #

        repeatable_tricks=[]
        for trick in self.repeatable_tricks:
            trick = await Trick.get(trick)
            if trick is not None:
                repeatable_tricks.append(trick.name)

        if len(self.runs) > 0 and run_i > 0:
            trick_i = 0
            for trick in tricks: # for each trick detect repetition before
                trick_i += 1
                if trick.base_trick in repeatable_tricks:
                    continue
                # loop over all previous runs
                for i in range(len(self.runs)):
                    if i >= run_i:
                        break
                    r = self.runs[i]
                    broke = False
                    for f in r.flights:
                        if flight.pilot != f.pilot:
                            continue
                        for t in f.tricks:
                            logger.log(f"-> {t}")
                            if t.base_trick == trick.base_trick and t.uniqueness == trick.uniqueness:
                                mark.malus += config.malus_repetition
                                mark.notes.append(f"trick number #{trick_i} ({trick.name}) has already been performed in a previous run. Adding a {config.malus_repetition}% malus.")
                                broke = True
                                break
                    if broke:
                        break

        trick_i = 0
        for trick in tricks: # for each trick detect repetition before
            trick_i += 1
            if trick.base_trick in repeatable_tricks:
                continue
            t_i = 0
            for t in tricks:
                t_i += 1
                if t_i >= trick_i:
                    break
                if t.base_trick == trick.base_trick and t.uniqueness == trick.uniqueness:
                    mark.malus += config.malus_repetition
                    mark.notes.append(f"trick number #{trick_i} ({trick.name}) has already been performed in this run. Adding a {config.malus_repetition}% malus.")
                    break
        #
        # endof search for repetitions
        #


        technicals = []
        bonuses = []
        for trick in tricks:
            # calculate the bonus of the run as stated in 7B
            # §6.6.1 Twisted manoeuvres bonus
            if trick.bonus > 0:
                bonuses.append(trick.bonus)

            # as stated in 7B §
            # If more than 5 manoeuvres are flown twisted, the extra manoeuvres will not
            # be scored and their coefficients not taken into account for the
            # determination of the average coefficient.
            technicals.append(trick.technical_coefficient)

        # calculate the technicity of the run as stated in 7B 
        # §"6.3.1.1 Technicity in Solo"
        # The technicity is a difficulty coefficient calculated as the average
        # of the 3 highest coefficient manoeuvres flown during the run.
        technicals = sorted(technicals, reverse=True)
        mark.technicity = average(technicals[0:3])

        # calculate the bonus of the run as stated in 7B
        # §6.6.1 Twisted manoeuvres bonus
        # -> it is implied that the bonus is the sum of the bonuses limited to 5
        mark.bonus_percentage = sum(bonuses)

        mark_percentage = dict(config.mark_percentages)[self.type.value]
        mark.technical = mark.technicity * mark.judges_mark.technical * mark_percentage.technical / 100


        mark.choreography = mark.judges_mark.choreography * mark_percentage.choreography / 100 
        if mark.malus >= 100:
            mark.choreography = 0
        else:
            mark.choreography = mark.choreography * (100 - mark.malus) / 100

        mark.landing = mark.judges_mark.landing * mark_percentage.landing / 100

        if type == CompetitionType.synchro:
            mark.synchro = mark.judges_mark.synchro * mark_percentage.synchro / 100

        mark.bonus = (mark.technical + mark.choreography) * mark.bonus_percentage / 100

        mark.score = mark.technical + mark.choreography + mark.landing + mark.bonus

        # remove warning deduction points
        # 0.5 per warnings
        # §7.2.2 in 7B
        mark.score -= ((len(mark.warnings) - previous_warnings)* config.warning)
        if mark.score < 0:
            mark.score = 0

        return mark

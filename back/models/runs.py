import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.flights import Flight
from models.competition_configs import CompetitionConfig

from core.config import settings

logger = logging.getLogger(__name__)

class RunState(str, Enum):
    init = 'init'
    open = 'open'
    closed = 'closed'

class Run(BaseModel):
    state: RunState
    pilots: List[str] = Field(..., min_len=1)
    teams: List[str] = Field(..., min_len=1)
    judges: List[str] = Field(..., min_len=1)
    repeatable_tricks: List[str]
    config: CompetitionConfig
    flights: List[Flight]

    class Config:
        schema_extra = {
            "example": {
                "state": "init",
                "pilots": [1234, 4567],
                "judges": ["bb1726576153281283", "ba789798798798798798"],
                "flights": [],
                "competitionConfig": {
                    "warning": 0.5,
                    "malus_repetition": 13
                }
            }
        }


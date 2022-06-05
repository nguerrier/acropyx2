import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.flights import Flight

from core.config import settings

logger = logging.getLogger(__name__)

class RunState(str, Enum):
    init = 'init'
    open = 'open'
    closed = 'closed'

class Run(BaseModel):
    state: RunState
    start: Optional[datetime]
    end: Optional[datetime]
    pilots: List[str] = Field(..., min_len=1)
    judges: List[str] = Field(..., min_len=1)
    flights: List[Flight]

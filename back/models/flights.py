import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.pilots import Pilot
from models.tricks import Trick
from models.unique_tricks import UniqueTrick
from models.judge_marks import JudgeMark
from models.final_marks import FinalMark

from core.config import settings

logger = logging.getLogger(__name__)

class Flight(BaseModel):
    pilot: int
    tricks: List[UniqueTrick]
    marks: List[JudgeMark]
    did_not_start: bool = False
    final_marks: Optional[FinalMark]
    published: bool = False
    warnings: List[str]

class FlightNew(BaseModel):
    tricks: List[str]
    marks: List[JudgeMark]
    did_not_start: bool = False
    warnings: List[str] = []

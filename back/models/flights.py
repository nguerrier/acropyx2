import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.pilots import Pilot
from models.judges import JudgeModel
from models.tricks import Trick
from models.judge_marks import JudgeMark
from models.final_marks import FinalMark

from core.config import settings

logger = logging.getLogger(__name__)

class Flight(BaseModel):
    pilot: str
    tricks: List[Trick]
    marks: List[JudgeMark]
    final_marks: FinalMark

import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from core.config import settings

from models.judge_marks import JudgeMark

class FinalMark(BaseModel):
    judges_mark: JudgeMark
    technicity: float = Field(..., ge=0)
    bonus_percentage: float = Field(..., ge=0)
    technical: float = Field(..., ge=0)
    choreography: float = Field(..., ge=0)
    landing: float = Field(..., ge=0)
    bonus: float = Field(..., ge=0)
    score: float = Field(..., ge=0)
    synchro: float = Field(..., ge=0)
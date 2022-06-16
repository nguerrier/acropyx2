import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional; validator
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from core.config import settings
from core.utils import float2digits, float3digits

from models.judge_marks import JudgeMark

class FinalMark(BaseModel):
    judges_mark: JudgeMark
    technicity: float = Field(..., ge=0)
    bonus_percentage: float = Field(..., ge=0)
    technical: float = Field(..., ge=0)
    choreography: float = Field(..., ge=0)
    landing: float = Field(..., ge=0)
    synchro: float = Field(..., ge=0)
    bonus: float = Field(..., ge=0)
    score: float = Field(..., ge=0)
    warnings: list[str]
    malus: float = Field(..., ge=0)
    notes: List[str] = []

    _technicity = validator('technicity', allow_reuse=True)(float3digits)
    _bonus_percentage = validator('bonus_percentage', allow_reuse=True)(float3digits)
    _technical = validator('technical', allow_reuse=True)(float3digits)
    _choreography = validator('choreography', allow_reuse=True)(float3digits)
    _landing = validator('landing', allow_reuse=True)(float3digits)
    _synchro = validator('synchro', allow_reuse=True)(float3digits)
    _bonus = validator('bonus', allow_reuse=True)(float3digits)
    _score = validator('score', allow_reuse=True)(float3digits)

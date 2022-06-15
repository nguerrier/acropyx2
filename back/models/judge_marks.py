import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.judges import Judge

from core.config import settings
from core.utils import float3digits

class JudgeMark(BaseModel):
    judge: str
    technical: float = Field(..., ge=0)
    choreography: float = Field(..., ge=0)
    landing: float = Field(..., ge=0)
    synchro: Optional[float] = Field(None, ge=0)

    _technical = validator('technical', allow_reuse=True)(float3digits)
    _choreography = validator('choreography', allow_reuse=True)(float3digits)
    _landing = validator('landing', allow_reuse=True)(float3digits)
    _synchro = validator('synchro', allow_reuse=True)(float3digits)

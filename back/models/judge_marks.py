import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.judges import JudgeModel

from core.config import settings

class JudgeMark(BaseModel):
    judge: str
    technical: float = Field(..., ge=0)
    choreography: float = Field(..., ge=0)
    landing: float = Field(..., ge=0)
    synchro: Optional[float]

import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.judge_marks import JudgeMark
from models.tricks import Trick

from core.config import settings

logger = logging.getLogger(__name__)

class SimpleFlight(BaseModel):
    tricks: List[str]
    mark: JudgeMark

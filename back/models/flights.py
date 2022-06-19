import logging
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import List, Optional
from fastapi.encoders import jsonable_encoder
import pymongo
from enum import Enum
from datetime import datetime

from models.pilots import Pilot
from models.tricks import Trick, UniqueTrick
from models.marks import JudgeMark, FinalMark, FinalMarkExport, JudgeMarkExport

from core.config import settings

log = logging.getLogger(__name__)

class FlightExport(BaseModel):
    pilot: Pilot
    tricks: List[UniqueTrick]
    marks: List[JudgeMarkExport]
    did_not_start: bool = False
    final_marks: Optional[FinalMarkExport]
    published: bool = False
    warnings: List[str]

class Flight(BaseModel):
    pilot: int
    tricks: List[UniqueTrick]
    marks: List[JudgeMark]
    did_not_start: bool = False
    final_marks: Optional[FinalMark]
    published: bool = False
    warnings: List[str]

    class Config:
        schema_extra = {
            "example": {
                "pilot": 1234,
                "tricks": [],
                "marks": [],
                "did_not_start": False,
                "final_marks": {},
                "published": False,
                "warnings": []
            }
        }

    async def export(self) -> FlightExport:

        marks = []
        for mark in self.marks:
            marks.append(await mark.export())

        return FlightExport(
            pilot = await Pilot.get(self.pilot),
            tricks = self.tricks,
            marks = marks,
            did_not_start = self.did_not_start,
            final_marks = await self.final_marks.export(),
            published = self.published,
            warnings = self.warnings,
        )

class FlightNew(BaseModel):
    tricks: List[str]
    marks: List[JudgeMark]
    did_not_start: bool = False
    warnings: List[str] = []

    class Config:
        schema_extra = {
            "example": {
                "tricks": ["LM", "Right Misty Flip"],
                "marks": [],
                "did_not_start": False,
                "warnings": []
            }
        }

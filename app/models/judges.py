from pydantic import BaseModel, Field, validator
from core.database import PyObjectId
from bson import ObjectId
from enum import Enum
from pycountry import countries
from typing import Optional

def check_country(cls, v):
    assert countries.get(alpha_2=v) is not None, f"Invalid country '{v}'"
    return v

class JudgeLevel(Enum):
    trainee = "trainee"
    certified = "certified"
    senior = "senior"


class JudgeModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    name: str
    country: str
    level: JudgeLevel

    _normalize_country = validator('country', allow_reuse=True)(check_country)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "country": "fr",
                "level": "certified",
            }
        }


class UpdateJudgeModel(BaseModel):
    name: Optional[str]
    country: Optional[str]
    level: Optional[JudgeLevel]

    _normalize_country = validator('country', allow_reuse=True)(check_country)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "country": "fr",
                "level": "certified",
            }
        }


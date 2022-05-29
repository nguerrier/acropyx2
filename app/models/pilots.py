from pydantic import BaseModel, Field, validator, HttpUrl
from core.database import PyObjectId
from bson import ObjectId
from enum import Enum
from pycountry import countries
from typing import Optional, List
from datetime import datetime

class Link(BaseModel):
    name: str
    link: HttpUrl

class Sponsor(BaseModel):
    name: str
    link: HttpUrl
    img: str


class PilotModel(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    civlid: int
    name: str
    link: HttpUrl
    country: str
    about: str
    links: List[Link]
    sponsors: List[Sponsor]
    photo: HttpUrl
    background_picture: HttpUrl
    last_update: datetime = datetime.now()

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "civlid": 1234,
            }
        }


class UpdatePilotModel(BaseModel):
    civlid: Optional[int]
    name: Optional[str]

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "John Doe",
                "civlid": 1234,
            }
        }


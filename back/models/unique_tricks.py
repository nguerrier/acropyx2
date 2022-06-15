import logging
from pydantic import BaseModel
from typing import List
logger = logging.getLogger(__name__)

class UniqueTrick(BaseModel):
    name: str
    acronym: str
    technical_coefficient: float
    bonus: float
    bonus_types: List[str]

    class Config:
        schema_extra = {
            "example": {
                "name": "twisted left Misty to Helicopter reverse",
                "acronym": "/LMHR",
                "technical_coefficient": 1.75,
                "bonus": 6,
                "bonus_types": ["twist", "reverse"]
            }
        }

import logging
from pydantic import BaseModel
logger = logging.getLogger(__name__)

class UniqueTrick(BaseModel):
    name: str
    acronym: str
    technical_coefficient: float
    bonus: float

    class Config:
        schema_extra = {
            "example": {
                "name": "twisted left Misty to Helicopter reverse",
                "acronym": "/LMHR",
                "technical_coefficient": 1.75,
                "bonus": 6
            }
        }

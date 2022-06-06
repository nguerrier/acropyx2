import logging
from pydantic import BaseModel, Field, validator
from core.config import settings

logger = logging.getLogger(__name__)

class Bonus(BaseModel):
    name: str = Field(..., min_length=1)
    bonus: float = Field(..., ge=0.0)

    class Config:
        schema_extra = {
            "example": {
                "name": "twisted",
                "bonus": 2.5
            }
        }


    @validator('name')
    def check_name(cls, v):
        bonuses = list(map(lambda x:x['name'], settings.tricks.available_bonuses))
        if v not in bonuses:
            bonuses = ", ".join(bonuses)
            raise ValueError(f"Invalid bonus ({v}), must be one of: {bonuses}")
        return v

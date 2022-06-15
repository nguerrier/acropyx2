import logging
from pydantic import BaseModel
from typing import Optional

class Status(BaseModel):
    version: str
#    mongo: Optional[dict]

    class Config:
        schema_extra = {
            "example": {
                "version":"2.0.1",
#                "mongo":{
#                    "version":"5.0.8","gitVersion":"c87e1c23421bf79614baf500fda6622bd90f674e"
#                }
            }
        }

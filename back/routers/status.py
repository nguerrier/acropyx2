from fastapi import APIRouter, Depends

from core.security import auth
from core.config import settings
from core.database import db
from models.status import Status

status = APIRouter()

@status.get(
    "/",
    response_model=Status,
)
async def get():
    ret = Status.parse_obj({
        "version": settings.VERSION,
#        "mongo": await db.command("buildinfo"),
    })

    return ret

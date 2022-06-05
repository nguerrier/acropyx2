from fastapi import APIRouter, Depends
from core.security import auth
from core.database import db
from core.config import settings

status = APIRouter()

@status.get("/", dependencies=[Depends(auth)])
async def get():
    return {
        "version": settings.VERSION,
        "mongo": await db.command("buildinfo"),
    }

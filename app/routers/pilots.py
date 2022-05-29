from fastapi import APIRouter, Depends
from core.security import auth
from core.database import db

pilots = APIRouter()

@pilots.get("/")
async def list():
    return {"message": "list of pilots"}

@pilots.post("/", dependencies=[Depends(auth)])
async def create_new():
    return {"message": "new pilot", "test": await db.command("buildinfo")}

@pilots.get("/{civl_id}")
async def get(civl_id: int):
    return {"message": "get pilot", "civl_id": civl_id}

from fastapi import APIRouter

#from app.api.api_v1.endpoints import items, login, users, utils
from routers.status import status
from routers.pilots import pilots
from routers.judges import judges
from routers.teams import teams
from routers.tricks import tricks

router = APIRouter()
router.include_router(status, prefix="/status", tags=["status"])
router.include_router(pilots, prefix="/pilots", tags=["pilots"])
router.include_router(judges, prefix="/judges", tags=["judges"])
router.include_router(teams, prefix="/teams", tags=["teams"])
router.include_router(tricks, prefix="/tricks", tags=["tricks"])

import core.logging
import logging
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from core.config import settings
from routers.api import router
from controllers.judges import judges_start
from controllers.pilots import pilots_start
from controllers.teams import teams_start
from controllers.tricks import tricks_start
from controllers.competitions import competitions_start

logger = logging.getLogger(__name__)
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.PROJECT_DESCRIPTION,
    version=settings.VERSION,
    contact={
        "name": "Jérôme Loyet",
        "url": "https://github.com/fatpat",
        "email": "jerome@loyety.net",
    },
    license_info= {
        "name": "WTFPL 2",
        "url": "http://www.wtfpl.net/txt/copying/"
    }
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
async def startup_event():
    logger.debug("starup_event()")
    judges_start()
    pilots_start()
    teams_start()
    tricks_start()
    competitions_start()

app.include_router(router)

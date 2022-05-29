from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from routers.api import router
from core.config import settings

from routers.judges import judges_start

app = FastAPI(title=settings.PROJECT_NAME)

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
    judges_start()

app.include_router(router)

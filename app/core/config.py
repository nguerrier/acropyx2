import secrets
from typing import List, Union

from pydantic import AnyHttpUrl, BaseSettings, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "acropyx"
    VERSION: str = "2.0.1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    SERVER_NAME: str = PROJECT_NAME
    SERVER_HOST: AnyHttpUrl = "http://localhost:8000"
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000", \
    # "http://localhost:8080", "http://local.dockertoolbox.tiangolo.com"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    MONGODB_URL: str = 'mongodb://mongo:mongo@127.0.0.1/?retryWrites=true&w=majority'
    DATABASE: str = 'acropyx2'
    # no auth by default
    ADMIN_USER: str = 'admin'
    ADMIN_PASS: str = None

    class Config:
        case_sensitive = True

    class pilots:
        civl_link_all_pilots = 'https://civlcomps.org/ranking/export?rankingId=1481&type=export_pilots_ranking'
        civl_link_one_pilot = 'https://civlcomps.org/pilot/'


settings = Settings()

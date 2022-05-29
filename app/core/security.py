import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from core.config import settings

security = HTTPBasic()

def auth_http_basic(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, settings.ADMIN_USER)
    correct_password = secrets.compare_digest(credentials.password, settings.ADMIN_PASS)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return True

def no_auth():
    return True

if settings.ADMIN_USER is not None and settings.ADMIN_PASS is not None:
    auth = auth_http_basic
else:
    auth = no_auth

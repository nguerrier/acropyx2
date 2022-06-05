import logging
from models.teams import Team

logger = logging.getLogger(__name__)

def teams_start():
    Team.createIndexes()

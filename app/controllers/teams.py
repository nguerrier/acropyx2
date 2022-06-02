import logging
from models.teams import TeamModel

logger = logging.getLogger(__name__)

def teams_start():
    TeamModel.createIndexes()

import logging
from models.competitions import CompetitionModel

logger = logging.getLogger(__name__)

def competitions_start():
    CompetitionModel.createIndexes()

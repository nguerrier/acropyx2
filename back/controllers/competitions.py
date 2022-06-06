import logging
from models.competitions import Competition

logger = logging.getLogger(__name__)

def competitions_start():
    Competition.createIndexes()

import logging
from models.judges import Judge

logger = logging.getLogger(__name__)

def judges_start():
    Judge.createIndexes()

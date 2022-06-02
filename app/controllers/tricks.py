import logging
from models.tricks import TrickModel

logger = logging.getLogger(__name__)

def tricks_start():
    TrickModel.createIndexes()

import logging
from models.judges import JudgeModel

logger = logging.getLogger(__name__)

def judges_start():
    JudgeModel.createIndexes()

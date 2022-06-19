import logging
from models.competitions import Competition

log = logging.getLogger(__name__)


class CompCtrl:
    @staticmethod
    def start():
        Competition.createIndexes()

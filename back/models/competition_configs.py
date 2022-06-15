import logging
from pydantic import BaseModel, Field
from typing import Optional

from core.config import settings

class CompetitionConfig(BaseModel):

    warning: float = Field(settings.competitions.warning, description="The point deduction for a warning")
    malus_repetition: float = Field(settings.competitions.malus_repartition, description="% reduction malus of choreography for repetition")
    warnings_to_dsq: int = Field(settings.competitions.warnings_to_dsq, description="number of warnings in a comp that lead to DSQ")
    judges_weight_senior: int = Field(settings.competitions.judges_weight_senior, description="weight of a senior judge's mark")
    judges_weight_certified: int = Field(settings.competitions.judges_weight_certified, description="weight of a certified judge's mark")
    judges_weight_trainee: int = Field(settings.competitions.judges_weight_trainee, description="weight of a trainee judge's mark")
    mark_percentage_solo_technical: int = Field(settings.competitions.mark_percentage_solo_technical, description="% of the technical part in the final score for solo runs")
    mark_percentage_solo_choreography: int = Field(settings.competitions.mark_percentage_solo_choreography, description="% of the choreography part in the final score for solo runs")
    mark_percentage_solo_landingg: int = Field(settings.competitions.mark_percentage_solo_technical, description="% of the technical part in the final score for solo runs")
    mark_percentage_synchro_technical: int = Field(settings.competitions.mark_percentage_synchro_technical, description="% of the technical part in the final score for synchro runs")
    mark_percentage_synchro_choreography: int = Field(settings.competitions.mark_percentage_synchro_choreography, description="% of the choreography part in the final score for synchro runs")
    mark_percentage_synchro_landingg: int = Field(settings.competitions.mark_percentage_synchro_technical, description="% of the technical part in the final score for synchro runs")
    mark_percentage_synchro_synchrog: int = Field(settings.competitions.mark_percentage_synchro_technical, description="% of the technical part in the final score for synchro runs")
    max_bonus_twisted_per_run: int = Field(settings.competitions.max_bonus_twisted_per_run, description="maximum number of twisted tricks per run")
    max_bonus_reverse_per_run: int = Field(settings.competitions.max_bonus_reverse_per_run, description="maximum number of reverse tricks per run")
    max_bonus_flip_per_run: int = Field(settings.competitions.max_bonus_flip_per_run, description="maximum number of flip tricks per run")


    class Config:
        schema_extra = {
            "example": {
                "version":"2.0.1",
#                "mongo":{
#                    "version":"5.0.8","gitVersion":"c87e1c23421bf79614baf500fda6622bd90f674e"
#                }
            }
        }


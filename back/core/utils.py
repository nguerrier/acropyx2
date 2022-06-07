from typing import List
from statistics import mean

def average(list: List[float]) -> float:
    if len(list) == 0:
        return 0.0
    return mean(list)


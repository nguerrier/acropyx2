from typing import List
from statistics import mean

def average(list: List[float]) -> float:
    if len(list) == 0:
        return 0.0
    return mean(list)

def weight_average(list: List[tuple]) -> float:
    if len(list) == 0:
        return 0.0

    top = 0.0
    bottom = 0.0
    for t in list:
        (v, w) = t
        if w <= 0:
            next
        top += (v*w)
        bottom += w

    if bottom <= 0:
        return 0.0

    return top/bottom

def float2digits(cls, v: float) -> float:
    return round(v, 2)

def float3digits(cls, v: float) -> float:
    return round(v, 3)

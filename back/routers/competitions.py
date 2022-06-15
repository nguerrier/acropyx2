import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
from core.security import auth
from models.competitions import Competition, CompetitionNew, CompetitionState
from models.competition_configs import CompetitionConfig
from models.runs import Run
from typing import List
from fastapi.responses import Response

logger = logging.getLogger(__name__)
competitions = APIRouter()

#
# Get all competitions
#
@competitions.get(
    "/",
    response_description="List all competitions",
    response_model=List[Competition],
    dependencies=[Depends(auth)]
)
async def list():
    return await Competition.getall()

#
# Get one competition
#
@competitions.get(
    "/{id}",
    response_description="Get a Competition",
    response_model=Competition,
    dependencies=[Depends(auth)]
)
async def get_by_id(id: str, deleted: bool = False):
    comp = await Competition.get(id, deleted)
    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition '{id}' not found")
    return comp

#
# Create a new Competition
#
@competitions.post(
    "/",
    status_code=201,
    response_description="Add new Competition",
    response_model=Competition,
    dependencies=[Depends(auth)],
)
async def create(competition: CompetitionNew = Body(...)):
    try:
        return await competition.create()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#
# Update a Competition
#
@competitions.patch(
    "/{id}",
    status_code=204,
    response_description="Update a competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def update(id: str, updated_comp: CompetitionNew = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update(updated_comp)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Pilot list
#
@competitions.patch(
    "/{id}/pilots",
    status_code=204,
    response_description="Replace the pilot's list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_pilots(id: str, pilots: List[int] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update_pilots(pilots)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Teams list
#
@competitions.patch(
    "/{id}/teams",
    status_code=204,
    response_description="Replace the teams's list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_teams(id: str, teams: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update_teams(teams)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Judges list
#
@competitions.patch(
    "/{id}/judges",
    status_code=204,
    response_description="Replace the judge's list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_judges(id: str, judges: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update_judges(judges)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Repeatable Tricks list
#
@competitions.patch(
    "/{id}/repeatable_tricks",
    status_code=204,
    response_description="Replace the repeatable tricks list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_repeatable_tricks(id: str, repeatable_tricks: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update_repeatable_tricks(repeatable_tricks)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")


#
# Update Config
#
@competitions.patch(
    "/{id}/config",
    status_code=204,
    response_description="Replace the competition config",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_config(id: str, config: CompetitionConfig = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.update_config(config)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def delete(id: str, restore: bool = False):
    try:
        res = await Competition.delete(id, restore)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    if res is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

    if res is False:
        if restore:
            raise HTTPException(status_code=409, detail=f"Competition {id} is not marked as deleted")
        else:
            raise HTTPException(status_code=409, detail=f"Competition {id} is already marked as deleted")

@competitions.post(
    "/{id}/open",
    status_code=204,
    response_description="Open a competition (change status from not started to open)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def open(id: str):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.open()
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/close",
    status_code=204,
    response_description="Close a competition (change status from open to close)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def close(id: str):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.close()
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/reopen",
    status_code=204,
    response_description="Reopen a closed competition (change status from close to open)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def close(id: str):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.reopen()
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/runs/",
    status_code=201,
    response_description="Create a new run for a competition",
    response_model=Run,
    dependencies=[Depends(auth)],
)
async def new_run(id: str, pilots_to_qualify: int = 0):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            return await comp.new_run(pilots_to_qualify)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Run Pilot list
#
@competitions.patch(
    "/{id}/runs/{i}/pilots",
    status_code=204,
    response_description="Replace the run pilots list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_run_pilots(id: str, i: int, pilots: List[int] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_update_pilots(i, pilots)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Teams list
#
@competitions.patch(
    "/{id}/runs/{i}/teams",
    status_code=204,
    response_description="Replace the run teams list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_run_teams(id: str, i: int, teams: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_update_teams(i, teams)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Judges list
#
@competitions.patch(
    "/{id}/runs/{i}/judges",
    status_code=204,
    response_description="Replace the run judges list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_run_judges(id: str, i: int, judges: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_update_judges(i, judges)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

#
# Update Repeatable Tricks list
#
@competitions.patch(
    "/{id}/runs/{i}/repeatable_tricks",
    status_code=204,
    response_description="Replace the run repeatable tricks list",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_run_repeatable_tricks(id: str, i: int, repeatable_tricks: List[str] = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_update_repeatable_tricks(i, repeatable_tricks)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")


#
# Update Config
#
@competitions.patch(
    "/{id}/runs/{i}/config",
    status_code=204,
    response_description="Replace the run config",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def patch_run_config(id: str, i: int, config: CompetitionConfig = Body(...)):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_update_config(i, config)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/runs/{i}/open",
    status_code=204,
    response_description="Open a run (change status from not started to open)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def run_open(id: str, i: int):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_open(i)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/runs/{i}/close",
    status_code=204,
    response_description="Close a run (change status from not started to open)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def run_close(id: str, i: int):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_close(i)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")

@competitions.post(
    "/{id}/runs/{i}/reopen",
    status_code=204,
    response_description="Reopen a run (change status from not started to open)",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def run_reopen(id: str, i: int):
    try:
        comp = await Competition.get(id)
        if comp is not None:
            await comp.run_reopen(i)
    except Exception as e:
        raise  HTTPException(status_code=400, detail=str(e))

    if comp is None:
        raise HTTPException(status_code=404, detail=f"Competition {id} not found")


@competitions.get(
    "/{id}/results",
    status_code=204,
    response_description="Download a PDF of the results of the competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def get_all_results(id: str):
    #TODO
    pass

@competitions.get(
    "/{id}/results/{num}",
    status_code=204,
    response_description="Download a PDF of the results of a specific run of competition",
    response_class=Response,
    dependencies=[Depends(auth)],
)
async def get_all_results(id: str, num: int):
    #TODO
    pass

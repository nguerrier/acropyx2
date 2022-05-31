import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException, BackgroundTasks
from core.security import auth
from core.database import db
from core.config import settings
from models.pilots import PilotModel, UpdatePilotModel
from typing import Optional, List
from fastapi.encoders import jsonable_encoder
from fastapi.responses import Response
import pymongo
from pydantic.error_wrappers import ValidationError
import httpx
from openpyxl import load_workbook
from tempfile import NamedTemporaryFile
#from lxml.cssselect import CSSSelector
import lxml.html
import re
from fastapi.concurrency import run_in_threadpool
from random import shuffle

CIVL_LINK_ACRO_RANKING_EXCEL = 'https://civlcomps.org/ranking/export?rankingId=1481&type=export_pilots_ranking'
CIVL_LINK_PILOT_PAGE_HTML = 'https://civlcomps.org/pilot/'

logger = logging.getLogger(__name__)
pilots = APIRouter()
collection = db.pilots
taskRunning = False

def fetch_and_load_pilots_list(body: bytes):
    with NamedTemporaryFile(suffix=".xlsx") as f:
        f.write(body)
        xls = load_workbook(f.name)
    return xls

async def update_pilots():
    global taskRunning
    if taskRunning:
        logger.warning("update pilots process is already running, skipping. This should not happen!")
        return
    try:
        taskRunning = True

        # fetch the excel
        async with httpx.AsyncClient() as client:
            ret = await client.get(CIVL_LINK_ACRO_RANKING_EXCEL)

        if ret.status_code != HTTPStatus.OK:
            logger.error("unable to update pilots from %s, code=%d", CIVL_LINK_ACRO_RANKING_EXCEL, res.status_code)
            return

        # write the excel to a temporary file and read it
        xls = await run_in_threadpool(lambda: fetch_and_load_pilots_list(ret.content))
        sheet = xls.active # get the first and only sheet
        # loop over each cells of column B (where the CIVL id are)
        # and extract civlids
        civlids = []
        for cell in sheet['B']:
            try:
                # convert the cell content to int
                # if conversion can be made we assume it's a CIVLID
                civlid = int(cell.value or '')
                civlids.append(civlid)
                logger.debug("GOT cell %s: %d", cell.coordinate, civlid)
            except:
                logger.debug('skipping cell %s because of invalid CIVLID "%s"', cell.coordinate, cell.value)
                next
        # loop over each civlids found and create or update pilot
        shuffle(civlids)
        for civlid in civlids:
            try:
                await update_pilot(civlid)
            except Exception as e:
                logger.exception("Exception while updating pilot with CIVL ID #%d", civlid)

        logger.debug("background task to update pilots stopped")
    finally:
        taskRunning = False


def pilots_start():
    collection.create_index('civlid', unique=True)
    logger.debug('index created on "civlid"')

async def update_pilot(civlid: int):
    async with httpx.AsyncClient() as client:
        link = CIVL_LINK_PILOT_PAGE_HTML + str(civlid)
        logger.debug(link)

        ret = await client.get(link)

        logger.debug(ret.status_code)
        if ret.status_code == HTTPStatus.NOT_FOUND:
            raise HTTPException(status_code=404, detail=f"Pilot not found in CIVL database")
        if ret.status_code != HTTPStatus.OK:
            raise HTTPException(status_code=500, detail=f"Problem while fetch pilot information from CIVL database")

    html = lxml.html.fromstring(ret.text)

    logger.debug(link)

    name = html.cssselect('h1.title-pilot')[0].text_content()
    logger.debug(name)

    i = html.cssselect('div.country-place i')[0]
    i.classes.discard('flag')
    country = re.sub(r'^flag-', '', i.get('class'))
    logger.debug(country)

    about = ''
    for e in html.cssselect('article#info p'):
        about += ''.join(e.itertext()).replace('\n', ' ')
    logger.debug(about)

    links = []
    for e in html.cssselect('a.social-link'):
        e.classes.discard('social-link')
        links.append({
            "name":e.get('class'),
            "link":e.get('href')
        })

    for e in html.cssselect('article.links-block a'):
        text = ''.join(e.itertext()).replace('\n', ' ')
        links.append({
            "name":text,
            "link":e.get('href')
        })
    logger.debug(links)

    sponsors = []
    for e in html.cssselect('aside.sponsors-wrapper a'):
        sponsors.append({
            "name": e.get('alt'),
            "link": e.get('href'),
            "img": e.cssselect('img')[0].get('src'),
        })
    logger.debug(sponsors)

    photo = html.cssselect('.photo-pilot img')[0].get('src')
    logger.debug(photo)

    background_picture = html.cssselect('.image-fon img')[0].get('src')
    logger.debug(background_picture)

    pilot = PilotModel(
        civlid=civlid,
        name=name,
        country=country,
        about=about,
        link=link,
        links=links,
        sponsors=sponsors,
        photo=photo,
        background_picture=background_picture,
    )
    p = jsonable_encoder(pilot)
    try:
        res = await collection.insert_one(p)
        action = "created"
    except pymongo.errors.DuplicateKeyError:
        del p['_id']
        res = await collection.update_one({"name": p['name']}, {"$set": p})
        action = "updated"
    p = await collection.find_one({"name": p['name']})
    logger.debug("pilot %s %s (CIVL ID=%d, id=%s)", p['name'], action, civlid, p['_id'])
    return pilot

#
# Get all pilots
#
@pilots.get(
    "/",
    response_description="List all pilots",
    response_model=List[PilotModel],
    dependencies=[Depends(auth)],
)
async def list():
    logger.debug("list()")
    pilots = await collection.find().to_list(1000)
    return pilots

#
# Get one pilot
#
@pilots.get(
    "/{id}",
    response_description="Get a Pilot",
    dependencies=[Depends(auth)],
)
async def get(id: str):
    logger.debug("get(%s)", id)
    res = await collection.find_one({"_id": id})
    if res is None:
        res = await collection.find_one({"civlid": id})
    if res is None:
        raise HTTPException(status_code=404, detail=f"Pilot {id} not found")
    return res

#
# Create all pilots from CIVL database
#
@pilots.post(
    "/",
    status_code=201,
    response_description="Create all missing pilots from CIVL database",
    dependencies=[Depends(auth)],
)
async def sync(background_tasks: BackgroundTasks):
    if taskRunning:
        return "an update task is already running ..."
    background_tasks.add_task(update_pilots)
    return "OK"

#
# Create a new Pilot
#
@pilots.post(
    "/{civlid}",
    status_code=201,
    response_description="Add new Pilot",
    response_model=PilotModel,
    dependencies=[Depends(auth)],
)
async def create(civlid: int):
    logger.debug("create or update pilot with civlid %d", civlid)
    return await update_pilot(civlid)

#
# Update an existing Judge

#
# Update an existing Pilot
#
@pilots.put(
    "/{id}",
    response_description="Add new Pilot",
#    response_model=PilotModel,
    dependencies=[Depends(auth)],
)
async def update(id: str):
#async def update(id: str, pilot: UpdatePilotModel = Body(...)):
    raise HTTPException(status_code=501)

#
# Delete a Pilot
#
@pilots.delete(
    "/{id}",
    response_description="Delete a Pilot",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    raise HTTPException(status_code=501)

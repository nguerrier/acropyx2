import logging
from http import HTTPStatus
from fastapi import APIRouter, Depends, Body, HTTPException
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

CIVL_LINK_ACRO_RANKING_EXCEL = 'https://civlcomps.org/ranking/export?rankingId=1481&type=export_pilots_ranking'
CIVL_LINK_PILOT_PAGE_HTML = 'https://civlcomps.org/pilot/'

logger = logging.getLogger(__name__)
pilots = APIRouter()
collection = db.pilots

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

        return PilotModel(
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
async def sync():
    async with httpx.AsyncClient() as client:
        ret = await client.get(CIVL_LINK_ACRO_RANKING_EXCEL)
        with NamedTemporaryFile(suffix=".xlsx") as f:
            f.write(ret.content)
            xls = load_workbook(f.name)
            sheet = xls.active # get the first and only sheet
            for cell in sheet['B']:
                try:
                    civlid = int(cell.value or '')
                    logger.debug("GOT cell %s: %d", cell.coordinate, civlid)
                    ret = await client.get(CIVL_LINK_PILOT_PAGE_HTML + str(civlid))
                    css = CSSSelector(ret.content)
                    logger.debug(css)
                    return None
                except:
                    logger.debug('skipping cell %s because of invalid CIVLID "%s"', cell.coordinate, cell.value)
                    next

    return None

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
    pilot = jsonable_encoder(await update_pilot(civlid))
    try:
        res = await collection.insert_one(pilot)
        pilot = await collection.find_one({"_id": res.inserted_id})
        logger.debug("pilot %s created with id %s", pilot['name'], pilot['_id'])
    except pymongo.errors.DuplicateKeyError:
        del pilot['_id'] 
        res = await collection.update_one({"name": pilot['name']}, {"$set": pilot})
    return pilot

#
# Update an existing Judge

#
# Update an existing Pilot
#
@pilots.put(
    "/{id}",
    response_description="Add new Pilot",
    response_model=PilotModel,
    dependencies=[Depends(auth)],
)
async def update(id: str, pilot: UpdatePilotModel = Body(...)):
    logger.debug("update pilot %s", id)
    pilot = {k: v for k, v in pilot.dict().items() if v is not None}
    pilot = jsonable_encoder(pilot)
    if len(pilot) > 1: # only update if there are no None item
        try:
            res = await collection.update_one({"_id": id}, {"$set": pilot})
        except ValidationError as e:
            raise HTTPException(status_code=400, detail=e)

    return await collection.find_one({"_id": id})

#
# Delete a Pilot
#
@pilots.delete(
    "/{id}",
    status_code=204,
    response_description="Delete a Pilot",
    dependencies=[Depends(auth)],
)
async def delete(id: str):
    logger.debug("delete pilot %s", id)
    res = await collection.delete_one({"_id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Pilot {id} not found")
    return Response(status_code=HTTPStatus.NO_CONTENT.value)

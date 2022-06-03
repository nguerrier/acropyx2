import logging
import httpx
from http import HTTPStatus
from openpyxl import load_workbook
from tempfile import NamedTemporaryFile
import lxml.html
import re
from fastapi.concurrency import run_in_threadpool
from random import shuffle

from core.config import settings
from models.pilots import PilotModel

logger = logging.getLogger(__name__)
taskRunning = False

def isTaskRunning():
    global taskRunning
    return taskRunning

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
            ret = await client.get(settings.pilots.civl_link_all_pilots)

        if ret.status_code != HTTPStatus.OK:
            logger.error("unable to update pilots from %s, code=%d", settings.pilots.civl_link_all_pilots, res.status_code)
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
    PilotModel.createIndexes()

async def update_pilot(civlid: int):
    async with httpx.AsyncClient() as client:
        link = settings.pilots.civl_link_one_pilot + str(civlid)
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

    rank = 9999
    try:
        r = html.cssselect('.paragliding-aerobatics + div')
        if len(r) > 0:
            r = r[0].cssselect('td')
            if len(r) >= 2:
                rank = int(r[1].text)
    except:
        pass

    logger.debug(rank)

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
        rank = rank,
    )
    return await pilot.save()

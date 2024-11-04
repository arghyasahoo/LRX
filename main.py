from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from typing import Optional
import requests # type: ignore
from urllib.parse import urlparse, urlunparse, urlencode


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

dummy_req = {
	"track_name": "Two Way Mirror",
	"artist_name": "Loathe",
	"album_name": "I let it in and it took everything",
	"instreumental": False
}

class TrackInfo(BaseModel):
    track_name: str
    artist_name: str
    album_name: Optional[str] = None
    duration: Optional[str] = None
    instrumental: bool = False

@app.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/lyrics", response_class=HTMLResponse)
async def get_lyrics(
    track_name: str = Form(...),
    artist_name: str = Form(...),
    album_name: Optional[str] = Form(None),
    duration: Optional[str] = Form(None),
    instrumental: bool = Form(False)):

    track_info = TrackInfo(
        track_name=track_name,
        artist_name=artist_name,
        album_name=album_name,
        duration=duration,
        instrumental=instrumental
    )

    print(track_info.model_dump_json())

    lyrics = await fetch_lyrics(track_info.model_dump_json())
    lyrics = { k: v for k, v in lyrics.items() if v }
    return templates.TemplateResponse("lyrics.html", {"lyrics": lyrics})

base_url = "https://lrclib.net/api/get"

async def fetch_lyrics(track_details: dict) -> dict:
    parsed_url = urlparse(base_url)

    new_parsed_url = parsed_url._replace(query=urlencode(track_details, doseq=True))
    url = urlunparse(new_parsed_url)

    resp = requests.get(url)
    return resp.json()


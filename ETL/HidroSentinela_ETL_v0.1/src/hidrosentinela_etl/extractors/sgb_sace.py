from __future__ import annotations
import requests
from ..config import Settings


def extract_sace_stations(settings: Settings) -> dict:
    xmin, ymin, xmax, ymax = [float(v.strip()) for v in settings.sgb_sace_bbox.split(",")]
    params = {
        "where": "1=1",
        "outFields": "objectid,codigo,nome,latitude,longitude,ur,globalid",
        "returnGeometry": "true",
        "f": "geojson",
        "outSR": "4326",
        "geometry": f"{xmin},{ymin},{xmax},{ymax}",
        "geometryType": "esriGeometryEnvelope",
        "spatialRel": "esriSpatialRelIntersects",
        "inSR": "4326",
    }
    response = requests.get(
        settings.sgb_sace_url,
        params=params,
        headers={"Accept": "application/geo+json, application/json"},
        timeout=settings.http_timeout_seconds,
    )
    response.raise_for_status()
    payload = response.json()
    if payload.get("type") != "FeatureCollection":
        raise RuntimeError(f"Resposta SGB/SACE inesperada: {payload}")
    return payload

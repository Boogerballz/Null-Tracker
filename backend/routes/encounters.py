from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import json
import csv
import io
import os

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "romhacks")

# --- Routes ---

@router.get("/romhacks")
def get_romhacks():
    try:
        files = [f.replace(".json", "") for f in os.listdir(DATA_DIR) if f.endswith(".json")]
        return {"romhacks": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{romhack}")
def get_encounters(romhack: str):
    filepath = os.path.join(DATA_DIR, f"{romhack}.json")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"{romhack} not found")
    with open(filepath, "r") as f:
        data = json.load(f)
    return data

@router.get("/{romhack}/{route_name}")
def get_route_encounters(romhack: str, route_name: str):
    filepath = os.path.join(DATA_DIR, f"{romhack}.json")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"{romhack} not found")
    with open(filepath, "r") as f:
        data = json.load(f)
    route = next((r for r in data["routes"] if r["name"].lower() == route_name.lower()), None)
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_name} not found")
    return route

@router.get("/{romhack}/export/csv")
def export_csv(romhack: str):
    filepath = os.path.join(DATA_DIR, f"{romhack}.json")
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"{romhack} not found")
    with open(filepath, "r") as f:
        data = json.load(f)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Route", "Method", "Pokemon", "Min Level", "Max Level", "Encounter Rate"])
    for route in data["routes"]:
        for method, encounters in route["encounters"].items():
            for enc in encounters:
                writer.writerow([
                    route["name"],
                    method,
                    enc["pokemon"],
                    enc["min_level"],
                    enc["max_level"],
                    enc.get("rate", "?")
                ])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={romhack}_encounters.csv"}
    )

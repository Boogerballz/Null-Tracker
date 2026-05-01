from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models import SavedRoute
import json

router = APIRouter()

SECRET_KEY = "pokemon-null-router-secret-key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# --- Schemas ---
class SaveRouteRequest(BaseModel):
    route_name: str
    rom_hack: str
    route_data: dict

# --- Helpers ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        username: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"id": user_id, "username": username}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# --- Routes ---
@router.get("/")
def get_saves(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    saves = db.query(SavedRoute).filter(SavedRoute.user_id == current_user["id"]).all()
    return {"saves": [
        {
            "id": s.id,
            "route_name": s.route_name,
            "rom_hack": s.rom_hack,
            "route_data": json.loads(s.route_data),
            "created_at": s.created_at
        } for s in saves
    ]}

@router.post("/")
def save_route(request: SaveRouteRequest, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    new_save = SavedRoute(
        user_id=current_user["id"],
        route_name=request.route_name,
        rom_hack=request.rom_hack,
        route_data=json.dumps(request.route_data)
    )
    db.add(new_save)
    db.commit()
    db.refresh(new_save)
    return {"message": "Route saved!", "id": new_save.id}

@router.delete("/{save_id}")
def delete_save(save_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    save = db.query(SavedRoute).filter(SavedRoute.id == save_id, SavedRoute.user_id == current_user["id"]).first()
    if not save:
        raise HTTPException(status_code=404, detail="Save not found")
    db.delete(save)
    db.commit()
    return {"message": "Save deleted!"}

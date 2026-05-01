from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, encounters, saves
from database import engine, Base

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pokémon Null Encounter Router")

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(encounters.router, prefix="/encounters", tags=["encounters"])
app.include_router(saves.router, prefix="/saves", tags=["saves"])

@app.get("/")
def root():
    return {"message": "Pokémon Null Encounter Router API is running!"}
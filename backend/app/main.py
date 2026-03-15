from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import recognition
from app.services.inference import load_models

app = FastAPI(title="SignVoice API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    load_models()

app.include_router(recognition.router)

@app.get("/")
def root():
    return {"message": "SignVoice API is running"}

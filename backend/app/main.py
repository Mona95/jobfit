from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.database import Base
from app.models.user import User
from app.models.cv import CV
from app.models.job import Job

from app.routes.auth import router as auth_router
from app.routes.cv import router as cv_router

load_dotenv()

app = FastAPI(title="JobFit API", version="1.0.0")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(cv_router)

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "JobFit API"}

@app.on_event("startup")
async def startup_check():
    required = ["DATABASE_URL", "SECRET_KEY", "GROQ_API_KEY"]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise RuntimeError(f"Missing environment variables: {missing}")
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import admin, candidates, grading, health, interviews, realtime

app = FastAPI(title="Codebase Live AI API", version="0.1.0")

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
app.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
app.include_router(grading.router, prefix="/grading", tags=["grading"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(realtime.router, prefix="/realtime", tags=["realtime"])

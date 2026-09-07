from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import users, courses, lessons, leaderboard, achievements, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables are created and seed data is populated
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown: Clean up resources if necessary

app = FastAPI(
    title="Duolingo Clone API",
    description="Full-stack FastAPI backend replicating Duolingo's core learning and gamification engine",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend (supports localhost, Vercel, and custom domains)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount modular routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(achievements.router)

@app.get("/")
def root():
    return {
        "app": "Duolingo Clone API",
        "status": "online",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

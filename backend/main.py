from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import units, lessons, users, courses

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Duolingo Clone API",
    description="Python FastAPI REST Backend for Duolingo Clone",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(units.router)
app.include_router(lessons.router)
app.include_router(users.router)
app.include_router(courses.router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "app": "Duolingo Clone API",
        "docs": "http://localhost:8000/docs"
    }

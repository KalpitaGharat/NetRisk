from pathlib import Path
from datetime import datetime, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text

from .config import settings
from .database import init_db, engine
from .routers import models_router, projects_router, assessments_router, integrations_router, web_router, auth_router
from .routers.web import page_landing

STATIC_DIR = Path(__file__).resolve().parent / "static"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize database tables on startup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable Risk-Aware SDLC Decision-Support Recommendation Framework for AI-Based Intrusion Detection Software.",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

# Configure CORS for local development and specified origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files (CSS, JS, Images)
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# Mount React Frontend Build (Vite dist)
DIST_DIR = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if (DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="react-assets")

# Custom validation error handler for user-friendly error output
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join(str(loc) for loc in err.get("loc", []))
        errors.append({
            "field": field,
            "message": err.get("msg", "Validation error"),
            "type": err.get("type", "value_error"),
        })
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "message": "Input validation failed. Please check the supplied parameters.",
            "details": errors,
        },
    )

# Generic exception handler to protect against raw traceback leakage
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request. Please try again.",
        },
    )

# Root endpoint: Serves React SPA (if built) or HTML Landing page for browsers, and JSON metadata for API clients
@app.get("/", tags=["System"])
def root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept:
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
        return page_landing(request)
    return {
        "system": settings.PROJECT_NAME,
        "title": settings.PROJECT_FULL_TITLE,
        "version": settings.VERSION,
        "sdg_alignment": "SDG 9: Industry, Innovation and Infrastructure",
        "documentation": "/documentation",
        "health_check": "/api/health",
        "status": "operational",
    }

# Health check endpoints (/health and /api/health)
@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    db_status = "operational"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unavailable: {str(e)}"

    return {
        "status": "healthy" if db_status == "operational" else "degraded",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": settings.VERSION,
    }

# Mount REST API Routers
app.include_router(models_router)
app.include_router(projects_router)
app.include_router(assessments_router)
app.include_router(integrations_router)
app.include_router(auth_router)

# Mount Server-Rendered Web UI Router
app.include_router(web_router)

# Mount Compiled React Application Route and SPA browser routes
@app.get("/app", response_class=HTMLResponse, tags=["React Frontend"])
@app.get("/app/{full_path:path}", response_class=HTMLResponse, tags=["React Frontend"])
@app.get("/login", response_class=HTMLResponse, tags=["React Frontend"])
@app.get("/sdlc-comparison", response_class=HTMLResponse, tags=["React Frontend"])
def serve_react_app(full_path: str = ""):
    index_file = DIST_DIR / "index.html"
    if index_file.exists():
        return HTMLResponse(content=index_file.read_text(encoding="utf-8"))
    return HTMLResponse("React frontend build not found. Run 'npm run build' in frontend directory.", status_code=404)


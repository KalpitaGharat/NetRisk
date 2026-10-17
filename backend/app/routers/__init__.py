from .projects import router as projects_router
from .assessments import router as assessments_router
from .models import router as models_router
from .integrations import router as integrations_router
from .web import router as web_router
from .auth import router as auth_router

__all__ = ["projects_router", "assessments_router", "models_router", "integrations_router", "web_router", "auth_router"]


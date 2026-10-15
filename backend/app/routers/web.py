from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models.assessment import Assessment
from ..models.project import Project
from ..services.jira_service import JiraService
from ..services.confluence_service import ConfluenceService
from .assessments import get_dashboard_metrics, build_assessment_read

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))

router = APIRouter(include_in_schema=False)

def _get_common_context(request: Request, active_page: str):
    """Retrieve shared template parameters including live Jira status."""
    jira_status = JiraService.check_connection()
    return {
        "active_page": active_page,
        "jira_status": jira_status,
        "settings": settings,
    }

def page_landing(request: Request):
    ctx = _get_common_context(request, "landing")
    return templates.TemplateResponse(request, "index.html", ctx)

@router.get("/dashboard", response_class=HTMLResponse)
def page_dashboard(request: Request, db: Session = Depends(get_db)):
    ctx = _get_common_context(request, "dashboard")
    metrics = get_dashboard_metrics(db=db)
    ctx["metrics"] = metrics
    return templates.TemplateResponse(request, "dashboard.html", ctx)

@router.get("/assessment", response_class=HTMLResponse)
def page_assessment(request: Request):
    ctx = _get_common_context(request, "assessment")
    return templates.TemplateResponse(request, "assessment.html", ctx)

@router.get("/results/{assessment_id}", response_class=HTMLResponse)
def page_results(assessment_id: int, request: Request, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == assessment_id).first()
    if not assessment:
        return RedirectResponse(url="/history", status_code=status.HTTP_303_SEE_OTHER)

    project = db.query(Project).filter(Project.id == assessment.project_id).first()
    if not project:
        project = Project(id=assessment.project_id, name="Project Assessment", description="")

    assessment_read = build_assessment_read(assessment, project)
    ctx = _get_common_context(request, "results")
    ctx["assessment"] = assessment_read
    return templates.TemplateResponse(request, "results.html", ctx)

@router.get("/history", response_class=HTMLResponse)
def page_history(request: Request, db: Session = Depends(get_db)):
    ctx = _get_common_context(request, "history")
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).all()
    summaries = []
    for a in assessments:
        proj_name = a.project.name if a.project else f"Project #{a.project_id}"
        summaries.append({
            "id": a.id,
            "project_name": proj_name,
            "risk_score": a.risk_score,
            "risk_level": a.risk_level,
            "recommended_model": a.recommended_model,
            "recommended_score": a.recommended_score,
            "alternative_model": a.alternative_model,
            "alternative_score": a.alternative_score,
            "created_at": a.created_at,
        })
    ctx["assessments"] = summaries
    return templates.TemplateResponse(request, "history.html", ctx)

@router.get("/project-management", response_class=HTMLResponse)
def page_project_management(request: Request):
    ctx = _get_common_context(request, "project-management")
    ctx["project_summary"] = JiraService.get_project_summary()
    ctx["sprints_data"] = JiraService.get_sprints()
    ctx["epics_data"] = JiraService.get_epics()
    return templates.TemplateResponse(request, "project_management.html", ctx)

@router.get("/jira-board", response_class=HTMLResponse)
def page_jira_board(request: Request):
    ctx = _get_common_context(request, "jira-board")
    epics_data = JiraService.get_epics()
    all_stories = []
    for epic in epics_data.get("epics", []):
        for s in epic.get("stories", []):
            story_copy = dict(s)
            story_copy["epic_id"] = epic.get("id")
            story_copy["epic_name"] = epic.get("name")
            all_stories.append(story_copy)

    todo_issues = [s for s in all_stories if s.get("status") in ["TO DO", "OPEN", "BACKLOG"]]
    in_progress_issues = [s for s in all_stories if "PROGRESS" in s.get("status", "")]
    in_review_issues = [s for s in all_stories if "REVIEW" in s.get("status", "")]
    done_issues = [s for s in all_stories if s.get("status") in ["DONE", "CLOSED"]]

    ctx["is_live"] = epics_data.get("is_live", False)
    ctx["todo_issues"] = todo_issues
    ctx["in_progress_issues"] = in_progress_issues
    ctx["in_review_issues"] = in_review_issues
    ctx["done_issues"] = done_issues
    ctx["all_issues"] = all_stories
    return templates.TemplateResponse(request, "jira_board.html", ctx)

@router.get("/documentation", response_class=HTMLResponse)
def page_documentation(request: Request):
    ctx = _get_common_context(request, "documentation")
    docs_data = ConfluenceService.get_space_metadata()
    ctx["space_key"] = docs_data.get("space_key", "NRSS")
    ctx["confluence_url"] = docs_data.get("space_url", "https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS/overview")
    ctx["pages"] = docs_data.get("pages", [])
    return templates.TemplateResponse(request, "documentation.html", ctx)

@router.get("/settings", response_class=HTMLResponse)
def page_settings(request: Request, db: Session = Depends(get_db)):
    ctx = _get_common_context(request, "settings")
    ctx["assessment_count"] = db.query(Assessment).count()
    return templates.TemplateResponse(request, "settings.html", ctx)

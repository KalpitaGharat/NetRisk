from typing import Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter
from ..services.jira_service import JiraService
from ..services.confluence_service import ConfluenceService

router = APIRouter(prefix="/api/integrations", tags=["Jira & Confluence Integrations"])

class JiraIssueCreate(BaseModel):
    summary: str = Field(..., min_length=3, max_length=255, description="Issue summary/title")
    description: Optional[str] = Field(None, max_length=2000, description="Detailed description")
    issue_type: str = Field("Story", description="Issue type, e.g. Story or Task")
    priority: Optional[str] = Field("Medium", description="Priority level")
    parent_key: Optional[str] = Field(None, description="Parent Epic key, e.g. NRASS-1")

@router.get("/jira/status", summary="Check Jira Cloud connection status and authentication state")
def get_jira_status():
    """Returns Jira configuration status, connectivity check, and operation mode (live or demo)."""
    return JiraService.check_connection()

@router.get("/jira/project", summary="Get Jira project overview and completion metrics")
def get_jira_project_overview():
    """Returns high-level project metadata, story completion percentages, and sprint counts."""
    return JiraService.get_project_summary()

@router.get("/jira/epics", summary="Get the 5 project Epics and associated User Stories")
def get_jira_epics():
    """Returns the 5 project Epics, their completion percentages, and user stories."""
    return JiraService.get_epics()

@router.get("/jira/issues", summary="Get all project stories and issues")
def get_jira_issues():
    """Returns a flat list of all User Stories with their statuses, points, and epic associations."""
    epics_data = JiraService.get_epics()
    all_stories = []
    for epic in epics_data.get("epics", []):
        for s in epic.get("stories", []):
            story_copy = dict(s)
            story_copy["epic_id"] = epic.get("id")
            story_copy["epic_name"] = epic.get("name")
            all_stories.append(story_copy)

    return {
        "is_live": epics_data.get("is_live", False),
        "data_source": epics_data.get("data_source"),
        "total_issues": len(all_stories),
        "issues": all_stories,
    }

@router.post("/jira/issues", summary="Create a new Jira User Story or Task in project NRASS")
def create_jira_issue(payload: JiraIssueCreate):
    """Creates a new Story or Task directly in Jira Cloud project NRASS."""
    return JiraService.create_issue(
        summary=payload.summary,
        description=payload.description,
        issue_type=payload.issue_type,
        priority=payload.priority,
        parent_key=payload.parent_key,
    )

@router.get("/jira/sprints", summary="Get all 5 development Sprints and story point velocity")
def get_jira_sprints():
    """Returns the 5 development Sprints with dates, story point progress, and task counts."""
    return JiraService.get_sprints()

@router.get("/jira/progress", summary="Get task status workflow distribution")
def get_jira_progress():
    """Returns counts across workflow states: To Do, In Progress, In Review, and Done."""
    return JiraService.get_task_status_distribution()

@router.get("/jira/activity", summary="Get recent project activities and status transitions")
def get_jira_activity():
    """Returns recent sprint transitions, story status changes, and project audit log."""
    return JiraService.get_recent_activity()

@router.get("/confluence/pages", summary="Get Confluence documentation space pages")
def get_confluence_pages():
    """Returns verified links and metadata for the 6 core NETRISK Confluence documents in space NRSS."""
    return ConfluenceService.get_space_metadata()

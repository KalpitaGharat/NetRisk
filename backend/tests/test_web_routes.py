import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

@pytest.fixture
def client():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    Base.metadata.create_all(bind=test_engine)

    def _override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db, None)
    Base.metadata.drop_all(bind=test_engine)

def test_landing_page_html(client):
    response = client.get("/", headers={"Accept": "text/html"})
    assert response.status_code == 200
    assert "NETRISK" in response.text
    assert "SDLC Decision Platform" in response.text

def test_dashboard_page_html(client):
    response = client.get("/dashboard")
    assert response.status_code == 200
    assert "Executive Operational Dashboard" in response.text

def test_assessment_wizard_page_html(client):
    response = client.get("/assessment")
    assert response.status_code == 200
    assert "Risk Assessment Wizard" in response.text
    assert "slider-security" in response.text

def test_history_page_html(client):
    response = client.get("/history")
    assert response.status_code == 200
    assert "Assessment History" in response.text

def test_project_management_page_html(client):
    response = client.get("/project-management")
    assert response.status_code == 200
    assert "Project Management" in response.text

def test_jira_board_page_html(client):
    response = client.get("/jira-board")
    assert response.status_code == 200
    assert "Kanban Board" in response.text

def test_documentation_page_html(client):
    response = client.get("/documentation")
    assert response.status_code == 200
    assert "Technical Documentation" in response.text

def test_settings_page_html(client):
    response = client.get("/settings")
    assert response.status_code == 200
    assert "System Diagnostics" in response.text

def test_results_page_html_with_created_assessment(client):
    # First create an assessment
    payload = {
        "project_name": "Web Test IDS Project",
        "description": "Integration test for results HTML view",
        "category": "Enterprise SOC Threat Detection",
        "security_criticality": 90.0,
        "ai_complexity": 80.0,
        "requirement_uncertainty": 40.0,
        "threat_volatility": 75.0,
        "operational_criticality": 95.0,
        "compliance_requirement": 90.0,
        "team_experience": 80.0,
    }
    create_resp = client.post("/api/assessments", json=payload)
    assert create_resp.status_code == 201
    assessment_id = create_resp.json()["id"]

    # Now load results page
    resp = client.get(f"/results/{assessment_id}")
    assert resp.status_code == 200
    assert "Web Test IDS Project" in resp.text
    assert "Primary Recommended SDLC Model" in resp.text

def test_swagger_docs_disabled(client):
    assert client.get("/docs").status_code == 404
    assert client.get("/redoc").status_code == 404
    assert client.get("/openapi.json").status_code == 404


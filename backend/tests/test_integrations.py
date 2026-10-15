import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_jira_status_unconfigured():
    resp = client.get("/api/integrations/jira/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "is_configured" in data
    assert "mode" in data
    assert data["project_key"] == "NRASS"
    assert "password" not in str(data).lower()
    assert "token" not in str(data).lower() or "api_token" not in data

def test_jira_project_overview():
    resp = client.get("/api/integrations/jira/project")
    assert resp.status_code == 200
    data = resp.json()
    assert data["project_key"] == "NRASS"
    assert "NETRISK" in data["project_name"]
    assert data["total_epics"] == 5
    assert data["total_stories"] > 0
    assert data["number_of_sprints"] == 5
    assert 0 <= data["completion_percentage"] <= 100
    assert "data_source" in data

def test_jira_epics_and_stories():
    resp = client.get("/api/integrations/jira/epics")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_epics"] == 5
    epic_names = [e["name"] for e in data["epics"]]
    assert "Foundation & Risk Assessment" in epic_names
    assert "SDLC Intelligence & Recommendation" in epic_names
    assert "Dashboard & Persistence" in epic_names
    assert "Validation & Testing" in epic_names
    assert "Professionalization & Finalization" in epic_names

    # Check each epic has stories
    for epic in data["epics"]:
        assert len(epic["stories"]) > 0
        assert "progress_percentage" in epic

def test_jira_issues_flat():
    resp = client.get("/api/integrations/jira/issues")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_issues"] >= 20
    assert len(data["issues"]) == data["total_issues"]
    # Check issue structure
    first = data["issues"][0]
    assert "key" in first
    assert "title" in first
    assert "status" in first
    assert "epic_id" in first

def test_jira_sprints():
    resp = client.get("/api/integrations/jira/sprints")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_sprints"] == 5
    assert data["total_story_points"] > 0
    assert data["completed_story_points"] > 0
    assert len(data["sprints"]) == 5
    for s in data["sprints"]:
        assert "sprint_name" in s
        assert "status" in s
        assert "total_story_points" in s
        assert "completed_story_points" in s

def test_jira_task_progress_distribution():
    resp = client.get("/api/integrations/jira/progress")
    assert resp.status_code == 200
    data = resp.json()
    dist = data["distribution"]
    assert "To Do" in dist
    assert "In Progress" in dist
    assert "In Review" in dist
    assert "Done" in dist
    assert data["total_tasks"] > 0
    assert 0 <= data["completion_rate"] <= 100

def test_jira_recent_activity():
    resp = client.get("/api/integrations/jira/activity")
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] > 0
    assert len(data["activities"]) == data["count"]
    for act in data["activities"]:
        assert "timestamp" in act
        assert "summary" in act
        assert "issue_key" in act

def test_confluence_pages():
    resp = client.get("/api/integrations/confluence/pages")
    assert resp.status_code == 200
    data = resp.json()
    assert data["space_key"] == "NRSS"
    assert data["total_documents"] == 6
    assert len(data["pages"]) == 6
    titles = [p["title"] for p in data["pages"]]
    assert "NETRISK — Risk-Aware SDLC Selector" in titles
    assert "NETRISK — System Architecture & Workflow" in titles
    assert "NETRISK — Risk Assessment Methodology" in titles
    assert "NETRISK — SDLC Recommendation Methodology" in titles
    assert "NETRISK — Testing & Validation Strategy" in titles
    assert "NETRISK — SDG 9, Project Outcomes & Conclusion" in titles
    for p in data["pages"]:
        assert p["url"].startswith("https://sakec-team-bcq481n1.atlassian.net/wiki/spaces/NRSS")

def test_create_jira_issue_validation():
    # Missing summary should fail validation
    resp = client.post("/api/integrations/jira/issues", json={})
    assert resp.status_code == 422

    # Short summary (<3 chars) should fail validation
    resp = client.post("/api/integrations/jira/issues", json={"summary": "ab"})
    assert resp.status_code == 422

def test_create_jira_issue_structure():
    # Valid payload should return structured response with success key
    payload = {
        "summary": "Automated Unit Test Issue Scaffolding",
        "description": "Validation testing for Jira issue creation endpoint",
        "issue_type": "Story",
        "priority": "Medium",
        "parent_key": "NRASS-3"
    }
    resp = client.post("/api/integrations/jira/issues", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "success" in data
    assert "message" in data

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

# Create an in-memory SQLite database for test isolation
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["system"] == "NETRISK"
    assert "SDG 9" in data["sdg_alignment"]

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "operational"

def test_models_metadata_endpoint():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    models = data["models"]
    assert "Waterfall" in models
    assert "V-Model" in models
    assert "Agile" in models
    assert "Spiral" in models
    assert "DevSecOps" in models

def test_weights_metadata_endpoint():
    response = client.get("/api/weights")
    assert response.status_code == 200
    data = response.json()
    weights = data["weights"]
    assert weights["security_criticality"] == 0.25
    assert weights["ai_complexity"] == 0.20
    assert weights["team_risk"] == 0.05

def test_dashboard_empty():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_assessments"] == 0
    assert data["average_risk"] == 0.0

def test_create_and_get_project():
    # Create project
    create_resp = client.post(
        "/api/projects",
        json={"name": "CyberShield AI", "description": "Enterprise Deep Packet Inspection"},
    )
    assert create_resp.status_code == 201
    proj_data = create_resp.json()
    project_id = proj_data["id"]
    assert proj_data["name"] == "CyberShield AI"

    # Get project by ID
    get_resp = client.get(f"/api/projects/{project_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == project_id

    # List projects
    list_resp = client.get("/api/projects")
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1

def test_create_assessment_workflow():
    payload = {
        "project_name": "AegisNet IDS",
        "description": "Zero-trust neural network edge intrusion detector",
        "security_criticality": 90.0,
        "ai_complexity": 85.0,
        "requirement_uncertainty": 40.0,
        "threat_volatility": 80.0,
        "operational_criticality": 75.0,
        "compliance_requirement": 70.0,
        "team_experience": 65.0,
    }

    create_resp = client.post("/api/assessments", json=payload)
    assert create_resp.status_code == 201
    data = create_resp.json()
    assessment_id = data["id"]

    assert data["project_name"] == "AegisNet IDS"
    assert data["risk_score"] > 0
    assert data["risk_level"] in ["HIGH", "VERY HIGH"]
    assert data["recommended_model"] != ""
    assert data["recommended_score"] > 0
    assert len(data["development_practices"]) > 0
    assert "explanation" in data

    # Retrieve single assessment
    get_resp = client.get(f"/api/assessments/{assessment_id}")
    assert get_resp.status_code == 200
    get_data = get_resp.json()
    assert get_data["id"] == assessment_id
    assert get_data["recommended_model"] == data["recommended_model"]

    # Check dashboard reflects new assessment
    dash_resp = client.get("/api/dashboard")
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert dash_data["total_assessments"] == 1
    assert dash_data["average_risk"] == data["risk_score"]

    # History list
    history_resp = client.get("/api/assessments")
    assert history_resp.status_code == 200
    assert len(history_resp.json()) == 1

    # Delete assessment
    del_resp = client.delete(f"/api/assessments/{assessment_id}")
    assert del_resp.status_code == 200

    # Verify deleted
    get_after_del = client.get(f"/api/assessments/{assessment_id}")
    assert get_after_del.status_code == 404

def test_validation_missing_project_name():
    payload = {
        "description": "Missing project name",
        "security_criticality": 50.0,
        "ai_complexity": 50.0,
        "requirement_uncertainty": 50.0,
        "threat_volatility": 50.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 50.0,
        "team_experience": 50.0,
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["error"] == "Validation Error"

def test_validation_empty_project_name():
    payload = {
        "project_name": "   ",
        "security_criticality": 50.0,
        "ai_complexity": 50.0,
        "requirement_uncertainty": 50.0,
        "threat_volatility": 50.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 50.0,
        "team_experience": 50.0,
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 422
    assert response.json()["error"] == "Validation Error"

def test_validation_out_of_range_values():
    payload = {
        "project_name": "Invalid Bounds IDS",
        "security_criticality": 150.0,  # Greater than 100
        "ai_complexity": -10.0,         # Less than 0
        "requirement_uncertainty": 50.0,
        "threat_volatility": 50.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 50.0,
        "team_experience": 50.0,
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 422
    assert response.json()["error"] == "Validation Error"

def test_validation_invalid_type():
    payload = {
        "project_name": "Invalid Type IDS",
        "security_criticality": "EXTREME",  # string instead of float
        "ai_complexity": 50.0,
        "requirement_uncertainty": 50.0,
        "threat_volatility": 50.0,
        "operational_criticality": 50.0,
        "compliance_requirement": 50.0,
        "team_experience": 50.0,
    }
    response = client.post("/api/assessments", json=payload)
    assert response.status_code == 422
    assert response.json()["error"] == "Validation Error"

def test_dashboard_comprehensive_intelligence_metrics():
    # Create two evaluations
    p1 = {
        "project_name": "Test Alpha Mission Defense",
        "category": "Critical Infrastructure",
        "security_criticality": 95.0,
        "ai_complexity": 85.0,
        "requirement_uncertainty": 30.0,
        "threat_volatility": 80.0,
        "operational_criticality": 90.0,
        "compliance_requirement": 85.0,
        "team_experience": 90.0,  # Team Risk = 10.0
    }
    p2 = {
        "project_name": "Test Beta Web Gateway",
        "category": "Perimeter IDS",
        "security_criticality": 20.0,
        "ai_complexity": 15.0,
        "requirement_uncertainty": 20.0,
        "threat_volatility": 15.0,
        "operational_criticality": 25.0,
        "compliance_requirement": 20.0,
        "team_experience": 80.0,  # Team Risk = 20.0
    }
    r1 = client.post("/api/assessments", json=p1)
    assert r1.status_code == 201
    id1 = r1.json()["id"]

    r2 = client.post("/api/assessments", json=p2)
    assert r2.status_code == 201
    id2 = r2.json()["id"]

    dash = client.get("/api/dashboard").json()
    assert dash["total_assessments"] >= 2
    assert "average_risk_level" in dash
    assert dash["critical_projects_count"] >= 1
    assert "high_risk_percentage" in dash
    assert len(dash["sdlc_ranking"]) == 5
    assert len(dash["factor_averages"]) == 7

    # Verify factor weights sum to 1.0 (100%)
    total_weights = sum(f["weight"] for f in dash["factor_averages"])
    assert round(total_weights, 4) == 1.0000

    # Verify team risk factor is present and computed
    team_factor = next(f for f in dash["factor_averages"] if f["key"] == "team_risk")
    assert team_factor["name"] == "Team Risk"
    assert team_factor["weight"] == 0.05

    # Verify activity feed
    assert len(dash["activity_feed"]) >= 2
    assert any("Test Alpha" in a["title"] for a in dash["activity_feed"])

    # Clean up
    client.delete(f"/api/assessments/{id1}")
    client.delete(f"/api/assessments/{id2}")


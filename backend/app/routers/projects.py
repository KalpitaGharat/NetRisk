from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.project import Project
from ..schemas.project import ProjectCreate, ProjectRead
from ..utils.validators import sanitize_string

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED, summary="Create a new project")
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    """Register a new AI-based IDS project."""
    clean_name = sanitize_string(payload.name)
    if not clean_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Project name cannot be empty."
        )

    # Check for existing project with same name to reuse or create new
    existing = db.query(Project).filter(Project.name.ilike(clean_name)).first()
    if existing:
        updated = False
        if payload.description:
            existing.description = sanitize_string(payload.description)
            updated = True
        if payload.category:
            existing.category = payload.category
            updated = True
        if updated:
            db.commit()
            db.refresh(existing)
        return existing

    new_project = Project(
        name=clean_name,
        description=sanitize_string(payload.description) if payload.description else None,
        category=payload.category or "AI-IDS Cybersecurity",
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("", response_model=List[ProjectRead], summary="List all projects")
def list_projects(db: Session = Depends(get_db)):
    """Retrieve all recorded IDS projects ordered by recent update."""
    return db.query(Project).order_by(Project.updated_at.desc()).all()

@router.get("/{project_id}", response_model=ProjectRead, summary="Get project by ID")
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Retrieve details for a specific project by its ID."""
    proj = db.query(Project).filter(Project.id == project_id).first()
    if not proj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found."
        )
    return proj

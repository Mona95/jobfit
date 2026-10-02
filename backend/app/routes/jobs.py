from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.schemas.job import JobCreate, JobUpdate, JobResponse, JobListResponse
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

VALID_STATUSES = ["saved", "applied", "interview", "offer", "rejected"]

@router.post("", response_model=JobResponse, status_code=201)
def create_job(
    body: JobCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = Job(
        title=body.title,
        company=body.company,
        description=body.description,
        url=body.url,
        notes=body.notes,
        user_id=current_user.id
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

@router.get("", response_model=list[JobListResponse])
def get_jobs(
    status: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Job).filter(Job.user_id == current_user.id)

    if status:
        if status not in VALID_STATUSES:
            raise HTTPException(400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")
        query = query.filter(Job.status == status)

    return query.order_by(Job.created_at.desc()).all()

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if job is None:
        raise HTTPException(404, detail="Job not found")

    return job

@router.patch("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    body: JobUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if job is None:
        raise HTTPException(404, detail="Job not found")

    if body.status and body.status not in VALID_STATUSES:
        raise HTTPException(400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")

    # Only update fields that were actually sent
    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=204)
def delete_job(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if job is None:
        raise HTTPException(404, detail="Job not found")

    db.delete(job)
    db.commit()
    return None
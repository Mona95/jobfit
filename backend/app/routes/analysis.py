from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cv import CV
from app.models.job import Job
from app.models.user import User
from app.models.analysis import AnalysisResult
from app.schemas.analysis import (
    AnalysisRequest, AnalysisResponse,
    TailoringRequest, TailoringResponse,
    CoverLetterRequest, CoverLetterResponse,
    InterviewPrepRequest, InterviewPrepResponse,
    JobAnalysisRequest, JobAnalysisResponse
)
from app.services.rag import get_or_index_cv
from app.services.ai import (
    analyze_cv_against_job,
    tailor_cv,
    generate_cover_letter,
    generate_interview_prep
)
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/analysis", tags=["analysis"])


def get_cv_or_404(cv_id: str, user_id: str, db: Session) -> CV:
    cv = db.query(CV).filter(
        CV.id == cv_id,
        CV.user_id == user_id
    ).first()
    if cv is None:
        raise HTTPException(404, detail="CV not found")
    return cv


def get_job_or_404(job_id: str, user_id: str, db: Session) -> Job:
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == user_id
    ).first()
    if job is None:
        raise HTTPException(404, detail="Job not found")
    return job


def get_or_create_result(
    cv_id: str,
    job_id: str,
    user_id: str,
    db: Session
) -> AnalysisResult:
    """
    Get existing result row for this job or create a new one.
    One row per job — columns updated as user generates each feature.
    """
    result = db.query(AnalysisResult).filter(
        AnalysisResult.job_id == job_id,
        AnalysisResult.user_id == user_id
    ).first()

    if result is None:
        result = AnalysisResult(
            cv_id=cv_id,
            job_id=job_id,
            user_id=user_id
        )
        db.add(result)
        db.commit()
        db.refresh(result)

    return result


@router.post("/analyze", response_model=AnalysisResponse)
def analyze(
    body: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = get_cv_or_404(body.cv_id, current_user.id, db)

    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=body.job_description
    )

    if not cv_sections:
        raise HTTPException(400, detail="Could not process CV — please try again")

    result = analyze_cv_against_job(
        cv_sections=cv_sections,
        job_description=body.job_description
    )

    return result


@router.post("/analyze/job", response_model=JobAnalysisResponse)
def analyze_for_job(
    body: JobAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze CV against a saved job — stores result in database."""
    cv = get_cv_or_404(body.cv_id, current_user.id, db)
    job = get_job_or_404(body.job_id, current_user.id, db)

    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=job.description
    )

    if not cv_sections:
        raise HTTPException(400, detail="Could not process CV — please try again")

    analysis_data = analyze_cv_against_job(
        cv_sections=cv_sections,
        job_description=job.description
    )

    # Save to database
    result = get_or_create_result(body.cv_id, body.job_id, current_user.id, db)
    result.analysis = analysis_data
    db.commit()
    db.refresh(result)

    return result


@router.post("/tailor/job", response_model=JobAnalysisResponse)
def tailor_for_job(
    body: JobAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Tailor CV for a saved job — stores result in database."""
    cv = get_cv_or_404(body.cv_id, current_user.id, db)
    job = get_job_or_404(body.job_id, current_user.id, db)

    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=job.description
    )

    if not cv_sections:
        raise HTTPException(400, detail="Could not process CV — please try again")

    tailoring_data = tailor_cv(
        cv_sections=cv_sections,
        job_description=job.description
    )

    result = get_or_create_result(body.cv_id, body.job_id, current_user.id, db)
    result.tailoring = tailoring_data
    db.commit()
    db.refresh(result)

    return result


@router.post("/cover-letter/job", response_model=JobAnalysisResponse)
def cover_letter_for_job(
    body: CoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate cover letter for a saved job — stores result in database."""
    cv = get_cv_or_404(body.cv_id, current_user.id, db)
    job = get_job_or_404(body.job_id, current_user.id, db)

    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=job.description
    )

    if not cv_sections:
        raise HTTPException(400, detail="Could not process CV — please try again")

    cover_letter_data = generate_cover_letter(
        cv_sections=cv_sections,
        job_description=job.description,
        company_name=body.company_name,
        role_title=body.role_title,
        tone=body.tone
    )

    result = get_or_create_result(body.cv_id, body.job_id, current_user.id, db)
    result.cover_letter = cover_letter_data
    db.commit()
    db.refresh(result)

    return result


@router.post("/interview-prep/job", response_model=JobAnalysisResponse)
def interview_prep_for_job(
    body: JobAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate interview prep for a saved job — stores result in database."""
    cv = get_cv_or_404(body.cv_id, current_user.id, db)
    job = get_job_or_404(body.job_id, current_user.id, db)

    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=job.description
    )

    if not cv_sections:
        raise HTTPException(400, detail="Could not process CV — please try again")

    interview_data = generate_interview_prep(
        cv_sections=cv_sections,
        job_description=job.description
    )

    result = get_or_create_result(body.cv_id, body.job_id, current_user.id, db)
    result.interview_prep = interview_data
    db.commit()
    db.refresh(result)

    return result


@router.get("/job/{job_id}", response_model=JobAnalysisResponse)
def get_job_results(
    job_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all stored results for a specific job."""
    result = db.query(AnalysisResult).filter(
        AnalysisResult.job_id == job_id,
        AnalysisResult.user_id == current_user.id
    ).first()

    if result is None:
        raise HTTPException(404, detail="No analysis found for this job")

    return result
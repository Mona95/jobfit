from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cv import CV
from app.models.user import User
from app.schemas.analysis import (
    AnalysisRequest, AnalysisResponse,
    TailoringRequest, TailoringResponse,
    CoverLetterRequest, CoverLetterResponse,
    InterviewPrepRequest, InterviewPrepResponse
)
from app.services.rag import search_cv
from app.services.ai import (
    analyze_cv_against_job,
    tailor_cv,
    generate_cover_letter,
    generate_interview_prep
)
from app.middleware.auth import get_current_user
from app.services.rag import get_or_index_cv

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

def get_cv_or_404(cv_id: str, user_id: str, db: Session) -> CV:
    """Helper — fetch CV and verify ownership."""
    cv = db.query(CV).filter(
        CV.id == cv_id,
        CV.user_id == user_id
    ).first()
    if cv is None:
        raise HTTPException(404, detail="CV not found")
    return cv

@router.post("/analyze", response_model=AnalysisResponse)
def analyze(
    body: AnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify CV belongs to user
    cv = get_cv_or_404(body.cv_id, current_user.id, db)

    # Search ChromaDB for relevant CV sections
    cv_sections = get_or_index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_content=cv.content,
        query=body.job_description
    )

    if not cv_sections:
        raise HTTPException(400, detail="CV not indexed — please re-upload your CV")

    # Send to Groq for analysis
    result = analyze_cv_against_job(
        cv_sections=cv_sections,
        job_description=body.job_description
    )

    return result

@router.post("/tailor", response_model=TailoringResponse)
def tailor(
    body: TailoringRequest,
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
        raise HTTPException(400, detail="CV not indexed — please re-upload your CV")

    result = tailor_cv(
        cv_sections=cv_sections,
        job_description=body.job_description
    )

    return result

@router.post("/cover-letter", response_model=CoverLetterResponse)
def cover_letter(
    body: CoverLetterRequest,
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
        raise HTTPException(400, detail="CV not indexed — please re-upload your CV")

    result = generate_cover_letter(
        cv_sections=cv_sections,
        job_description=body.job_description,
        company_name=body.company_name,
        role_title=body.role_title,
        tone=body.tone
    )

    return result

@router.post("/interview-prep", response_model=InterviewPrepResponse)
def interview_prep(
    body: InterviewPrepRequest,
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
        raise HTTPException(400, detail="CV not indexed — please re-upload your CV")

    result = generate_interview_prep(
        cv_sections=cv_sections,
        job_description=body.job_description
    )

    return result
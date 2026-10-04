from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.cv import CV
from app.models.user import User
from app.models.analysis import AnalysisResult
from app.schemas.cv import CVResponse, CVListResponse, CVUpdate, CVStatsResponse
from app.services.pdf import extract_text_from_pdf, validate_pdf
from app.services.rag import index_cv, delete_cv_index
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/cv", tags=["cv"])

@router.post("", response_model=CVResponse, status_code=201)
async def upload_cv(
    title: str = Form(...),
    label: str = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, detail="Only PDF files are supported")

    file_bytes = await file.read()

    if not validate_pdf(file_bytes):
        raise HTTPException(400, detail="Invalid PDF file")

    content = extract_text_from_pdf(file_bytes)

    if not content.strip():
        raise HTTPException(400, detail="Could not extract text from PDF")

    cv = CV(
        title=title,
        label=label,
        content=content,
        file_name=file.filename,
        user_id=current_user.id
    )

    db.add(cv)
    db.commit()
    db.refresh(cv)

    chunks_indexed = index_cv(
        user_id=current_user.id,
        cv_id=cv.id,
        cv_text=content
    )

    print(f"✅ CV indexed: {chunks_indexed} chunks stored in ChromaDB")

    return cv

@router.get("", response_model=list[CVListResponse])
def get_cvs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(CV).filter(
        CV.user_id == current_user.id
    ).order_by(CV.created_at.desc()).all()

@router.get("/stats", response_model=list[CVStatsResponse])
def get_cv_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Return performance stats for each CV version.
    Shows which CV gets the best match scores.
    """
    cvs = db.query(CV).filter(CV.user_id == current_user.id).all()

    stats = []
    for cv in cvs:
        # Get all analysis results for this CV
        results = db.query(AnalysisResult).filter(
            AnalysisResult.cv_id == cv.id,
            AnalysisResult.user_id == current_user.id,
            AnalysisResult.analysis.isnot(None)
        ).all()

        if not results:
            stats.append(CVStatsResponse(
                cv_id=cv.id,
                title=cv.title,
                label=cv.label,
                total_applications=0,
                avg_match_score=0.0,
                avg_ats_score=0.0,
                best_match_score=0
            ))
            continue

        match_scores = [r.analysis.get("match_score", 0) for r in results]
        ats_scores = [r.analysis.get("ats_score", 0) for r in results]

        stats.append(CVStatsResponse(
            cv_id=cv.id,
            title=cv.title,
            label=cv.label,
            total_applications=len(results),
            avg_match_score=round(sum(match_scores) / len(match_scores), 1),
            avg_ats_score=round(sum(ats_scores) / len(ats_scores), 1),
            best_match_score=max(match_scores)
        ))

    return stats

@router.get("/{cv_id}", response_model=CVResponse)
def get_cv(
    cv_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = db.query(CV).filter(
        CV.id == cv_id,
        CV.user_id == current_user.id
    ).first()

    if cv is None:
        raise HTTPException(404, detail="CV not found")

    return cv

@router.patch("/{cv_id}", response_model=CVResponse)
def update_cv(
    cv_id: str,
    body: CVUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = db.query(CV).filter(
        CV.id == cv_id,
        CV.user_id == current_user.id
    ).first()

    if cv is None:
        raise HTTPException(404, detail="CV not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(cv, field, value)

    db.commit()
    db.refresh(cv)
    return cv

@router.delete("/{cv_id}", status_code=204)
def delete_cv(
    cv_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cv = db.query(CV).filter(
        CV.id == cv_id,
        CV.user_id == current_user.id
    ).first()

    if cv is None:
        raise HTTPException(404, detail="CV not found")

    delete_cv_index(user_id=current_user.id, cv_id=cv_id)

    db.delete(cv)
    db.commit()
    return None
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.cv import CV
from app.models.user import User
from app.schemas.cv import CVResponse, CVListResponse
from app.services.pdf import extract_text_from_pdf, validate_pdf
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/cv", tags=["cv"])

@router.post("", response_model=CVResponse, status_code=201)
async def upload_cv(
    title: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate file type
    if not file.filename.endswith(".pdf"):
        raise HTTPException(400, detail="Only PDF files are supported")

    # Read file bytes
    file_bytes = await file.read()

    # Validate it's a real PDF
    if not validate_pdf(file_bytes):
        raise HTTPException(400, detail="Invalid PDF file")

    # Extract text
    content = extract_text_from_pdf(file_bytes)

    if not content.strip():
        raise HTTPException(400, detail="Could not extract text from PDF — make sure it is not a scanned image")

    # Save to database
    cv = CV(
        title=title,
        content=content,
        file_name=file.filename,
        user_id=current_user.id
    )

    db.add(cv)
    db.commit()
    db.refresh(cv)

    return cv

@router.get("", response_model=list[CVListResponse])
def get_cvs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cvs = db.query(CV).filter(
        CV.user_id == current_user.id
    ).order_by(CV.created_at.desc()).all()

    return cvs

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

    db.delete(cv)
    db.commit()

    return None
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from app.database import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    cv_id = Column(String, ForeignKey("cvs.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False, unique=True)
    analysis = Column(JSON, nullable=True)
    tailoring = Column(JSON, nullable=True)
    cover_letter = Column(JSON, nullable=True)
    interview_prep = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
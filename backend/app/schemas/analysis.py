from pydantic import BaseModel
from typing import Optional

class AnalysisRequest(BaseModel):
    cv_id: str
    job_description: str

class AnalysisResponse(BaseModel):
    match_score: int
    ats_score: int
    summary: str
    matching_keywords: list[str]
    missing_keywords: list[str]
    strengths: list[str]
    skill_gaps: list[str]
    recommendations: list[str]

class TailoringRequest(BaseModel):
    cv_id: str
    job_description: str

class TailoringSection(BaseModel):
    original: str
    rewritten: str
    changes_made: str

class TailoringResponse(BaseModel):
    rewritten_sections: list[TailoringSection]
    keywords_added: list[str]
    overall_advice: str

class CoverLetterRequest(BaseModel):
    cv_id: str
    job_description: str
    company_name: str
    role_title: str
    tone: str = "professional"

class CoverLetterResponse(BaseModel):
    cover_letter: str
    key_points_highlighted: list[str]

class InterviewPrepRequest(BaseModel):
    cv_id: str
    job_description: str

class InterviewQuestion(BaseModel):
    question: str
    category: str
    difficulty: str
    suggested_answer: str
    key_points: list[str]

class InterviewPrepResponse(BaseModel):
    questions: list[InterviewQuestion]
    preparation_tips: list[str]
from typing import Optional

from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CVCreate(BaseModel):
    title: str
    label: Optional[str] = None

class CVUpdate(BaseModel):
    title: Optional[str] = None
    label: Optional[str] = None

class CVResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    label: Optional[str] = None
    content: str
    file_name: str | None
    file_path: Optional[str]
    created_at: datetime
    updated_at: datetime

class CVListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    label: Optional[str] = None
    file_name: str | None
    created_at: datetime

class CVStatsResponse(BaseModel):
    cv_id: str
    title: str
    label: Optional[str]
    total_applications: int
    avg_match_score: float
    avg_ats_score: float
    best_match_score: int
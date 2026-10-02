from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    url: Optional[str] = None
    notes: Optional[str] = None

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class JobResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    company: str
    description: str
    url: Optional[str]
    status: str
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

class JobListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    company: str
    status: str
    url: Optional[str]
    created_at: datetime
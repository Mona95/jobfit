from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CVCreate(BaseModel):
    title: str

class CVResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    file_name: str | None
    created_at: datetime
    updated_at: datetime

class CVListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    file_name: str | None
    created_at: datetime
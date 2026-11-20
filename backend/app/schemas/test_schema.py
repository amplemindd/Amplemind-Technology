from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TestSchema(BaseModel):

    examName: str

    examType: str

    subject: str

    course: str

    examDate: datetime

    totalMarks: float

    createdAt: Optional[datetime] = datetime.utcnow()

    class Config:
        from_attributes = True
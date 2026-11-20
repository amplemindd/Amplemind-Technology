from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResultSchema(BaseModel):

    studentId: str

    rollNumber: str

    studentName: str

    email: str

    course: str

    batch: str

    examId: str

    examName: str

    examType: str

    subject: str

    examDate: datetime

    totalMarks: float

    obtainedMarks: float

    remarks: Optional[str] = ""

    isAbsent: bool = False

    createdAt: Optional[datetime] = datetime.utcnow()

    class Config:
        from_attributes = True
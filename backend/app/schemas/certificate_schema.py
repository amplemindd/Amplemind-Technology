from pydantic import BaseModel
from typing import Optional

class CertificateCreate(BaseModel):
    student_id: str
    student_name: str
    course: str
    certificate_name: str = "Certificate of Completion"
    completion_date: str = ""
    certificate_id: Optional[str] = None
    certificate_url: Optional[str] = None

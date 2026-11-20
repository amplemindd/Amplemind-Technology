from typing import Optional
from pydantic import BaseModel


class BlogSchema(BaseModel):

    title: str
    description: str
    category: str

    author: Optional[str] = "Admin"

    company: Optional[str] = None
    package: Optional[str] = None
    studentName: Optional[str] = None

    status: Optional[str] = "Published"
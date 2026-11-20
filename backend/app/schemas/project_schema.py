from pydantic import BaseModel
from typing import Optional


class ProjectSchema(BaseModel):

    title: str
    technology: str

    description: Optional[str] = ""

    status: str = "Active"
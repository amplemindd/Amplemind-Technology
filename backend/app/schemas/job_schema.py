from pydantic import BaseModel


class JobSchema(BaseModel):

    title: str
    location: str
    experience: str
    salary: str
    status: str = "Active"
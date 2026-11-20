from pydantic import BaseModel


class ApplicationSchema(BaseModel):

    name: str
    email: str
    phone: str
    jobTitle: str
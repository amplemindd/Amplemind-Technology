from pydantic import BaseModel


class UserSchema(BaseModel):

    name: str
    email: str
    role: str = "User"
    status: str = "Active"
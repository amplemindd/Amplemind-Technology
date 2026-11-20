from pydantic import BaseModel, EmailStr


# ==========================
# Admin Login
# ==========================

class AdminLogin(BaseModel):
    email: EmailStr
    password: str


# ==========================
# Change Password
# ==========================

class ChangePasswordSchema(BaseModel):
    currentPassword: str
    newPassword: str
    confirmPassword: str
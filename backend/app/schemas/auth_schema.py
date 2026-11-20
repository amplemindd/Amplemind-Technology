from pydantic import BaseModel, EmailStr


# ==========================================
# Student Register
# ==========================================

class StudentRegister(BaseModel):

    name: str

    email: EmailStr

    phone: str

    course: str

    password: str


# ==========================================
# Student Login
# ==========================================

class StudentLogin(BaseModel):

    email: EmailStr

    password: str


# ==========================================
# Forgot Password
# ==========================================

class ForgotPassword(BaseModel):

    email: EmailStr


# ==========================================
# Verify OTP
# ==========================================

class VerifyOTP(BaseModel):

    email: EmailStr

    otp: str


# ==========================================
# Reset Password
# ==========================================

class ResetPassword(BaseModel):

    email: EmailStr

    otp: str

    newPassword: str

    confirmPassword: str
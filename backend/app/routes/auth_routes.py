from fastapi import APIRouter

from app.schemas.auth_schema import (
    StudentRegister,
    StudentLogin,
    ForgotPassword,
    VerifyOTP,
    ResetPassword
)

from app.controllers.auth_controller import (
    student_register,
    student_login,
    forgot_password,
    verify_otp,
    reset_password
)

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# ==========================================
# Student Register
# ==========================================

@router.post("/student-register")
def register(student: StudentRegister):

    return student_register(student)


# ==========================================
# Student Login
# ==========================================

@router.post("/student-login")
def login(student: StudentLogin):

    return student_login(student)


# ==========================================
# Forgot Password
# ==========================================

@router.post("/forgot-password")
def forgot(data: ForgotPassword):

    return forgot_password(data)


# ==========================================
# Verify OTP
# ==========================================

@router.post("/verify-otp")
def verify(data: VerifyOTP):

    return verify_otp(data)


# ==========================================
# Reset Password
# ==========================================

@router.post("/reset-password")
def reset(data: ResetPassword):

    return reset_password(data)
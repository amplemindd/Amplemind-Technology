from bson import ObjectId
from datetime import datetime


class Settings:

    collection = "settings"

    @staticmethod
    def default_settings():

        return {

            # ==========================================
            # Company Information
            # ==========================================

            "companyName": "AmpleMind Technologies",

            "websiteName": "AmpleMind Technologies",

            "email": "",

            "phone": "",

            "address": "",

            "logo": "",

            "favicon": "",

            # ==========================================
            # Theme
            # ==========================================

            "primaryColor": "#2563eb",

            "secondaryColor": "#4f46e5",

            # ==========================================
            # Social Media
            # ==========================================

            "facebook": "",

            "instagram": "",

            "linkedin": "",

            "youtube": "",

            "twitter": "",

            # ==========================================
            # Email (SMTP) Settings
            # ==========================================

            "smtpHost": "smtp.gmail.com",

            "smtpPort": 587,

            "senderName": "AmpleMind Technologies",

            "senderEmail": "",

            "appPassword": "",

            "emailEnabled": False,

            # ==========================================
            # OTP Settings
            # ==========================================

            "otpLength": 6,

            "otpExpiryMinutes": 5,

            # ==========================================
            # Notification Settings
            # ==========================================

            "sendWelcomeEmail": True,

            "sendForgotPasswordOTP": True,

            "sendCertificateEmail": True,

            "createdAt": datetime.utcnow(),

            "updatedAt": datetime.utcnow()

        }
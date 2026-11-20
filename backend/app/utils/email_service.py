import os
import random
import requests

from dotenv import load_dotenv

from app.config.database import db


# ==========================================
# Load Environment Variables
# ==========================================

load_dotenv()


# ==========================================
# Database
# ==========================================

settings_collection = db["settings"]


# ==========================================
# Resend Configuration
# ==========================================

RESEND_API_URL = "https://api.resend.com/emails"

RESEND_API_KEY = os.getenv("RESEND_API_KEY")

RESEND_FROM_EMAIL = os.getenv(
    "RESEND_FROM_EMAIL",
    "noreply@amplemindtechnologies.com"
)


# ==========================================
# Generate OTP
# ==========================================

def generate_otp():
    return str(random.randint(100000, 999999))


# ==========================================
# Get Email Settings
# ==========================================

def get_email_settings():

    try:

        settings = settings_collection.find_one()

        if not settings:
            print("⚠️ Settings not found in database")
            return {
                "email_enabled": True,
                "sender_name": "AmpleMind Technologies"
            }

        email_enabled = settings.get(
            "emailEnabled",
            True
        )

        sender_name = settings.get(
            "senderName",
            "AmpleMind Technologies"
        )

        return {
            "email_enabled": bool(email_enabled),
            "sender_name": sender_name
        }

    except Exception as e:

        print("❌ EMAIL SETTINGS ERROR :", e)

        return {
            "email_enabled": True,
            "sender_name": "AmpleMind Technologies"
        }


# ==========================================
# Send Email Through Resend
# ==========================================

def send_email(receiver_email, subject, body, sender_name):

    try:

        if not RESEND_API_KEY:

            print("❌ RESEND_API_KEY is missing")

            return False

        if not receiver_email:

            print("❌ Receiver Email Missing")

            return False

        if not RESEND_FROM_EMAIL:

            print("❌ RESEND_FROM_EMAIL is missing")

            return False


        from_address = (
            f"{sender_name} <{RESEND_FROM_EMAIL}>"
        )


        payload = {
            "from": from_address,
            "to": [receiver_email],
            "subject": subject,
            "text": body
        }


        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json"
        }


        print("\n========== RESEND EMAIL ==========")
        print("From    :", RESEND_FROM_EMAIL)
        print("To      :", receiver_email)
        print("Subject :", subject)
        print("==================================\n")


        response = requests.post(
            RESEND_API_URL,
            headers=headers,
            json=payload,
            timeout=15
        )


        if response.status_code in (200, 201):

            print("✅ Email Sent Successfully Through Resend")

            return True


        print(
            "❌ Resend API Error :",
            response.status_code,
            response.text
        )

        return False


    except requests.exceptions.Timeout:

        print("❌ Resend API Timeout")

        return False


    except requests.exceptions.RequestException as e:

        print("❌ Resend Network Error :", e)

        return False


    except Exception as e:

        print("❌ EMAIL ERROR :", e)

        return False


# ==========================================
# Send OTP Email
# ==========================================

def send_otp_email(receiver_email, otp):

    try:

        email_settings = get_email_settings()

        email_enabled = email_settings["email_enabled"]

        sender_name = email_settings["sender_name"]


        if not email_enabled:

            print("❌ Email Service Disabled")

            return False


        subject = (
            "AmpleMind Technologies - Password Reset OTP"
        )


        body = f"""
Hello,

Your OTP for Password Reset is:

{otp}

This OTP is valid for 5 minutes.

If you did not request this password reset,
please ignore this email.

Regards,

{sender_name}
"""


        return send_email(
            receiver_email=receiver_email,
            subject=subject,
            body=body,
            sender_name=sender_name
        )


    except Exception as e:

        print("❌ OTP EMAIL ERROR :", e)

        return False


# ==========================================
# Send Password Changed Email
# ==========================================

def send_password_changed_email(receiver_email):

    try:

        email_settings = get_email_settings()

        email_enabled = email_settings["email_enabled"]

        sender_name = email_settings["sender_name"]


        if not email_enabled:

            print("❌ Email Service Disabled")

            return False


        subject = (
            "Password Changed Successfully"
        )


        body = f"""
Hello,

Your password for your AmpleMind Technologies account
has been changed successfully.

If you made this change, no further action is required.

If you did NOT change your password,
please contact our support team immediately.

Regards,

{sender_name}
"""


        return send_email(
            receiver_email=receiver_email,
            subject=subject,
            body=body,
            sender_name=sender_name
        )


    except Exception as e:

        print("❌ PASSWORD EMAIL ERROR :", e)

        return False
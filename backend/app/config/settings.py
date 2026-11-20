"""
Application Settings
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    # Server
    PORT = int(os.getenv("PORT", 5000))

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI")
    DATABASE_NAME = os.getenv("DATABASE_NAME")

    # JWT
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")


settings = Settings()
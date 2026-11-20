import os
import uuid
import shutil

from fastapi import UploadFile

# ==========================================
# Absolute Base Upload Folder
# ==========================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# BASE_DIR => backend-p/app

BASE_UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

os.makedirs(BASE_UPLOAD_FOLDER, exist_ok=True)

print("UPLOAD PATH :", BASE_UPLOAD_FOLDER)

# ==========================================
# Save File
# ==========================================

def save_file(file: UploadFile, folder: str = "courses"):

    try:

        upload_folder = os.path.join(BASE_UPLOAD_FOLDER, folder)
        os.makedirs(upload_folder, exist_ok=True)

        extension = os.path.splitext(file.filename)[1]

        filename = f"{uuid.uuid4()}{extension}"

        filepath = os.path.join(upload_folder, filename)

        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return f"/uploads/{folder}/{filename}"

    except Exception as e:

        print("Upload Error:", e)
        return None


# ==========================================
# Delete File
# ==========================================

def delete_file(file_path: str):

    try:

        if not file_path:
            return

        relative_path = file_path.replace("/uploads/", "")

        full_path = os.path.join(BASE_UPLOAD_FOLDER, relative_path)

        if os.path.exists(full_path):
            os.remove(full_path)

    except Exception as e:

        print("Delete Error:", e)
from fastapi import HTTPException
from app.models.seminar import seminar_collection
from app.schemas.seminar_schema import SeminarSchema, SeminarUpdateSchema


def _serialize(data):
    if not data:
        return None

    result = dict(data)

    if "_id" in result:
        result["_id"] = str(result["_id"])

    return result


from app.models.seminar import seminar_collection
from app.schemas.seminar_schema import SeminarUpdateSchema

FIELD_MAP = {
    "hero_line_1": "heroLine1",
    "hero_line_2": "heroLine2",
    "hero_line_3": "heroLine3",
    "registration_fee": "registrationFee",
    "registration_button": "registrationButton",
    "speaker_label": "speakerLabel",
    "speaker_heading": "speakerHeading",
    "speaker_name": "speakerName",
    "speaker_designation": "speakerDesignation",
    "speaker_description": "speakerDescription",
    "seminar_date": "seminarDate",
    "seminar_time": "seminarTime",
    "status": "status",
}

DEFAULT_SEMINAR = {
    "heroLine1": "You Have a Degree.",
    "heroLine2": "But Do You Have",
    "heroLine3": "a Career Roadmap?",
    "registrationFee": 99,
    "registrationButton": "REGISTER NOW",
    "speakerLabel": "WEBINAR SPEAKER",
    "speakerHeading": "Meet Our Founder & CEO",
    "speakerName": "Er. Sunny Mate",
    "speakerDesignation": "Founder & CEO",
    "speakerDescription": "",
    "seminarDate": "10th October",
    "seminarTime": "12:00 PM – 2:00 PM",
    "status": "active",
}

def _serialize(data):
    if not data:
        return None

    result = dict(data)

    if "_id" in result:
        result["_id"] = str(result["_id"])

    # Remove old snake_case duplicates if they exist.
    for old_key, new_key in FIELD_MAP.items():
        if old_key in result and new_key not in result:
            result[new_key] = result[old_key]
        result.pop(old_key, None)

    return result

def get_seminar():
    seminar = seminar_collection.find_one({"status": "active"})

    if not seminar:
        seminar_collection.insert_one(DEFAULT_SEMINAR.copy())
        seminar = seminar_collection.find_one({"status": "active"})

    return _serialize(seminar)

def update_seminar(data: SeminarUpdateSchema):
    current = seminar_collection.find_one({"status": "active"})

    if not current:
        seminar_collection.insert_one(DEFAULT_SEMINAR.copy())
        current = seminar_collection.find_one({"status": "active"})

    incoming = data.model_dump()

    updates = {}

    for old_key, value in incoming.items():
        if value is not None:
            db_key = FIELD_MAP.get(old_key, old_key)
            updates[db_key] = value

    if updates:
        seminar_collection.update_one(
            {"_id": current["_id"]},
            {"$set": updates}
        )

    updated = seminar_collection.find_one({"_id": current["_id"]})

    return _serialize(updated)


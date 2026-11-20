from collections import Counter
from datetime import datetime

from app.models.student import student_collection


def get_student_analytics():
    try:
        students = list(student_collection.find({}))

        total = len(students)
        active = 0
        inactive = 0
        course_counts = Counter()
        gender_counts = Counter()
        payment_counts = Counter()
        monthly_counts = Counter()

        for student in students:
            status = str(student.get("status") or "Unknown").strip()
            if status.lower() == "active":
                active += 1
            elif status.lower() == "inactive":
                inactive += 1

            course = str(student.get("course") or "Not specified").strip()
            gender = str(student.get("gender") or "Not specified").strip()
            payment = str(
                student.get("paymentStatus") or "Not specified"
            ).strip()

            course_counts[course] += 1
            gender_counts[gender] += 1
            payment_counts[payment] += 1

            created = student.get("createdAt") or student.get("created_at")
            month = None

            if isinstance(created, datetime):
                month = created.strftime("%Y-%m")
            elif isinstance(created, str):
                try:
                    month = datetime.fromisoformat(
                        created.replace("Z", "+00:00")
                    ).strftime("%Y-%m")
                except (ValueError, TypeError):
                    pass

            if month:
                monthly_counts[month] += 1

        return {
            "success": True,
            "analytics": {
                "totalStudents": total,
                "activeStudents": active,
                "inactiveStudents": inactive,
                "otherStatusStudents": total - active - inactive,
                "courseDistribution": [
                    {"label": label, "count": count}
                    for label, count in course_counts.most_common()
                ],
                "genderDistribution": [
                    {"label": label, "count": count}
                    for label, count in gender_counts.most_common()
                ],
                "paymentDistribution": [
                    {"label": label, "count": count}
                    for label, count in payment_counts.most_common()
                ],
                "monthlyAdmissions": [
                    {"month": month, "count": monthly_counts[month]}
                    for month in sorted(monthly_counts)
                ],
            },
        }

    except Exception:
        return {
            "success": False,
            "message": "Unable to fetch student analytics.",
        }

from app.models.student import student_collection
from app.models.job import job_collection
from app.models.service import service_collection
from app.models.project import project_collection


def get_dashboard_stats():
    try:
        total_students = student_collection.count_documents({})
        total_careers = job_collection.count_documents({})
        total_services = service_collection.count_documents({})
        total_projects = project_collection.count_documents({})

        return {
            "success": True,
            "stats": {
                "totalStudents": total_students,
                "totalCareers": total_careers,
                "totalServices": total_services,
                "totalProjects": total_projects,
            },
        }

    except Exception as e:
        return {
            "success": False,
            "message": "Failed to fetch dashboard statistics",
            "error": str(e),
        }
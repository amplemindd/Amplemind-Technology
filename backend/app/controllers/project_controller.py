from bson import ObjectId

from app.models.project import project_collection


# ==========================================
# Get All Projects
# ==========================================

def get_projects():

    try:

        projects = list(
            project_collection.find().sort(
                "createdAt",
                -1
            )
        )

        for project in projects:
            project["_id"] = str(project["_id"])

        return {
            "success": True,
            "count": len(projects),
            "projects": projects
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Add Project
# ==========================================

def add_project(project):

    try:

        if not project.title or not project.technology:

            return {
                "success": False,
                "message": "Project Title and Technology are required."
            }

        data = {
            "title": project.title,
            "description": project.description,
            "technology": project.technology,
            "status": project.status
        }

        result = project_collection.insert_one(data)

        new_project = project_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        new_project["_id"] = str(new_project["_id"])

        return {
            "success": True,
            "message": "Project Added Successfully",
            "project": new_project
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update Project
# ==========================================

def update_project(project_id, project):

    try:

        existing = project_collection.find_one(
            {
                "_id": ObjectId(project_id)
            }
        )

        if not existing:

            return {
                "success": False,
                "message": "Project not found"
            }

        project_collection.update_one(
            {
                "_id": ObjectId(project_id)
            },
            {
                "$set": {
                    "title": project.title,
                    "description": project.description,
                    "technology": project.technology,
                    "status": project.status
                }
            }
        )

        updated = project_collection.find_one(
            {
                "_id": ObjectId(project_id)
            }
        )

        updated["_id"] = str(updated["_id"])

        return {
            "success": True,
            "message": "Project Updated Successfully",
            "project": updated
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Delete Project
# ==========================================

def delete_project(project_id):

    try:

        existing = project_collection.find_one(
            {
                "_id": ObjectId(project_id)
            }
        )

        if not existing:

            return {
                "success": False,
                "message": "Project not found"
            }

        project_collection.delete_one(
            {
                "_id": ObjectId(project_id)
            }
        )

        return {
            "success": True,
            "message": "Project Deleted Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
from bson import ObjectId

from app.models.job import job_collection


# ==========================================
# Get All Jobs
# ==========================================

def get_all_jobs():

    try:

        jobs = list(
            job_collection.find().sort("createdAt", -1)
        )

        for job in jobs:
            job["_id"] = str(job["_id"])

        return {
            "success": True,
            "message": "Jobs Fetched Successfully",
            "jobs": jobs
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Get Single Job
# ==========================================

def get_job(job_id):

    try:

        job = job_collection.find_one(
            {
                "_id": ObjectId(job_id)
            }
        )

        if not job:

            return {
                "success": False,
                "message": "Job Not Found"
            }

        job["_id"] = str(job["_id"])

        return {
            "success": True,
            "job": job
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Add Job
# ==========================================

def add_job(job):

    try:

        data = {
            "title": job.title,
            "location": job.location,
            "experience": job.experience,
            "salary": job.salary,
            "status": job.status
        }

        result = job_collection.insert_one(data)

        new_job = job_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        new_job["_id"] = str(new_job["_id"])

        return {
            "success": True,
            "message": "Job Added Successfully",
            "job": new_job
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update Job
# ==========================================

def update_job(job_id, job):

    try:

        existing_job = job_collection.find_one(
            {
                "_id": ObjectId(job_id)
            }
        )

        if not existing_job:

            return {
                "success": False,
                "message": "Job Not Found"
            }

        job_collection.update_one(
            {
                "_id": ObjectId(job_id)
            },
            {
                "$set": {
                    "title": job.title,
                    "location": job.location,
                    "experience": job.experience,
                    "salary": job.salary,
                    "status": job.status
                }
            }
        )

        updated_job = job_collection.find_one(
            {
                "_id": ObjectId(job_id)
            }
        )

        updated_job["_id"] = str(updated_job["_id"])

        return {
            "success": True,
            "message": "Job Updated Successfully",
            "job": updated_job
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Delete Job
# ==========================================

def delete_job(job_id):

    try:

        existing_job = job_collection.find_one(
            {
                "_id": ObjectId(job_id)
            }
        )

        if not existing_job:

            return {
                "success": False,
                "message": "Job Not Found"
            }

        job_collection.delete_one(
            {
                "_id": ObjectId(job_id)
            }
        )

        return {
            "success": True,
            "message": "Job Deleted Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Job Statistics
# ==========================================

def get_job_statistics():

    try:

        total_jobs = job_collection.count_documents({})

        active_jobs = job_collection.count_documents(
            {
                "status": "Active"
            }
        )

        inactive_jobs = job_collection.count_documents(
            {
                "status": "Inactive"
            }
        )

        return {
            "success": True,
            "statistics": {
                "totalJobs": total_jobs,
                "activeJobs": active_jobs,
                "inactiveJobs": inactive_jobs
            }
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
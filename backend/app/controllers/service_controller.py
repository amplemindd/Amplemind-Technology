from bson import ObjectId

from app.models.service import service_collection


# ==========================================
# Get All Services
# ==========================================

def get_all_services():
    try:

        services = list(service_collection.find())

        for service in services:
            service["_id"] = str(service["_id"])

        return {
            "success": True,
            "message": "Services Fetched Successfully",
            "services": services
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Add Service
# ==========================================

def add_service(service):
    try:

        service_data = {
            "name": service.name,
            "category": service.category,
            "status": service.status
        }

        result = service_collection.insert_one(service_data)

        new_service = service_collection.find_one(
            {
                "_id": result.inserted_id
            }
        )

        new_service["_id"] = str(new_service["_id"])

        return {
            "success": True,
            "message": "Service Added Successfully",
            "service": new_service
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Update Service
# ==========================================

def update_service(service_id, service):
    try:

        existing_service = service_collection.find_one(
            {
                "_id": ObjectId(service_id)
            }
        )

        if not existing_service:
            return {
                "success": False,
                "message": "Service Not Found"
            }

        service_collection.update_one(
            {
                "_id": ObjectId(service_id)
            },
            {
                "$set": {
                    "name": service.name,
                    "category": service.category,
                    "status": service.status
                }
            }
        )

        updated_service = service_collection.find_one(
            {
                "_id": ObjectId(service_id)
            }
        )

        updated_service["_id"] = str(updated_service["_id"])

        return {
            "success": True,
            "message": "Service Updated Successfully",
            "service": updated_service
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ==========================================
# Delete Service
# ==========================================

def delete_service(service_id):
    try:

        existing_service = service_collection.find_one(
            {
                "_id": ObjectId(service_id)
            }
        )

        if not existing_service:
            return {
                "success": False,
                "message": "Service Not Found"
            }

        service_collection.delete_one(
            {
                "_id": ObjectId(service_id)
            }
        )

        return {
            "success": True,
            "message": "Service Deleted Successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }
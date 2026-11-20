from fastapi import APIRouter

from app.schemas.project_schema import ProjectSchema

from app.controllers.project_controller import (
    get_projects,
    add_project,
    update_project,
    delete_project
)

router = APIRouter(
    prefix="/api/projects",
    tags=["Projects"]
)


# ==========================================
# Get All Projects
# ==========================================

@router.get("/")
def get_all_projects():

    return get_projects()


# ==========================================
# Add Project
# ==========================================

@router.post("/")
def create_project(
    project: ProjectSchema
):

    return add_project(project)


# ==========================================
# Update Project
# ==========================================

@router.put("/{project_id}")
def edit_project(
    project_id: str,
    project: ProjectSchema
):

    return update_project(
        project_id,
        project
    )


# ==========================================
# Delete Project
# ==========================================

@router.delete("/{project_id}")
def remove_project(
    project_id: str
):

    return delete_project(
        project_id
    )
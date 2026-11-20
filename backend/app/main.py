import os
import sys

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AmpleMind Technologies API",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://amplemindtechnologies.com",
        "https://www.amplemindtechnologies.com",
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

# main.py:
# /home/ezdguybs9tn4/backend-new/backend-p/app/main.py
#
# Actual uploads:
# /home/ezdguybs9tn4/backend-new/backend-p/uploads

UPLOAD_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "uploads")
)

print("")
print("============================================================")
print("UPLOAD DIRECTORY")
print("============================================================")
print("BASE DIR   :", BASE_DIR)
print("UPLOAD DIR :", UPLOAD_DIR)
print("EXISTS     :", os.path.exists(UPLOAD_DIR))
print("============================================================")
print("")


# ============================================================
# DIRECT UPLOAD ASGI MIDDLEWARE
# ============================================================
#
# This handles:
#
# /api/uploads/...
#
# BEFORE FastAPI routing.
#
# This is intentional because Passenger is setting:
#
# root_path = /api
#
# while the incoming scope path can still contain:
#
# /api/...
#
# Normal API routes are handled separately below.
# ============================================================

class UploadMiddleware:

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):

        # ----------------------------------------------------
        # Only HTTP requests
        # ----------------------------------------------------

        if scope.get("type") != "http":
            await self.app(scope, receive, send)
            return

        # ----------------------------------------------------
        # Get path directly from ASGI scope
        # ----------------------------------------------------

        path = scope.get("path", "")

        root_path = scope.get("root_path", "")

        method = scope.get("method", "GET")

        print("")
        print("============================================================")
        print("UPLOAD / ASGI REQUEST")
        print("============================================================")
        print("METHOD     :", method)
        print("PATH       :", repr(path))
        print("ROOT PATH  :", repr(root_path))
        print("============================================================")

        # ----------------------------------------------------
        # Upload URL
        # ----------------------------------------------------

        upload_prefix = "/uploads/"

        if path.startswith(upload_prefix):

            print("UPLOAD ASGI HANDLER ENTERED")

            # ------------------------------------------------
            # Extract relative file path
            # ------------------------------------------------

            file_path = path[
                len(upload_prefix):
            ].lstrip("/")

            print("UPLOAD FILE :", repr(file_path))

            # ------------------------------------------------
            # Absolute upload directory
            # ------------------------------------------------

            upload_root = os.path.abspath(
                UPLOAD_DIR
            )

            # ------------------------------------------------
            # Requested file
            # ------------------------------------------------

            requested_file = os.path.abspath(
                os.path.join(
                    upload_root,
                    file_path
                )
            )

            print("UPLOAD ROOT :", upload_root)
            print("FILE PATH   :", requested_file)

            # ------------------------------------------------
            # Security check
            # ------------------------------------------------

            try:

                common_path = os.path.commonpath(
                    [
                        upload_root,
                        requested_file
                    ]
                )

            except ValueError:

                common_path = ""

            if common_path != upload_root:

                print("UPLOAD SECURITY BLOCK")
                print("============================================================")

                response = JSONResponse(
                    status_code=400,
                    content={
                        "detail": "Invalid file path"
                    }
                )

                await response(scope, receive, send)
                return

            # ------------------------------------------------
            # Check file exists
            # ------------------------------------------------

            if not os.path.isfile(requested_file):

                print("UPLOAD FILE NOT FOUND")
                print("============================================================")

                response = JSONResponse(
                    status_code=404,
                    content={
                        "detail": "File not found",
                        "path": file_path
                    }
                )

                await response(scope, receive, send)
                return

            # ------------------------------------------------
            # File exists
            # ------------------------------------------------

            file_size = os.path.getsize(
                requested_file
            )

            print("UPLOAD FILE FOUND")
            print("FILE SIZE :", file_size)
            print("============================================================")

            # ------------------------------------------------
            # HEAD request
            # ------------------------------------------------

            if method == "HEAD":

                response = FileResponse(
                    path=requested_file
                )

                await response(
                    scope,
                    receive,
                    send
                )

                return

            # ------------------------------------------------
            # GET request
            # ------------------------------------------------

            response = FileResponse(
                path=requested_file
            )

            await response(
                scope,
                receive,
                send
            )

            return

        # ----------------------------------------------------
        # Normal request
        # ----------------------------------------------------

        await self.app(
            scope,
            receive,
            send
        )


# ============================================================
# INSTALL UPLOAD MIDDLEWARE
# ============================================================

app.add_middleware(
    UploadMiddleware
)


# ============================================================
# PASSENGER /API NORMALIZATION
# ============================================================

@app.middleware("http")
async def passenger_api_normalizer(request: Request, call_next):

    path = request.scope.get(
        "path",
        ""
    )

    root_path = request.scope.get(
        "root_path",
        ""
    )

    print("")
    print("============================================================")
    print("PASSENGER REQUEST")
    print("============================================================")
    print("METHOD       :", request.method)
    print("ORIGINAL PATH:", repr(path))
    print("ROOT PATH    :", repr(root_path))
    print("============================================================")

    # --------------------------------------------------------
    # Normal API path normalization
    # --------------------------------------------------------

    if root_path == "/api":

        # ----------------------------------------------------
        # Exact /api
        # ----------------------------------------------------

        if path == "/api":

            request.scope["path"] = "/"
            request.scope["root_path"] = ""

            raw_path = request.scope.get(
                "raw_path"
            )

            if raw_path:
                request.scope["raw_path"] = b"/"

        # ----------------------------------------------------
        # Already contains /api
        # ----------------------------------------------------

        elif path.startswith("/api/"):

            request.scope["path"] = path
            request.scope["root_path"] = ""

        # ----------------------------------------------------
        # Passenger removed /api
        # ----------------------------------------------------

        else:

            new_path = (
                "/api"
                + (
                    path
                    if path.startswith("/")
                    else "/" + path
                )
            )

            request.scope["path"] = new_path
            request.scope["root_path"] = ""

            raw_path = request.scope.get(
                "raw_path"
            )

            if raw_path:

                if raw_path.startswith(b"/"):

                    request.scope["raw_path"] = (
                        b"/api" + raw_path
                    )

                else:

                    request.scope["raw_path"] = (
                        b"/api/" + raw_path
                    )

    # --------------------------------------------------------
    # Final debug
    # --------------------------------------------------------

    print("FINAL PATH  :", repr(
        request.scope.get("path")
    ))

    print("FINAL ROOT  :", repr(
        request.scope.get("root_path")
    ))

    print("============================================================")

    response = await call_next(
        request
    )

    print("RESPONSE    :", response.status_code)
    print("============================================================")
    print("")

    return response


# ============================================================
# API ROUTER IMPORTS
# ============================================================

from app.routes.admin_routes import router as admin_router
from app.routes.admin_student_routes import router as admin_student_router
from app.routes.application_routes import router as application_router
from app.routes.auth_routes import router as auth_router
from app.routes.blog_routes import router as blog_router
from app.routes.certificate_routes import router as certificate_router
from app.routes.course_routes import router as course_router
from app.routes.dashboard_routes import router as dashboard_router
from app.routes.job_routes import router as job_router
from app.routes.payment_routes import router as payment_router
from app.routes.profile_routes import router as profile_router
from app.routes.project_routes import router as project_router
from app.routes.result_routes import router as result_router
from app.routes.service_routes import router as service_router
from app.routes.settings_routes import router as settings_router
from app.routes.student_routes import router as student_router
from app.routes.test_routes import router as test_router
from app.routes.user_routes import router as user_router
from app.routes.seminar_routes import router as seminar_router


# ============================================================
# REGISTER ROUTERS
# ============================================================

routers = [
    admin_router,
    admin_student_router,
    application_router,
    auth_router,
    blog_router,
    certificate_router,
    course_router,
    dashboard_router,
    job_router,
    payment_router,
    profile_router,
    project_router,
    result_router,
    service_router,
    settings_router,
    student_router,
    test_router,
    user_router,
    seminar_router,
]


print("")
print("============================================================")
print("REGISTERING API ROUTERS")
print("============================================================")

for router in routers:

    print("")
    print("ROUTER:", router)

    for route in router.routes:

        print(
            "ROUTE:",
            getattr(route, "path", None),
            getattr(route, "methods", None)
        )

    app.include_router(
        router
    )


print("")
print("============================================================")
print("ALL API ROUTERS REGISTERED")
print("============================================================")


# ============================================================
# HOME
# ============================================================

@app.get("/")
def home():

    return {
        "success": True,
        "message": "Welcome to AmpleMind Technologies API"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/api/health")
@app.get("/health")
def health():

    return {
        "success": True,
        "status": "healthy",
        "message": "AmpleMind API is running"
    }


# ============================================================
# DATABASE TEST
# ============================================================

@app.get("/test-db")
def test_db():

    try:

        from app.config.database import db

        if db is None:

            return {
                "success": False,
                "message": "Database object is None"
            }

        return {
            "success": True,
            "message": "Database object loaded successfully"
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ============================================================
# COURSES TEST
# ============================================================

@app.get("/test-courses")
def test_courses():

    try:

        from app.config.database import db

        courses = db["courses"].find()

        return {
            "success": True,
            "count": len(courses),
            "courses": courses
        }

    except Exception as e:

        return {
            "success": False,
            "message": str(e)
        }


# ============================================================
# DEBUG ROUTES
# ============================================================

@app.get("/debug-routes")
def debug_routes():

    routes = []

    for route in app.routes:

        path = getattr(
            route,
            "path",
            None
        )

        methods = getattr(
            route,
            "methods",
            None
        )

        name = getattr(
            route,
            "name",
            None
        )

        if path:

            routes.append(
                {
                    "path": path,
                    "methods": (
                        list(methods)
                        if methods
                        else []
                    ),
                    "name": name
                }
            )

    return {
        "success": True,
        "count": len(routes),
        "routes": routes
    }


# ============================================================
# DEBUG UPLOAD
# ============================================================

@app.get("/debug-upload")
def debug_upload():

    try:

        files_count = 0
        sample_files = []

        if os.path.exists(
            UPLOAD_DIR
        ):

            for root, dirs, files in os.walk(
                UPLOAD_DIR
            ):

                files_count += len(files)

                for filename in files:

                    if len(sample_files) < 20:

                        full_path = os.path.join(
                            root,
                            filename
                        )

                        relative_path = os.path.relpath(
                            full_path,
                            UPLOAD_DIR
                        )

                        sample_files.append(
                            relative_path
                        )

        return {
            "success": True,
            "upload_dir": UPLOAD_DIR,
            "exists": os.path.exists(
                UPLOAD_DIR
            ),
            "files_count": files_count,
            "sample_files": sample_files
        }

    except Exception as e:

        return {
            "success": False,
            "upload_dir": UPLOAD_DIR,
            "exists": os.path.exists(
                UPLOAD_DIR
            ),
            "message": str(e)
        }


# ============================================================
# FINAL ROUTE DEBUG
# ============================================================

print("")
print("============================================================")
print("FINAL FASTAPI ROUTES")
print("============================================================")

for route in app.routes:

    print(
        getattr(
            route,
            "path",
            None
        ),
        getattr(
            route,
            "methods",
            None
        )
    )

print("============================================================")
print("FASTAPI APP LOADED SUCCESSFULLY")
print("============================================================")
print("")

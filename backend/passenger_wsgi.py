import os
import sys
import mimetypes
BASE_DIR=os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0,BASE_DIR)
UPLOAD_DIRS=[
    os.path.abspath(os.path.join(BASE_DIR,"uploads")),
    os.path.abspath(os.path.join(BASE_DIR,"app","uploads"))
]
from app.main import app as fastapi_app
from a2wsgi import ASGIMiddleware
fastapi_wsgi_app=ASGIMiddleware(fastapi_app)
def application(environ,start_response):
    path_info=environ.get("PATH_INFO","") or ""
    request_uri=environ.get("REQUEST_URI","") or ""
    request_path=request_uri.split("?",1)[0]
    path=path_info or request_path
    if path.startswith("/api/uploads/"):
        relative_path=path[len("/api/uploads/"):]
    elif path.startswith("/uploads/"):
        relative_path=path[len("/uploads/"):]
    else:
        relative_path=None
    if relative_path is not None:
        relative_path=relative_path.replace("\\","/")
        while relative_path.startswith("/"):
            relative_path=relative_path[1:]
        if ".." in relative_path.split("/"):
            start_response("403 Forbidden",[("Content-Type","text/plain; charset=utf-8"),("Content-Length","9")])
            return [b"Forbidden"]
        requested_file=None
        for upload_dir in UPLOAD_DIRS:
            upload_root=os.path.realpath(upload_dir)
            candidate=os.path.realpath(os.path.join(upload_root,relative_path))
            if candidate.startswith(upload_root+os.sep) and os.path.isfile(candidate):
                requested_file=candidate
                break
        if requested_file:
            content_type,_=mimetypes.guess_type(requested_file)
            if not content_type:
                content_type="application/octet-stream"
            try:
                file_size=os.path.getsize(requested_file)
                start_response("200 OK",[("Content-Type",content_type),("Content-Length",str(file_size)),("Cache-Control","public, max-age=86400"),("Access-Control-Allow-Origin","*")])
                def file_iterator():
                    with open(requested_file,"rb") as file:
                        while True:
                            chunk=file.read(1024*1024)
                            if not chunk:
                                break
                            yield chunk
                return file_iterator()
            except Exception as error:
                print("UPLOAD FILE ERROR:",repr(error),flush=True)
                start_response("500 Internal Server Error",[("Content-Type","text/plain; charset=utf-8")])
                return [b"Internal Server Error"]
        print("UPLOAD FILE NOT FOUND:",relative_path,flush=True)
        start_response("404 Not Found",[("Content-Type","application/json; charset=utf-8"),("Content-Length","22")])
        return [b'{"detail":"Not Found"}']
    return fastapi_wsgi_app(environ,start_response)
print("PASSENGER WSGI LOADED",flush=True)
print("BASE DIR:",BASE_DIR,flush=True)
print("UPLOAD DIRS:",UPLOAD_DIRS,flush=True)
for upload_dir in UPLOAD_DIRS:
    print("UPLOAD DIR EXISTS:",upload_dir,os.path.isdir(upload_dir),flush=True)
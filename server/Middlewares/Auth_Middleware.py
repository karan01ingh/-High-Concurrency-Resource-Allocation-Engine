import os
import re
import jwt

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


# APIs accessible without authentication
PUBLIC_ROUTES = {
    ("POST", "/users/signup"),
    ("POST", "/users/signin"),
    ("POST", "/events/"),
    ("GET", "/events/{event_id}"),
}


# Role-based permissions
ROLE_PERMISSIONS = {
    "user": [
        ("GET", r"/users/\d+"),
        ("PATCH", r"/users/\d+"),
        ("POST", r"/bookings/\d+/\d+"),
        ("DELETE", r"/bookings/\d+/\d+"),
    ],

    "organizer": [
        ("GET", r"/users/\d+"),
        ("PATCH", r"/users/\d+"),
        ("POST", r"/users/all"),
        ("POST", r"/events/all_events/\d+"),
        ("POST", r"/events/create-event/\d+"),
        ("PUT", r"/events/\d+"),
    ],
}


class AuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        path = request.url.path
        method = request.method

        # Allow CORS preflight requests
        if method == "OPTIONS":
            return await call_next(request)

        # Allow public routes
        if (method, path) in PUBLIC_ROUTES:
            return await call_next(request)

        # Get Authorization header
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"message": "Authorization token missing"}
            )

        token = auth_header.split(" ", 1)[1]

        try:
            payload = jwt.decode(
                token,
                SECRET_KEY,
                algorithms=[ALGORITHM]
            )

            user_id = int(payload["sub"])
            role = payload["role"]

            if role not in ("user", "organizer"):
                return JSONResponse(
                    status_code=403,
                    content={"message": "Invalid user role"}
                )

            request.state.user = {
                "userid": user_id,
                "role": role
            }

        except jwt.ExpiredSignatureError:
            return JSONResponse(
                status_code=401,
                content={"message": "Access token expired"}
            )

        except (jwt.InvalidTokenError, KeyError, ValueError):
            return JSONResponse(
                status_code=401,
                content={"message": "Invalid access token"}
            )

        # Check role permissions
        allowed = any(
            method == allowed_method and re.fullmatch(pattern, path)
            for allowed_method, pattern in ROLE_PERMISSIONS[role]
        )

        if not allowed:
            return JSONResponse(
                status_code=403,
                content={
                    "message": "You don't have permission to access this resource"
                }
            )

        return await call_next(request)
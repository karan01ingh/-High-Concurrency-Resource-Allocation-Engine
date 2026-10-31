import os
import jwt

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


class AuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        # Routes that don't require authentication
        public_routes = {
            "/users/signup",
            "/users/signin",
            "/openapi.json",
            "/redoc",
            "/docs",
        }

        # Skip authentication for public routes and CORS preflight
        if request.method == "OPTIONS" or request.url.path in public_routes:
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

            request.state.user = {
                "userid": int(payload["sub"]),
                "role": payload["role"]
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

        return await call_next(request)
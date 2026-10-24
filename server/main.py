from DB.dbConnection import pool
from contextlib import asynccontextmanager
from fastapi import FastAPI
from Routes import booking_routes,event_routes,user_routes
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app):
    await pool.open()
    yield
    await pool.close()
print("FastAPI app started")
app=FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("FastAPI app created")

app.include_router(user_routes.router,prefix="/users")
# app.include_router(refund_routes.router,prefix="/refunds")
app.include_router(booking_routes.router,prefix="/bookings")
app.include_router(event_routes.router,prefix="/events")
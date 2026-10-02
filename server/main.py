from DB.dbConnection import pool
from contextlib import asynccontextmanager
from fastapi import FastAPI
from Routes import booking_routes,event_routes,payment_routes,refund_routes,user_routes

@asynccontextmanager
async def lifespan(app):
    await pool.open()
    yield
    await pool.close()
print("FastAPI app started")
app=FastAPI(lifespan=lifespan)
print("FastAPI app created")

app.include_router(user_routes.router,prefix="/users")
app.include_router(refund_routes.router,prefix="/refunds")
app.include_router(payment_routes.router,prefix="/payments")
app.include_router(booking_routes.router,prefix="/bookings")
app.include_router(event_routes.router,prefix="/events")
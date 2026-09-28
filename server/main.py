from fastapi import FastAPI
from DB.db import DB   
from custom_response.custom_response import custom_response
from Routes import booking_routes,event_routes,payment_routes,refund_routes,user_routes
print("FastAPI app started")
app=FastAPI()
print("FastAPI app created")

app.include_router(user_routes.router,prefix="/users")
app.include_router(refund_routes.router,prefix="/refunds")
app.include_router(payment_routes.router,prefix="/payments")
app.include_router(booking_routes.router,prefix="/bookings")
app.include_router(event_routes.router,prefix="/events")
from .payment_service import create_payment_service
from custom_response.custom_response import custom_response
import traceback
from DB.db import DB

db=DB()

def cancel_booking_service(user_id,event_id,booking_id,body):
    
    print("cancelling booking with booking id:",booking_id," user id:",user_id," event id:",event_id)
    return {"message":"cancelling bookings"}

async def create_booking_service(user_id,event_id,booking_data):
    try:
        booking_count=booking_data.get("booking_count")
        idempotency_key=booking_data.get("idempotency_key")
        amount=booking_data.get("amount")
        event_to=booking_data.get("event_to")
        
        if not event_to or not amount or not idempotency_key:
            return custom_response(
                status_code=400,
                message="Missing mandatory fields",
                additional_response={
                    "data":None,
                    "message":"Please provide all required fields"
                }
            )
        async with db.transaction() as connection:
            payment=await create_payment_service(user_id,event_id,event_to,idempotency_key,amount)
    except Exception as e:
        print("error:",str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Internal server error in the booking service",
            additional_response={
                "data":None,
                "message":"Try after some time"
            }
        )
        
    
    
    
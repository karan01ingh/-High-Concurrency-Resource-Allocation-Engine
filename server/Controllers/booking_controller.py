from Services.booking_service import create_booking_service,cancel_booking_service
from fastapi import Request
async def create_booking(request:Request,user_id:int,event_id:int,booking_data:dict):
    body = await request.json()
    return await create_booking_service(user_id,event_id,body)

def cancel_booking(user_id:int,event_id:int,booking_id:int):
    return cancel_booking_service(user_id,event_id,booking_id)
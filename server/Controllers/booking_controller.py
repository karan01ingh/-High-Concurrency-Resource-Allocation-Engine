from Services.booking_service import create_booking_service,cancel_booking_service
from fastapi import Request
async def create_booking(request:Request,user_id:int,event_id:int):
    body = await request.json()
    return await create_booking_service(user_id,event_id,body)

async def cancel_booking(user_id:int,booking_id:int):
    return await cancel_booking_service(user_id,booking_id)
from fastapi import APIRouter,Request
from Controllers.booking_controller import create_booking,cancel_booking
router=APIRouter()

@router.post("/{user_id}/{event_id}")
async def create_booking_route(request:Request,user_id:int,event_id:int):
    return await create_booking(request,user_id,event_id)

@router.delete("/{user_id}/{booking_id}")
async def cancel_booking_route(user_id:int,booking_id:int):
    return await cancel_booking(user_id,booking_id)
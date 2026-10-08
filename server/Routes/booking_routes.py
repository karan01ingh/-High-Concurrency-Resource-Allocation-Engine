from fastapi import APIRouter,Request
from Controllers.booking_controller import create_booking,cancel_booking
router=APIRouter()

@router.post("/{user_id}/{event_id}")
def create_booking_route(request:Request,user_id:int,event_id:int,booking_data:dict):
    return create_booking(request,user_id,event_id,booking_data)

@router.delete("/{user_id}/{event_id}/{booking_id}")
def cancel_booking_route(user_id:int,event_id:int,booking_id:int):
    return cancel_booking(user_id,event_id,booking_id)
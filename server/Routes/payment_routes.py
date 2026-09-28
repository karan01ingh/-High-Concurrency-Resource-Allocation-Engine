from fastapi import APIRouter
from Controllers.payment_controller import create_payment
router=APIRouter()

@router.post("/{user_id}/{event_id}")
def create_payment_route(user_id:int,event_id:int):
    return create_payment(user_id,event_id)

from fastapi import APIRouter
from Controllers.refund_controller import create_refund
router=APIRouter()

@router.post("/{payment_id}")
def create_booking_route(payment_id:int):
    return create_refund(payment_id)
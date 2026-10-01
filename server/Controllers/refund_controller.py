from Services.refund_service import create_refund_service

def create_refund(payment_id:int):
    return create_refund_service(payment_id)
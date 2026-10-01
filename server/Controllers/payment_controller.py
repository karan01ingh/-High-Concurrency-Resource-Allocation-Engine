from Services.payment_service import create_payment_service
def create_payment(user_id,event_id):
    return create_payment_service(user_id,event_id)
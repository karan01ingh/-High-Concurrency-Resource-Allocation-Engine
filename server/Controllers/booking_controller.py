from Services.booking_service import create_booking_service,cancel_booking_service

def create_booking(user_id:int,event_id:int,booking_data:dict):
    return create_booking_service(user_id,event_id,booking_data)

def cancel_booking(user_id:int,event_id:int,booking_id:int):
    return cancel_booking_service(user_id,event_id,booking_id)
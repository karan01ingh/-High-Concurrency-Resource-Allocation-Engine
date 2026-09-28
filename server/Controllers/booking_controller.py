def create_booking(user_id:int,event_id:int,booking_data:dict):
    print("creating booking with user id:",user_id," event id:",event_id," dict:",dict)
    return {"message":"creating bookings"}

def cancel_booking(user_id:int,event_id:int,booking_id:int):
    print("booking cancelling")
    return {"message":"cancelling bookings"}
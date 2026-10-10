from .payment_service import create_payment_service
from custom_response.custom_response import custom_response
import traceback
from DB.db import DB
from Redis.redis_client import reserve_tickets,release_tickets,redis_client

db=DB()

def cancel_booking_service(user_id,event_id,booking_id,body):
    
    print("cancelling booking with booking id:",booking_id," user id:",user_id," event id:",event_id)
    return {"message":"cancelling bookings"}

async def create_booking_service(user_id,event_id,booking_data):
    try:
        booking_count=booking_data.get("booking_count")
        idempotency_key=booking_data.get("idempotency_key")
        amount=booking_data.get("amount")
        event_to=booking_data.get("event_to")
        
        if not event_to or not amount or not idempotency_key:
            return custom_response(
                status_code=400,
                message="Missing mandatory fields",
                additional_response={
                    "data":None,
                    "message":"Please provide all required fields"
                }
            )
        if (not isinstance(booking_count, int) or isinstance(booking_count, bool) or not 1 <= booking_count <= 5):
            return custom_response(
                status_code=400,
                message="booking_count must be between 1 and 5",
                additional_response={"data": None,"message":"booking_count must be between 1 and 5"}
            )
        reservation = await reserve_tickets(event_id, booking_count)
        # ṇeed to improvise
        if reservation == -1:
            lock = redis_client.lock(
                f"event:{event_id}:inventory_lock",
                timeout=10,
                blocking_timeout=5
            )

            acquired = await lock.acquire()

            if not acquired:
                raise Exception("Inventory recovery is busy")

            try:
                key = f"event:{event_id}:tickets_left"

                # Recheck after acquiring the lock
                if not await redis_client.exists(key):
                    async with db.transaction() as connection:
                        async with connection.cursor() as cursor:
                            await cursor.execute(
                                """
                                SELECT event_capacity, event_ticket_sold
                                FROM events
                                WHERE eventid = %s
                                """,
                                (event_id,)
                            )
                            event = await cursor.fetchone()

                    if event is None:
                        raise Exception("Event not found")

                    tickets_left = event[0] - event[1]

                    await redis_client.set(
                        key,
                        tickets_left,
                        ex=86400,
                        nx=True
                    )
                    

            finally:
                await lock.release()
            reservation = await reserve_tickets(event_id, booking_count)
        if reservation == 0:
            raise Exception("Not Enough Tickets")
        try:
            async with db.transaction() as connection:
                payment=await create_payment_service(user_id,event_id,event_to,idempotency_key,amount,connection)
                if not payment["success"]:
                    raise Exception(payment["message"])
                base_query="INSERT INTO booking (eventid,userid,paymentid,booking_count) values (%s,%s,%s,%s) RETURNING bookingid"
                params=(event_id,user_id,payment["data"],booking_count)
                result = None
                async with connection.cursor() as cursor:
                    await cursor.execute(base_query, params)
                    result = await cursor.fetchone()
                if not result:
                    raise Exception("Booking not done")
                count_update_query="UPDATE events SET event_ticket_sold = event_ticket_sold + %s WHERE eventid = %s AND event_ticket_sold + %s <= event_capacity RETURNING event_ticket_sold;"
                params = (booking_count, event_id, booking_count)
                event_ticket_sold=None
                async with connection.cursor() as cursor:
                    await cursor.execute(count_update_query, params)
                    event_ticket_sold = await cursor.fetchone()
                if not event_ticket_sold:
                    raise Exception("event ticket sold not updated")
                return custom_response(
                    status_code=201,
                    message="Booking Succcesfully",
                    additional_response={
                        "data":result[0]
                    }
                )
        except Exception:
            await release_tickets(event_id, booking_count)
            raise
        
    except Exception as e:
        print("error:",str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message=str(e),
            additional_response={
                "data":None,
                "message":str(e)
            }
        )
        
    
    
    
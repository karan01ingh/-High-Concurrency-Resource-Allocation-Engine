from .payment_service import create_payment_service
from custom_response.custom_response import custom_response
import traceback
from DB.db import DB
from decimal import Decimal
from datetime import date 
from Redis.redis_client import reserve_tickets, release_tickets, redis_client

db = DB()


async def cancel_booking_service(user_id, booking_id):
    event_id = None
    booking_count = None
    print("service is printed")
    try:
        async with db.transaction() as connection:
            async with connection.cursor() as cursor:

                # 1. Fetch booking and event details
                await cursor.execute(
                    """
                    SELECT b.eventid,
                           b.booking_count,
                           e.event_date,
                           e.event_ticket_price,
                           b.paymentid
                    FROM booking b
                    JOIN events e ON e.eventid = b.eventid
                    WHERE b.bookingid = %s
                      AND b.userid = %s
                    FOR UPDATE OF b, e
                    """,
                    (booking_id, user_id)
                )

                booking = await cursor.fetchone()

                if not booking:
                    raise Exception("Booking not found")

                event_id, booking_count, event_date, ticket_price, payment_id = booking

                # 2. Allow cancellation only before the event date
                if date.today() >= event_date:
                    raise Exception(
                        "Booking cannot be cancelled on or after the event date"
                    )

                # 3. Restore tickets in PostgreSQL
                await cursor.execute(
                    """
                    UPDATE events
                    SET event_ticket_sold = event_ticket_sold - %s
                    WHERE eventid = %s
                      AND event_ticket_sold >= %s
                    RETURNING eventid
                    """,
                    (booking_count, event_id, booking_count)
                )

                if not await cursor.fetchone():
                    raise Exception("Unable to restore event ticket count")

                # 4. Refund the user's wallet
                refund_amount = ticket_price * booking_count

                await cursor.execute(
                    """
                    UPDATE users
                    SET money_left = money_left + %s
                    WHERE userid = %s
                    RETURNING userid
                    """,
                    (refund_amount, user_id)
                )

                if not await cursor.fetchone():
                    raise Exception("Unable to refund user")

                # 5. Delete the booking
                await cursor.execute(
                    """
                    DELETE FROM booking
                    WHERE bookingid = %s
                      AND userid = %s
                    RETURNING bookingid
                    """,
                    (booking_id, user_id)
                )

                if not await cursor.fetchone():
                    raise Exception("Booking cancellation failed")
                
                # Delete Payment
                await cursor.execute("""
                    DELETE FROM payments
                    WHERE paymentid=%s
                    RETURNING paymentid
                """,(payment_id,))
                if not await cursor.fetchone():
                    raise Exception("Payment Deletion failed")

        # PostgreSQL transaction has committed successfully here.

        # 6. Restore Redis inventory only after the DB commit
        key = f"event:{event_id}:tickets_left"
        if await redis_client.exists(key):
            await redis_client.incrby(key, booking_count)

        return {
            "success": True,
            "message": "Booking cancelled successfully",
            "refund_amount": str(refund_amount),
        }

    except Exception as e:
        print("error:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message=str(e),
            additional_response={"data": None, "message": str(e)},
        )


async def create_booking_service(user_id, event_id, booking_data):
    try:
        booking_count = booking_data.get("booking_count")
        idempotency_key = booking_data.get("idempotency_key")
        amount = booking_data.get("amount")
        event_to = booking_data.get("event_to")

        reservation = await reserve_tickets(event_id, booking_count)
        # ṇeed to improvise
        if reservation == -1 or not await redis_client.get(
            f"event:{event_id}:ticket_price"
        ):
            print("key is missing")
            lock = redis_client.lock(
                f"event:{event_id}:inventory_lock", timeout=10, blocking_timeout=5
            )

            acquired = await lock.acquire()

            if not acquired:
                raise Exception("Inventory recovery is busy")

            try:
                key1 = f"event:{event_id}:tickets_left"
                key2 = f"event:{event_id}:ticket_price"

                # Recheck after acquiring the lock
                if not await redis_client.exists(key1) or not await redis_client.exists(
                    key2
                ):
                    async with db.transaction() as connection:
                        async with connection.cursor() as cursor:
                            await cursor.execute(
                                """
                                SELECT event_capacity, event_ticket_sold,event_ticket_price
                                FROM events
                                WHERE eventid = %s
                                """,
                                (event_id,),
                            )
                            event = await cursor.fetchone()

                    if event is None:
                        raise Exception("Event not found")

                    tickets_left = event[0] - event[1]
                    event_ticket_price = event[2]
                    await redis_client.set(key1, tickets_left, ex=86400)
                    await redis_client.set(key2, str(event_ticket_price), ex=86400)
            finally:
                await lock.release()
            reservation = await reserve_tickets(event_id, booking_count)

        if reservation == 0:
            raise Exception("Not Enough Tickets")

        if not event_to or not amount or not idempotency_key:
            return custom_response(
                status_code=400,
                message="Missing mandatory fields",
                additional_response={
                    "data": None,
                    "message": "Please provide all required fields",
                },
            )
        try:
            ticket_price = await redis_client.get(f"event:{event_id}:ticket_price")
            if ticket_price is None:
                raise Exception("Event ticket price not found in Redis")

            expected_amount = Decimal(ticket_price) * booking_count
            print("expected amount:", expected_amount)
            print("amount:", amount)
            if Decimal(amount) != expected_amount:
                raise Exception("Invalid Booking amount")
        except Exception:
            await release_tickets(event_id, booking_count)
            raise

        if (
            not isinstance(booking_count, int)
            or isinstance(booking_count, bool)
            or not 1 <= booking_count <= 5
        ):
            return custom_response(
                status_code=400,
                message="booking_count must be between 1 and 5",
                additional_response={
                    "data": None,
                    "message": "booking_count must be between 1 and 5",
                },
            )
        try:
            print("payment is called")
            async with db.transaction() as connection:
                async with connection.cursor() as cursor:
                    await cursor.execute(
                        """
                        UPDATE users
                        SET money_left = money_left - %s
                        WHERE userid = %s
                        AND money_left >= %s
                        RETURNING money_left
                        """,
                        (amount, user_id, amount)
                    )

                    result = await cursor.fetchone()

                    if not result:
                        raise Exception("Insufficient wallet balance")
                payment = await create_payment_service(
                    user_id, event_id, event_to, idempotency_key, amount, connection
                )
                if not payment["success"]:
                    raise Exception(payment["message"])
                base_query = "INSERT INTO booking (eventid,userid,paymentid,booking_count) values (%s,%s,%s,%s) RETURNING bookingid"
                params = (event_id, user_id, payment["data"], booking_count)
                result = None
                async with connection.cursor() as cursor:
                    await cursor.execute(base_query, params)
                    result = await cursor.fetchone()
                if not result:
                    raise Exception("Booking not done")
                count_update_query = "UPDATE events SET event_ticket_sold = event_ticket_sold + %s WHERE eventid = %s AND event_ticket_sold + %s <= event_capacity RETURNING event_ticket_sold;"
                params = (booking_count, event_id, booking_count)
                event_ticket_sold = None
                async with connection.cursor() as cursor:
                    await cursor.execute(count_update_query, params)
                    event_ticket_sold = await cursor.fetchone()
                if not event_ticket_sold:
                    raise Exception("event ticket sold not updated")
                return custom_response(
                    status_code=201,
                    message="Booking Succcesfully",
                    additional_response={"data": result[0]},
                )
        except Exception:
            await release_tickets(event_id, booking_count)
            raise

    except Exception as e:
        print("error:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message=str(e),
            additional_response={"data": None, "message": str(e)},
        )
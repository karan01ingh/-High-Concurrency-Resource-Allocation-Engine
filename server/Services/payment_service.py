import traceback
import psycopg
async def create_payment_service(user_id,event_id,event_name,idempotency_key,amount,connection):
    try:
        if not user_id or not event_id or not event_name or not idempotency_key or not amount:
            return {
                "message":"Mandatory fields are missing",
                "data":None,
                "success":False
            }
        base_query="INSERT INTO payments (eventid,from_user,amount,event_to,idempotency_key) values (%s,%s,%s,%s,%s) RETURNING paymentid"
        params=(event_id,user_id,amount,event_name,idempotency_key)
        async with connection.cursor() as cursor:
            await cursor.execute(base_query, params)
            result = await cursor.fetchone()
        if result:
            return {"data":result[0],"message":"Successfully created a payment","success":True}
        return {"data":None,"message":"payment is not created","success":False}
    except psycopg.errors.UniqueViolation:
        return {
            "message":"Payment already exists for this idempotency key",
            "data":"",
            "success":False
        }
    except Exception as e:
        print("error in payment",str(e))
        traceback.print_exc()
        return {
            "message":"Internal Server In payment_service",
            "data":None,
            "success":False
        }
    
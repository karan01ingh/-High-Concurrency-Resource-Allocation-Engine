from custom_response.custom_response import custom_response
import traceback
from DB.db import DB
from datetime import date,datetime

db = DB()


async def get_event_by_event_id_service(event_id):
    try:
        base_query = f"SELECT * FROM events WHERE eventid = %s"
        params = (event_id,)
        result = await db.get_one(base_query, params)
        if result is None:
            return custom_response(
                status_code=404,
                message="Event not found",
                additional_response={"error": f"No event found with id: {event_id}"},
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched event",
            additional_response={"data": result},
        )
    except Exception as e:
        print("Error in get_event_by_event_id_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_event_by_event_id_service",
            additional_response={"error": str(e)},
        )

# need to use a idempotency key here also 
async def create_event_service(user_id, event_data):
    try:
        print("in service")
        if not event_data:
            return custom_response(
                status_code=404, message="Event data is missing", additional_response={"error":"Please provide event data"}
            )
        if not event_data.get("event_date") or not event_data.get("event_time") or not event_data.get("event_name") or not event_data.get("event_capacity") or not event_data.get("event_ticket_price") or not event_data.get("event_place") or not event_data.get("event_description"):
            return custom_response(
                status_code=404, message="Mandatory data is missing", additional_response={"error":"Please provide all the data fields"}
            )
        try:
            event_date = datetime.strptime(
                event_data.get("event_date"),
                "%Y-%m-%d"
            ).date()
            if event_date<date.today():
                return custom_response(
                    status_code=404, message="Invaid event date", additional_response={"error":"Please provide valid date"}
                )
        except ValueError:
            return custom_response(
                status_code=400,
                message="Invalid event date",
                additional_response={
                    "error": "Event date must be in YYYY-MM-DD format"
                }
            )
            
        try:
            event_time = datetime.strptime(
                event_data.get("event_time"),
                "%H:%M"
            ).time()
        except ValueError:
            return custom_response(
                status_code=400,
                message="Invalid event time",
                additional_response={
                    "error": "Event time must be in HH:MM format format"
                }
            )
        if len(event_data.get("event_name"))>200:
            return custom_response(
                status_code=400,
                message="Description should be maximum 200 characters",
                additional_response={
                    "error": "please prvide description max 200 characters"
                }
            )
        
        base_query="INSERT INTO events (event_date,event_time,event_name,event_description,event_capacity,event_ticket_price,event_place,event_created_by) values (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING *"
        params=(event_date,event_time,event_data.get("event_name"),event_data.get("event_description"),event_data.get("event_capacity"),event_data.get("event_ticket_price"),event_data.get("event_place"),user_id)
        results =await db.modify(base_query,params)
        if not results:
            return custom_response(
                status_code=400,
                message="Event not created ! try after sometime",
                additional_response={"Error":"Please try after sometime"}
            )
        return custom_response(
            status_code=400,
            message="Event created successfully",
            additional_response={"Error":"Event created successfully",
                                 "data":results
            }
        )
    except Exception as e:
        print("Error in create_event_service", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in creating a event",
            additional_response={"Error": str(e)},
        )


async def update_event_service(event_id, event_data):
    try:
        if not event_data:
            return custom_response(
                status_code=404,
                message="NO data is founud to update",
                additional_response={},
            )
        if (
            not event_data.get("event_name")
            or not event_data.get("description")
            or not event_data.get("event_date")
            or not event_data.get("event_time")
        ):
            return custom_response(
                status_code=404,
                message="Missing requred fields",
                additional_response={},
            )
        base_query = f"UPDATE events set event_name=%s ,event_description=%s,event_time=%s,event_date=%s where eventid=%s RETURNING eventid"
        params = (
            event_data.get("event_name"),
            event_data.get("description"),
            event_data.get("event_time"),
            event_data.get("event_date"),
            event_id,
        )
        result = await db.modify(base_query, params)
        if not result:
            return custom_response(
                status_code=404, message="Event id dont exist", additional_response={}
            )
        return custom_response(
            status_code=200,
            message="Event updated successfully",
            additional_response={},
        )
    except Exception as e:
        print("Error in get_event_by_event_id_service:", str(e))
        return custom_response(
            status_code=400,
            message="Error in update_event_service",
            additional_response={"error": str(e)},
        )


def delete_event_service(event_id):
    return {"message": f"deleting event with id: {event_id}"}


async def get_all_events_service(
    user_id, search_value, filter_value, order_col, order_col_dir, limit, offset
):
    try:
        where = []
        if search_value:
            where.append(f"""(
                CAST(eventid AS TEXT) ILIKE '%{search_value}%' OR 
                CAST(created_at AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_time AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_name AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_date AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_capacity AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_price AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_sold AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_place AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_description AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_created_by AS TEXT) ILIKE '%{search_value}%'  
            )""")

        to_date = (
            date(3000, 1, 1)
            if not filter_value.get("to_date")
            else filter_value.get("to_date")
        )
        from_date = (
            date(1970, 1, 1)
            if not filter_value.get("from_date")
            else filter_value.get("from_date")
        )
        to_price = (
            99999999
            if not filter_value.get("to_price")
            else filter_value.get("to_price")
        )
        from_price = (
            0 if not filter_value.get("from_price") else filter_value.get("from_price")
        )

        where.append(f" event_date BETWEEN '{from_date}' AND '{to_date}'")
        where.append(f" event_ticket_price BETWEEN {from_price} AND {to_price}")
        where.append(f" event_created_by = {user_id}")
        where_str = f" WHERE {' AND '.join(where)}" if where else ""

        order_str = (
            " ORDER BY event_date DESC "
            if not order_col or not order_col_dir
            else f"ORDER BY {order_col} {order_col_dir}"
        )

        base_query = f"SELECT CAST(eventid AS TEXT) as eventid,event_date,to_char(event_time, 'HH12:MIAM' ) as event_time,event_name,CAST(event_capacity AS TEXT) as event_capacity,CAST(event_ticket_price AS TEXT) as event_ticket_price,event_place,event_description,CAST(event_created_by AS TEXT) as event_created_by  FROM events {where_str} {order_str} LIMIT %s OFFSET %s "
        params = (limit, offset)
        results = await db.get_many(base_query, params)
        if not results:
            return custom_response(
                status_code=404, message="No event found", additional_response={}
            )
        return custom_response(
            status_code=201,
            message="Succesfully get the events",
            additional_response={"data": results},
        )
    except Exception as e:
        print("Error in get_event_by_event_id_service:", str(e))
        return custom_response(
            status_code=400,
            message="Error in get_all_events_services",
            additional_response={},
        )


async def get_events_service(
    search_value, filter_value, order_col, order_col_dir, limit, offset
):
    try:
        where = []
        if search_value:
            where.append(f"""(
                CAST(eventid AS TEXT) ILIKE '%{search_value}%' OR 
                CAST(created_at AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_time AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_name AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_date AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_capacity AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_price AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_ticket_sold AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_place AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_description AS TEXT) ILIKE '%{search_value}%' OR
                CAST(event_created_by AS TEXT) ILIKE '%{search_value}%'  
            )""")

        order_str = (
            f"ORDER BY {order_col} {order_col_dir}"
            if order_col
            and order_col_dir
            and order_col_dir.upper() in ["ASC", "DESC"]
            and order_col.lower()
            in [
                "eventid",
                "created_at",
                "event_time",
                "event_name",
                "event_date",
                "event_capacity",
                "event_ticket_price",
                "event_ticket_sold",
                "event_place",
                "event_description",
                "event_created_by",
            ]
            else "ORDER BY event_date DESC"
        )
        _to_date = (
            date(3000, 1, 1)
            if not filter_value.get("to_date")
            else filter_value.get("to_date")
        )
        _from_date = (
            date(1970, 1, 1)
            if not filter_value.get("from_date")
            else filter_value.get("from_date")
        )
        _to_price = (
            9999999999
            if not filter_value.get("to_price")
            else filter_value.get("to_price")
        )
        _from_price = (
            0 if not filter_value.get("from_price") else filter_value.get("from_price")
        )
        where.append(f" event_date BETWEEN '{_from_date}' AND '{_to_date}' ")
        where.append(f" event_ticket_price BETWEEN '{_from_price}' AND '{_to_price}' ")
        where_str = f" WHERE {' AND '.join(where)} " if where else ""

        total_row_query = f"SELECT COUNT(*) from events {where_str}"
        total_rows = await db.get_many(total_row_query, None)
        print("total_count:", total_rows)

        base_query = f"SELECT CAST(eventid AS TEXT) as eventid,event_date,to_char(event_time, 'HH12:MIAM' ) as event_time,event_name,CAST(event_capacity AS TEXT) as event_capacity,CAST(event_ticket_price AS TEXT) as event_ticket_price,event_place,event_description,CAST(event_created_by AS TEXT) as event_created_by  FROM events {where_str} {order_str} LIMIT {limit} OFFSET {offset} "

        result = await db.get_many(base_query, None)
        print("results", result)

        if result is None or len(result) == 0:
            return custom_response(
                status_code=404,
                message="No events found",
                additional_response={"error": "No events found in the database"},
            )
        return custom_response(
            status_code=200,
            message="Successfully fetched events",
            additional_response={
                "data": result,
                "total_count": total_rows[0][0] if total_rows else 0,
            },
        )
    except Exception as e:
        print("Error in get_events_service:", str(e))
        traceback.print_exc()
        return custom_response(
            status_code=400,
            message="Error in get_events_service",
            additional_response={"error": str(e)},
        )

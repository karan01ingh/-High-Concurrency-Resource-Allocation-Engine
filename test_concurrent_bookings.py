
import asyncio
import uuid
from collections import Counter

import httpx

URL = "http://127.0.0.1:8000/bookings/1356721/100000013"
TOTAL_REQUESTS = 100
TICKET_PRICE = 499


async def send_booking(client, request_number):
    payload = {
        "booking_count": 1,
        "amount": TICKET_PRICE,
        "idempotency_key": f"concurrency-test-{uuid.uuid4()}",
        "event_to": "Meetup",
    }

    try:
        response = await client.post(URL, json=payload)

        try:
            body = response.json()
        except ValueError:
            body = response.text

        return {
            "request": request_number,
            "status": response.status_code,
            "body": body,
        }

    except Exception as exc:
        return {
            "request": request_number,
            "status": "ERROR",
            "body": str(exc),
        }


async def main():
    limits = httpx.Limits(
        max_connections=TOTAL_REQUESTS,
        max_keepalive_connections=TOTAL_REQUESTS,
    )

    timeout = httpx.Timeout(60.0)

    async with httpx.AsyncClient(
        limits=limits,
        timeout=timeout,
    ) as client:
        results = await asyncio.gather(
            *[
                send_booking(client, i)
                for i in range(1, TOTAL_REQUESTS + 1)
            ]
        )

    status_counts = Counter(str(r["status"]) for r in results)

    print("\n--- CONCURRENCY TEST RESULTS ---")
    print("Total requests:", len(results))
    print("HTTP status counts:", dict(status_counts))

    successful = [
        r for r in results
        if r["status"] == 201
    ]

    print("Successful bookings:", len(successful))
    print("Other responses:", len(results) - len(successful))

    print("\n--- NON-SUCCESS RESPONSES ---")
    for result in results:
        if result["status"] != 201:
            print(
                f'Request {result["request"]}: '
                f'Status={result["status"]}, '
                f'Response={result["body"]}'
            )


if __name__ == "__main__":
    asyncio.run(main())

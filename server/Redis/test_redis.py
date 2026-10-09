import asyncio
from redis_client import redis_client

async def main():
    try:
        response = await redis_client.ping()
        print("Redis connected:", response)
    except Exception as e:
        print("Redis connection failed:", e)
    finally:
        await redis_client.aclose()

asyncio.run(main())
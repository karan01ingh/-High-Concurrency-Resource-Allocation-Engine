import redis.asyncio as redis

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    decode_responses=True
)

async def reserve_tickets(event_id, booking_count):
    lua_script = """
    local tickets_left = redis.call('GET', KEYS[1])

    if not tickets_left then
        return -1
    end

    tickets_left = tonumber(tickets_left)
    local requested = tonumber(ARGV[1])

    if tickets_left < requested then
        return 0
    end

    redis.call('DECRBY', KEYS[1], requested)
    redis.call('EXPIRE', KEYS[1], 86400)
    return 1
    """

    key = f"event:{event_id}:tickets_left"

    result = await redis_client.eval(
        lua_script,
        1,
        key,
        booking_count
    )
    return result

async def release_tickets(event_id, booking_count):
    key = f"event:{event_id}:tickets_left"

    await redis_client.incrby(key, booking_count)
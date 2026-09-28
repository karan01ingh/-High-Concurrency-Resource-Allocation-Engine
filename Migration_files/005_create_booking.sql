create table booking(
    bookingid integer primary key,
    eventid integer not null references events(eventid),
    userid integer not null references users(userid),
    paymentid integer not null unique references payments(paymentid),
    created_at timestamptz not null default current_timestamp,
    booking_count integer not null default 1
)
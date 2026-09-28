create table payments(
    paymentid integer primary key,
    eventid integer not null references events(eventid),
    from_user integer not null references users(userid),
    created_at timestamptz not null default current_timestamp,
    amount numeric(12,2) not null,
    event_to varchar(20) not null
)
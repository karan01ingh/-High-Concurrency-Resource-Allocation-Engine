create table events(
    eventid integer primary key,
    created_at timestamptz default current_timestamp,
    event_date date not null,
    event_time time not null,
    event_name varchar(20) not null,
    event_capacity integer not null,
    event_ticket_price numeric(10,2) not null,
    event_ticket_sold integer not null default 0,
    event_place varchar(50) not null,
    event_description varchar (200) not null,
    event_created_by integer not null references users(userid),
    event_image varchar(100)
)
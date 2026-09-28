create table users (
    userid  integer primary key,
    username varchar(30) not null,
    role varchar(20) not null 
    check (role in ('admin','user','organizer')),
    email varchar(50) not null unique,
    phonecontact varchar(15) not null unique,
    created_at timestamptz default current_timestamp,
    updated_at timestamptz default current_timestamp
)
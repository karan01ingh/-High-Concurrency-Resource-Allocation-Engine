create table refund(
    refundid integer primary key,
    paymentid integer not null unique references payments(paymentid),
    created_at timestamptz default current_timestamp
)
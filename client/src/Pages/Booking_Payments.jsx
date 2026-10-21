
import { useState } from "react";

const event = {
  title: "Sunburn Festival 2026",
  category: "Music Festival",
  image:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85",
  date: "15 - 17 Feb 2026",
  time: "Fri, 4:00 PM - Sun, 11:00 PM",
  location: "Vagator Beach, Goa, India",
  organizer: "Sunburn Live",
};

const initialAttendee = {
  name: "Karan Singh Manral",
  email: "karanmanral@example.com",
  phone: "+91 98765 43210",
};

const initialTickets = [
  { id: 1, name: "General Pass", description: "Access to all 3 days • Standing", price: 1500, quantity: 2 },
];

const inputClass =
  "w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

function Card({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

function Heading({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight text-slate-900">
        {children}
      </h2>
      {action}
    </div>
  );
}

function Coin({ size = "normal" }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-gradient-to-br from-yellow-300 to-amber-500 font-bold text-white shadow-sm ${
        size === "large" ? "size-10 text-xl" : "size-5 text-[10px]"
      }`}
    >
      $
    </span>
  );
}

export default function BookingPayment() {
  const [attendee, setAttendee] = useState(initialAttendee);
  const [editingAttendee, setEditingAttendee] = useState(false);
  const [tickets, setTickets] = useState(initialTickets);
  const [balance] = useState(3500);
  const [step, setStep] = useState(2);
  const [notice, setNotice] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const ticketTotal = tickets.reduce(
    (sum, ticket) => sum + ticket.price * ticket.quantity,
    0
  );

  const convenienceFee = tickets.length > 0 ? 100 : 0;
  const total = ticketTotal + convenienceFee;
  const remainingBalance = balance - total;
  const totalQuantity = tickets.reduce(
    (sum, ticket) => sum + ticket.quantity,
    0
  );

  function updateAttendee(key, value) {
    setAttendee((current) => ({ ...current, [key]: value }));
  }

  function changeQuantity(id, quantity) {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id
          ? { ...ticket, quantity: Math.min(10, Math.max(1, quantity)) }
          : ticket
      )
    );
  }

  function handleConfirm() {
    if (!attendee.name.trim() || !attendee.email.trim() || !attendee.phone.trim()) {
      setNotice("Please complete all attendee information.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email)) {
      setNotice("Please enter a valid email address.");
      return;
    }

    if (total > balance) {
      setNotice("Your EventCoin balance is insufficient for this booking.");
      return;
    }

    setNotice(
      "UI demo only: connect the booking API to reserve tickets and deduct coins securely."
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setNotice("Connect this action to your event details route.")}
          className="mb-5 text-sm text-slate-500 transition hover:text-emerald-700"
        >
          ← Back to Event Details
        </button>

        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Booking &amp; Payment
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Almost there! Use your EventCoins to confirm your booking.
          </p>
        </div>

        {notice && (
          <div
            role="status"
            className="mb-4 flex items-start justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        {confirmed ? (
          <Card className="mx-auto max-w-xl py-10 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
              ✓
            </div>
            <h2 className="mt-4 text-2xl font-bold">Booking Request Ready</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This is a UI demonstration. No ticket has been reserved and no EventCoins have been deducted.
            </p>
            <button
              type="button"
              onClick={() => setConfirmed(false)}
              className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
            >
              Back to Booking
            </button>
          </Card>
        ) : (
          <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(390px,1fr)]">
            {/* Left column */}
            <div className="min-w-0 space-y-4">
              <Card>
                <Heading>Event Information</Heading>

                <div className="grid gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)]">
                  <div className="relative h-44 overflow-hidden rounded-lg sm:h-40">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                      {event.category}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl font-bold">{event.title}</h3>

                    <div className="mt-3 space-y-3 text-sm">
                      <p className="flex items-start gap-3">
                        <span className="text-xl text-emerald-700">▦</span>
                        <span>
                          {event.date}
                          <span className="mt-1 block text-xs text-slate-500">
                            {event.time}
                          </span>
                        </span>
                      </p>
                      <p className="flex items-start gap-3">
                        <span className="text-xl text-emerald-700">♧</span>
                        <span>{event.location}</span>
                      </p>
                      <p className="flex items-start gap-3 text-slate-500">
                        <span className="text-xl text-emerald-700">♙</span>
                        Organized by {event.organizer}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <Heading
                  action={
                    <button
                      type="button"
                      onClick={() => setEditingAttendee(!editingAttendee)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:border-emerald-600 hover:text-emerald-700"
                    >
                      ✎ {editingAttendee ? "Done" : "Edit"}
                    </button>
                  }
                >
                  Attendee Information
                </Heading>

                <p className="mb-4 text-sm text-slate-500">
                  Please confirm your details. These will be used for ticket confirmation.
                </p>

                {editingAttendee ? (
                  <form
                    className="grid gap-3 sm:grid-cols-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEditingAttendee(false);
                      setNotice("Attendee details updated in this page.");
                    }}
                  >
                    <label className="text-xs font-semibold">
                      Full Name
                      <input
                        required
                        className={`${inputClass} mt-1.5`}
                        value={attendee.name}
                        onChange={(e) => updateAttendee("name", e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-semibold">
                      Email Address
                      <input
                        required
                        type="email"
                        className={`${inputClass} mt-1.5`}
                        value={attendee.email}
                        onChange={(e) => updateAttendee("email", e.target.value)}
                      />
                    </label>
                    <label className="text-xs font-semibold sm:col-span-2">
                      Phone Number
                      <input
                        required
                        className={`${inputClass} mt-1.5`}
                        value={attendee.phone}
                        onChange={(e) => updateAttendee("phone", e.target.value)}
                      />
                    </label>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white sm:col-span-2"
                    >
                      Save Details
                    </button>
                  </form>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ["Full Name", attendee.name, "♙"],
                      ["Email Address", attendee.email, "✉"],
                      ["Phone Number", attendee.phone, "♧"],
                    ].map(([label, value, icon]) => (
                      <div
                        key={label}
                        className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 px-3 py-3"
                      >
                        <span className="text-xl text-slate-500">{icon}</span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-slate-500">{label}</p>
                          <p className="mt-1 break-words text-xs font-medium sm:text-sm">
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <section className="flex flex-wrap items-center gap-4 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-700">
                  ♔
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold text-emerald-800">
                    Welcome Bonus Applied!
                  </h2>
                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    You received 5,000 EventCoins at signup. Use your coins to book events.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-800">
                  <span className="text-3xl">🪙</span>
                  <div>
                    <p className="text-2xl font-bold">5,000</p>
                    <p className="text-sm font-semibold">EventCoins</p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-blue-100 bg-blue-50/40 p-5">
                <h2 className="font-bold">ⓘ Things to Note</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-5 text-slate-500">
                  <li>Tickets are non-refundable, except as per event policy.</li>
                  <li>Your EventCoins will be deducted only after successful booking.</li>
                  <li>You will receive a confirmation email and e-ticket after booking.</li>
                  <li>Each user can book a maximum of 10 tickets per event.</li>
                </ul>
              </section>
            </div>

            {/* Right column */}
            <aside className="min-w-0 space-y-4 xl:sticky xl:top-24">
              <section className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold">Your Coin Balance</h2>
                  <button
                    type="button"
                    onClick={() => setNotice("Connect this button to the wallet history route.")}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800"
                  >
                    View History
                  </button>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Coin size="large" />
                  <p className="text-3xl font-bold tracking-tight">
                    {balance.toLocaleString("en-IN")} Coins
                  </p>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Use your EventCoins to book amazing events. ⓘ
                </p>
              </section>

              <Card>
                <Heading>Booking Summary</Heading>

                <div className="flex gap-3 border-b border-slate-200 pb-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-24 w-36 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      ▦ &nbsp;{event.date}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      ♧ &nbsp;{event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-b border-slate-200 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-xl text-slate-500">
                      ♙
                    </span>
                    <div className="min-w-0">
                      {tickets.map((ticket) => (
                        <div key={ticket.id}>
                          <p className="text-sm font-bold">{ticket.name}</p>
                          <p className="mt-1 text-xs text-slate-500">{ticket.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              disabled={ticket.quantity <= 1}
                              onClick={() => changeQuantity(ticket.id, ticket.quantity - 1)}
                              aria-label="Remove one ticket"
                              className="flex size-6 items-center justify-center rounded border border-slate-200 disabled:opacity-40"
                            >
                              −
                            </button>
                            <span className="text-xs">{ticket.quantity}</span>
                            <button
                              type="button"
                              disabled={ticket.quantity >= 10}
                              onClick={() => changeQuantity(ticket.id, ticket.quantity + 1)}
                              aria-label="Add one ticket"
                              className="flex size-6 items-center justify-center rounded border border-slate-200 disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="flex items-center justify-end gap-1.5 text-sm font-bold">
                      <Coin /> {tickets.reduce((sum, ticket) => sum + ticket.price, 0).toLocaleString("en-IN")} Coins
                    </p>
                    <p className="mt-1 text-xs text-slate-500">× {totalQuantity}</p>
                  </div>
                </div>

                <div className="space-y-3 border-b border-slate-200 py-4 text-sm">
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span>Ticket Price ({totalQuantity} × 1,500)</span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Coin /> {ticketTotal.toLocaleString("en-IN")} Coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-slate-500">
                    <span>Convenience Fee ⓘ</span>
                    <span className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Coin /> {convenienceFee} Coins
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 py-4">
                  <p className="font-bold">Total Amount</p>
                  <p className="flex items-center gap-2 text-xl font-bold text-emerald-800">
                    <Coin size="large" /> {total.toLocaleString("en-IN")} Coins
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 rounded-lg bg-emerald-50 p-3">
                  <span className="text-sm">▣ &nbsp;Remaining Balance After Booking</span>
                  <span className={`shrink-0 font-bold ${remainingBalance < 0 ? "text-red-600" : "text-emerald-800"}`}>
                    {remainingBalance.toLocaleString("en-IN")} Coins
                  </span>
                </div>

                <button
                  type="button"
                  disabled={total > balance}
                  onClick={handleConfirm}
                  className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  ♙ &nbsp;Confirm Booking ({total.toLocaleString("en-IN")} Coins)
                </button>

                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <span className="text-base text-emerald-700">⬡</span>
                  Your booking will be confirmed only after the backend successfully reserves tickets and deducts coins.
                </p>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}


import { useState } from "react";

const booking = {
  id: "EH20260215001",
  email: "karanmanral@example.com",
  event: "Sunburn Festival 2026",
  category: "Music Festival",
  date: "15 - 17 Feb 2026",
  time: "Fri, 4:00 PM - Sun, 11:00 PM",
  location: "Vagator Beach, Goa, India",
  organizer: "Sunburn Live",
  ticketType: "General Pass",
  ticketDescription: "Access to all 3 days • Standing",
  quantity: 2,
  pricePerTicket: 1500,
  previousBalance: 5000,
};

const money = (value) => value.toLocaleString("en-IN");
const total = booking.quantity * booking.pricePerTicket;
const remainingBalance = booking.previousBalance - total;

function Coin({ className = "" }) {
  return (
    <span
      className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 text-xs font-bold text-white shadow-sm ${className}`}
    >
      $
    </span>
  );
}

function Panel({ title, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}>
      {title && (
        <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

function DetailRow({ icon, children }) {
  return (
    <div className="flex items-start gap-3 text-sm leading-6 text-slate-700">
      <span className="w-5 shrink-0 text-lg text-emerald-700">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function ActionButton({ icon, children, onClick, primary = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition ${
        primary
          ? "border-emerald-700 bg-emerald-700 text-white hover:bg-emerald-800"
          : "border-emerald-700 bg-white text-slate-900 hover:bg-emerald-50"
      }`}
    >
      <span className="text-xl">{icon}</span>
      {children}
    </button>
  );
}

function EventImage({ className = "" }) {
  return (
    <img
      src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85"
      alt="Sunburn Festival concert"
      className={`object-cover ${className}`}
    />
  );
}

export default function BookingConfirmation() {
  const [notice, setNotice] = useState("");

  function copyBookingId() {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(booking.id)
        .then(() => setNotice("Booking ID copied to clipboard."))
        .catch(() => setNotice(`Booking ID: ${booking.id}`));
    } else {
      setNotice(`Booking ID: ${booking.id}`);
    }
  }

  function addToCalendar() {
    const calendarText = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EventHub//Booking//EN",
      "BEGIN:VEVENT",
      "UID:" + booking.id + "@eventhub",
      "SUMMARY:" + booking.event,
      "LOCATION:" + booking.location,
      "DESCRIPTION:Booking ID " + booking.id,
      "DTSTART:20270215T103000Z",
      "DTEND:20270217T173000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([calendarText], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.id}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Calendar file downloaded. Verify the event date before adding it.");
  }

  async function shareEvent() {
    const data = {
      title: booking.event,
      text: `${booking.event}\n${booking.date}\n${booking.location}\nBooking ID: ${booking.id}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(data);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.text);
        setNotice("Event details copied to clipboard.");
      } else {
        setNotice(data.text);
      }
    } catch {
      setNotice("Sharing was cancelled or is unavailable.");
    }
  }

  function downloadConfirmation() {
    const content = [
      "EVENTHUB - BOOKING CONFIRMATION",
      "",
      "Booking Confirmed!",
      `Booking ID: ${booking.id}`,
      `Email: ${booking.email}`,
      "",
      `Event: ${booking.event}`,
      `Date: ${booking.date}`,
      `Time: ${booking.time}`,
      `Location: ${booking.location}`,
      `Organizer: ${booking.organizer}`,
      "",
      `Ticket Type: ${booking.ticketType}`,
      `Quantity: ${booking.quantity}`,
      `Price per ticket: ${money(booking.pricePerTicket)} Coins`,
      `Total paid: ${money(total)} Coins`,
      `Previous balance: ${money(booking.previousBalance)} Coins`,
      `Remaining balance: ${money(remainingBalance)} Coins`,
      "",
      "Please keep your booking ID for reference.",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.id}-confirmation.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {notice && (
          <div
            role="status"
            className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">
              ×
            </button>
          </div>
        )}

        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)]">
          {/* Left column */}
          <div className="min-w-0 space-y-5">
            {/* Confirmation banner */}
            <section className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 px-4 py-8 text-center shadow-sm sm:py-10">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 18 }, (_, i) => (
                  <span
                    key={i}
                    className="absolute size-2 rotate-45 rounded-sm"
                    style={{
                      left: `${5 + ((i * 37) % 90)}%`,
                      top: `${8 + ((i * 23) % 78)}%`,
                      backgroundColor: ["#10b981", "#f59e0b", "#8b5cf6", "#f97316", "#38bdf8"][i % 5],
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>

              <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-700 text-4xl text-white shadow-sm">
                ✓
              </div>
              <h1 className="relative mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Booking Confirmed!
              </h1>
              <p className="relative mt-2 text-lg font-medium sm:text-xl">
                Your tickets have been successfully booked.
              </p>
              <p className="relative mt-2 text-sm text-slate-600 sm:text-base">
                A confirmation email has been sent to{" "}
                <strong className="break-all text-slate-800">{booking.email}</strong>
              </p>
            </section>

            {/* Event details and ticket table */}
            <Panel title="Event Details">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">Your booking information</span>
                <button
                  type="button"
                  onClick={copyBookingId}
                  className="flex items-center gap-2 text-xs text-slate-600 hover:text-emerald-700"
                >
                  Booking ID: {booking.id} <span className="text-lg">▢</span>
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-[minmax(200px,0.8fr)_minmax(0,1.5fr)]">
                <EventImage className="h-48 w-full rounded-lg" />

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-extrabold">{booking.event}</h2>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {booking.category}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5">
                    <DetailRow icon="▦">
                      <strong>{booking.date}</strong>
                      <span className="block text-slate-500">{booking.time}</span>
                    </DetailRow>
                    <DetailRow icon="♧">
                      {booking.location}
                      <button
                        type="button"
                        onClick={() => setNotice("Connect the venue address to a maps URL.")}
                        className="ml-3 text-xs font-semibold text-emerald-700 underline"
                      >
                        View on Map
                      </button>
                    </DetailRow>
                    <DetailRow icon="♙">
                      Organized by {booking.organizer}
                      <button
                        type="button"
                        onClick={() => setNotice("Connect this button to the organizer profile.")}
                        className="ml-3 text-xs font-semibold text-emerald-700 underline"
                      >
                        View Profile
                      </button>
                    </DetailRow>
                  </div>
                </div>
              </div>

              <div className="my-5 border-t border-slate-200" />

              <h2 className="mb-3 text-lg font-bold">Ticket Details</h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-600">
                    <tr>
                      <th className="px-3 py-3">Ticket Type</th>
                      <th className="px-3 py-3 text-center">Quantity</th>
                      <th className="px-3 py-3">Price (per ticket)</th>
                      <th className="px-3 py-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-3">
                        <strong>{booking.ticketType}</strong>
                        <span className="mt-1 block text-xs text-slate-500">
                          {booking.ticketDescription}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center font-bold">{booking.quantity}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap font-semibold">
                          <Coin /> {money(booking.pricePerTicket)} Coins
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap font-bold">
                          <Coin /> {money(total)} Coins
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <Panel className="overflow-hidden border-emerald-100 !p-0">
              <div className="flex items-center gap-3 bg-emerald-50/80 px-4 py-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
                  🪙
                </span>
                <h2 className="text-lg font-bold">EventCoins Transaction</h2>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">Previous Balance</span>
                  <span className="flex items-center gap-2 whitespace-nowrap font-bold">
                    <Coin /> {money(booking.previousBalance)} Coins
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-600">Coins Used</span>
                  <span className="flex items-center gap-2 whitespace-nowrap font-bold text-red-600">
                    <Coin /> - {money(total)} Coins
                  </span>
                </div>
                <div className="border-t border-slate-200" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-bold">Remaining Balance</span>
                  <span className="flex items-center gap-2 whitespace-nowrap font-extrabold text-emerald-700">
                    <Coin /> {money(remainingBalance)} Coins
                  </span>
                </div>
              </div>
            </Panel>

            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4">
              <div className="flex gap-3">
                <span className="text-2xl text-blue-600">ⓘ</span>
                <div>
                  <p className="text-sm font-semibold">Tickets are non-refundable (as per event policy).</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">
                    If the event is canceled, your EventCoins will be refunded.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <ActionButton
                primary
                icon="♢"
                onClick={() => setNotice("Connect this action to your My Bookings / My Tickets page.")}
              >
                View My Tickets
              </ActionButton>
              <ActionButton icon="▦" onClick={addToCalendar}>
                Add to Calendar
              </ActionButton>
              <ActionButton icon="♧" onClick={shareEvent}>
                Share Event
              </ActionButton>
              <ActionButton icon="▤" onClick={downloadConfirmation}>
                Download Confirmation
              </ActionButton>
            </div>
          </div>
        </div>

        {/* What's next */}
        <section className="mt-6 rounded-xl border border-blue-100 bg-blue-50/30 p-4 sm:p-5">
          <h2 className="mb-4 text-2xl font-extrabold tracking-tight">What's Next?</h2>

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              {
                icon: "✉",
                color: "bg-blue-100 text-blue-600",
                title: "Check Your Email",
                description: "Find your e-tickets and event details in your inbox.",
                action: () => setNotice(`Check your inbox at ${booking.email} for confirmation.`),
              },
              {
                icon: "♢",
                color: "bg-emerald-100 text-emerald-700",
                title: "View My Tickets",
                description: "Access your tickets anytime from your account.",
                action: () => setNotice("Connect this action to your tickets page."),
              },
              {
                icon: "▦",
                color: "bg-amber-100 text-amber-600",
                title: "Plan Your Trip",
                description: "Check venue location, transport and nearby stays.",
                action: () => setNotice("Connect the venue location to your trip planner."),
              },
              {
                icon: "♧",
                color: "bg-purple-100 text-purple-700",
                title: "Explore More Events",
                description: "Discover more amazing events on EventHub.",
                action: () => setNotice("Connect this action to your events listing."),
              },
            ].map((item) => (
              <button
                type="button"
                key={item.title}
                onClick={item.action}
                className="flex min-h-28 items-start gap-4 rounded-xl border border-transparent bg-white p-4 text-left transition hover:border-emerald-200 hover:shadow-sm"
              >
                <span className={`flex size-14 shrink-0 items-center justify-center rounded-full text-3xl ${item.color}`}>
                  {item.icon}
                </span>
                <span>
                  <span className="block font-bold">{item.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-500">
                    {item.description}
                  </span>
                </span>
                <span className="ml-auto text-xl text-slate-500">›</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

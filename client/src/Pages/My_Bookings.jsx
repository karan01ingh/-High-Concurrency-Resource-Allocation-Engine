
import { useMemo, useState } from "react";

const initialBookings = [
  {
    id: "EH20260215001",
    name: "Sunburn Festival 2026",
    category: "Music Festival",
    date: "15 - 17 Feb 2026",
    time: "Fri, 4:00 PM - Sun, 11:00 PM",
    location: "Vagator Beach, Goa, India",
    ticket: "General Pass",
    quantity: 2,
    description: "Access to all 3 days • Standing",
    amount: 3000,
    status: "Upcoming",
    bookedOn: "10 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "EH20260312045",
    name: "TechNext Conference",
    category: "Tech",
    date: "12 - 13 Mar 2026",
    time: "Thu, 9:00 AM - Fri, 6:00 PM",
    location: "Bengaluru, India",
    ticket: "Regular Pass",
    quantity: 1,
    description: "Access to both days • Seating",
    amount: 2499,
    status: "Upcoming",
    bookedOn: "02 Sep 2026",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "EH20261005012",
    name: "Jabalpur Food Carnival",
    category: "Food & Drinks",
    date: "5 Oct 2026",
    time: "Sun, 10:00 AM - 10:00 PM",
    location: "Jabalpur, India",
    ticket: "Entry Pass",
    quantity: 2,
    description: "General entry • Food & Drinks",
    amount: 299,
    status: "Completed",
    bookedOn: "15 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "EH20260325033",
    name: "Stand-up Comedy Night",
    category: "Comedy",
    date: "25 Mar 2026",
    time: "Wed, 7:00 PM - 10:00 PM",
    location: "Mumbai, India",
    ticket: "VIP Pass",
    quantity: 1,
    description: "Premium seating • Food & Drinks",
    amount: 799,
    status: "Cancelled",
    bookedOn: "20 Aug 2026",
    refund: 3000,
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "EH20260928015",
    name: "The Local Band Night",
    category: "Music",
    date: "28 Sep 2026",
    time: "Mon, 6:00 PM - 10:00 PM",
    location: "Jabalpur, India",
    ticket: "Entry Pass",
    quantity: 1,
    description: "General entry",
    amount: 499,
    status: "Completed",
    bookedOn: "10 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=85",
  },
  {
    id: "EH20260414011",
    name: "AI & Future Tech Summit",
    category: "Tech",
    date: "14 Apr 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Delhi, India",
    ticket: "Conference Pass",
    quantity: 1,
    description: "Conference access",
    amount: 999,
    status: "Completed",
    bookedOn: "05 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?auto=format&fit=crop&w=700&q=85",
  },
];

const money = (amount) => amount.toLocaleString("en-IN");

function Coin({ className = "" }) {
  return (
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-gradient-to-br from-yellow-300 to-amber-500 text-[10px] font-bold text-white ${className}`}
    >
      $
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-emerald-100 text-emerald-800",
    Completed: "bg-slate-100 text-slate-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold ${styles[status]}`}
    >
      {status === "Upcoming" ? "⊙" : status === "Completed" ? "✓" : "⊗"}
      {status}
    </span>
  );
}

function IconText({ icon, children }) {
  return (
    <div className="flex items-start gap-2.5 text-xs leading-5 text-slate-700">
      <span className="w-4 shrink-0 text-base leading-5 text-emerald-700">
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

function BookingCard({ booking, onView, onCancel }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition hover:shadow-md sm:p-4">
      <div className="grid gap-4 sm:grid-cols-[150px_minmax(0,1fr)_160px]">
        <img
          src={booking.image}
          alt={booking.name}
          className="h-44 w-full rounded-lg object-cover sm:h-full sm:min-h-40"
        />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              {booking.name}
            </h2>
            <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-semibold text-purple-700">
              {booking.category}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <IconText icon="▦">
              <strong>{booking.date}</strong>
              <span className="block text-slate-500">{booking.time}</span>
            </IconText>

            <IconText icon="♧">
              {booking.location}
              <button
                type="button"
                onClick={() => onView(booking, "map")}
                className="ml-3 text-emerald-700 underline underline-offset-2"
              >
                View on Map
              </button>
            </IconText>

            <IconText icon="♢">
              <strong>
                {booking.ticket} × {booking.quantity}
              </strong>
              <span className="block text-slate-500">
                {booking.description}
              </span>
            </IconText>

            <p className="flex items-center gap-2 pt-0.5 text-sm font-bold">
              <Coin />
              {money(booking.amount)} Coins
            </p>
          </div>

          {booking.status === "Cancelled" && (
            <div className="mt-3 rounded-lg bg-sky-50 px-3 py-2 text-xs">
              <p className="font-semibold text-slate-900">
                ⓘ {money(booking.refund || booking.amount)} Coins Refunded
              </p>
              <p className="mt-1 text-slate-500">
                Amount has been returned to your wallet.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <StatusBadge status={booking.status} />

          <div className="text-right text-xs leading-5 text-slate-500">
            <p>Booking ID</p>
            <p className="font-medium text-slate-700">{booking.id}</p>
            <p className="mt-1">
              {booking.status === "Cancelled" ? "Cancelled on" : "Booked on"}
            </p>
            <p>{booking.bookedOn}</p>
          </div>

          <div className="mt-auto flex w-full flex-col gap-2">
            {booking.status !== "Cancelled" && (
              <button
                type="button"
                onClick={() => onView(booking, "ticket")}
                className="w-full rounded-lg border border-emerald-700 bg-emerald-700 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-800"
              >
                ♢ &nbsp; View Ticket
              </button>
            )}

            {booking.status === "Upcoming" && (
              <button
                type="button"
                onClick={() => onCancel(booking)}
                className="w-full rounded-lg border border-red-400 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                ♜ &nbsp; Cancel Booking
              </button>
            )}

            {booking.status === "Cancelled" && (
              <button
                type="button"
                onClick={() => onView(booking, "details")}
                className="w-full rounded-lg border border-emerald-700 px-3 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function TicketPanel({ booking, onClose, onDownload, onShare }) {
  if (!booking) return null;

  const qrUrl =
    "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
    encodeURIComponent(booking.id);

  return (
    <aside className="fixed inset-0 z-40 flex justify-end bg-slate-950/30 lg:static lg:inset-auto lg:z-auto lg:block lg:bg-transparent">
      <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-xl lg:sticky lg:top-4 lg:h-auto lg:max-w-none lg:rounded-xl lg:border lg:border-slate-100 lg:shadow-sm">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-xl font-bold">Your Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close ticket"
            className="text-2xl text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="px-4">
          <img
            src={booking.image}
            alt={booking.name}
            className="h-48 w-full rounded-t-lg object-cover"
          />

          <div className="rounded-b-xl border border-slate-100 bg-white p-3.5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold">{booking.ticket}</h3>
              <StatusBadge status={booking.status} />
            </div>

            <div className="mt-3 space-y-2.5">
              <IconText icon="▦">
                <strong>{booking.date}</strong>
                <span className="block text-slate-500">{booking.time}</span>
              </IconText>
              <IconText icon="♧">{booking.location}</IconText>
              <IconText icon="♙">Organized by Sunburn Live</IconText>
            </div>

            <div className="my-4 border-t border-dashed border-slate-300" />

            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Booking ID</span>
                <span className="break-all text-right font-semibold">{booking.id}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Ticket Type</span>
                <span className="text-right font-semibold">{booking.ticket}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Quantity</span>
                <span className="font-semibold">{booking.quantity}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Total Paid</span>
                <span className="flex items-center gap-1 font-bold">
                  <Coin /> {money(booking.amount)} Coins
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-dashed border-slate-300" />

            {booking.status !== "Cancelled" ? (
              <>
                <div className="flex justify-center">
                  <img
                    src={qrUrl}
                    alt={`QR code for booking ${booking.id}`}
                    className="size-36"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-semibold">
                  {booking.id}
                </p>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Show this QR code at the venue for entry.
                </p>
              </>
            ) : (
              <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-700">
                This booking has been cancelled.
              </div>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onDownload(booking)}
                className="rounded-lg border border-slate-300 px-2 py-2.5 text-xs font-semibold hover:bg-slate-50"
              >
                ↓ Download Ticket
              </button>
              <button
                type="button"
                onClick={() => onShare(booking)}
                className="rounded-lg border border-emerald-700 px-2 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                ↗ Share Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function MyBookings() {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [selectedBooking, setSelectedBooking] = useState(initialBookings[0]);
  const [notice, setNotice] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [mobileTicketOpen, setMobileTicketOpen] = useState(false);

  const tabs = ["Upcoming", "Completed", "Cancelled"];

  const counts = useMemo(
    () => ({
      Upcoming: bookings.filter((b) => b.status === "Upcoming").length,
      Completed: bookings.filter((b) => b.status === "Completed").length,
      Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
    }),
    [bookings]
  );

  const visibleBookings = bookings.filter((booking) => booking.status === activeTab);

  function openTicket(booking, mode) {
    if (mode === "map") {
      setNotice(`Map location: ${booking.location}. Connect a maps URL to open directions.`);
      return;
    }

    setSelectedBooking(booking);
    setMobileTicketOpen(true);

    if (mode === "details") {
      setNotice(`Booking ${booking.id} is cancelled. Refund details are shown in the ticket panel.`);
    }
  }

  function confirmCancellation() {
    if (!cancelTarget) return;

    setBookings((current) =>
      current.map((booking) =>
        booking.id === cancelTarget.id
          ? { ...booking, status: "Cancelled", refund: booking.amount }
          : booking
      )
    );

    setSelectedBooking({
      ...cancelTarget,
      status: "Cancelled",
      refund: cancelTarget.amount,
    });

    setNotice(`Booking ${cancelTarget.id} marked cancelled in this demo.`);
    setCancelTarget(null);
    setActiveTab("Cancelled");
  }

  function downloadTicket(booking) {
    const content = [
      "EventHub Ticket",
      `Event: ${booking.name}`,
      `Booking ID: ${booking.id}`,
      `Ticket: ${booking.ticket}`,
      `Quantity: ${booking.quantity}`,
      `Date: ${booking.date}`,
      `Location: ${booking.location}`,
      `Status: ${booking.status}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${booking.id}-ticket.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function shareTicket(booking) {
    const shareData = {
      title: `EventHub Ticket - ${booking.name}`,
      text: `Booking ID: ${booking.id}\n${booking.name}\n${booking.date}`,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.text);
        setNotice("Ticket details copied to clipboard.");
      } else {
        setNotice(`Booking ID: ${booking.id}`);
      }
    } catch {
      setNotice("Ticket sharing was cancelled or is unavailable.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* User sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 lg:block">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="flex size-12 items-center justify-center rounded-full bg-violet-200 text-sm font-bold text-violet-800">
              KS
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">Karan Singh</p>
              <p className="mt-1 truncate text-xs text-slate-500">karan@example.com</p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              ["⌂", "Dashboard"],
              ["▦", "My Bookings"],
              ["♧", "My Rewards"],
              ["▣", "Wallet & Coins"],
              ["♙", "Profile"],
              ["⚙", "Settings"],
            ].map(([icon, label]) => (
              <button
                type="button"
                key={label}
                onClick={() =>
                  label === "My Bookings"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : setNotice(`${label} page can be connected to its route.`)
                }
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                  label === "My Bookings"
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setNotice("Connect logout to your authentication flow.")}
              className="mt-5 flex w-full items-center gap-4 px-4 py-3 text-sm font-medium text-red-500"
            >
              <span className="text-xl">⇥</span> Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <header className="mb-5">
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage all your event bookings in one place.
            </p>
          </header>

          {notice && (
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <span>{notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 shadow-sm sm:max-w-xl">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-2 py-3 text-xs font-semibold transition sm:text-sm ${
                  activeTab === tab
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab} ({counts[tab]})
              </button>
            ))}
          </div>

          <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-w-0 space-y-3">
              {visibleBookings.length ? (
                visibleBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onView={openTicket}
                    onCancel={setCancelTarget}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-slate-100 bg-white px-5 py-16 text-center">
                  <p className="text-lg font-semibold">No {activeTab.toLowerCase()} bookings</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Your bookings in this category will appear here.
                  </p>
                </div>
              )}
            </section>

            <div className={mobileTicketOpen ? "fixed inset-0 z-40 block xl:static xl:inset-auto xl:z-auto" : "hidden xl:block"}>
              <TicketPanel
                booking={selectedBooking}
                onClose={() => setMobileTicketOpen(false)}
                onDownload={downloadTicket}
                onShare={shareTicket}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Cancellation confirmation */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h2 className="text-xl font-bold">Cancel Booking?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Are you sure you want to cancel <strong>{cancelTarget.name}</strong>?
              This demo will mark the booking as cancelled locally.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={confirmCancellation}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

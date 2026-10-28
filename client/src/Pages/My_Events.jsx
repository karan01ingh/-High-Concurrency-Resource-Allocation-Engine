
import { useEffect, useMemo, useState } from "react";

const API_URL = "http://127.0.0.1:8000/events/all_events/1036285";
const UPDATE_EVENT_API = "http://127.0.0.1:8000/events";

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80";

const updateEvent = async (event_id, eventData) => {
  const response = await fetch(`${UPDATE_EVENT_API}/${event_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "event_data":{event_name: eventData.name,
      description: eventData.description,
      event_date: eventData.date,
      event_time: eventData.startTime,}
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update event");
  }

  return result;
};

// API response:
// [eventid, event_date, event_time, event_name,
//  event_capacity, event_ticket_price, event_place,
//  event_description, event_created_by, event_ticket_sold]

const mapApiEvent = (event) => {
  const eventDate = String(event[1] ?? "");

  return {
    id: String(event[0]),
    date: eventDate,
    startTime: String(event[2] ?? ""),
    name: String(event[3] ?? "Untitled Event"),
    capacity: Number(event[4] ?? 0),
    ticket_sold: Number(event[9] ?? 0),
    ticketPrice: Number(event[5] ?? 0),
    location: String(event[6] ?? ""),
    description: String(event[7] ?? ""),
    createdBy: String(event[8] ?? ""),
    image: DEFAULT_EVENT_IMAGE,
    category: "General",
    status:
      eventDate < new Date().toLocaleDateString("en-CA")
        ? "Completed"
        : "Upcoming",
  };
};

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN");

const formatPrice = (value) =>
  Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDate = (dateString) => {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Card({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function StatCard({ icon, title, value, subtitle, theme }) {
  const themes = {
    blue: "border-blue-100 bg-blue-50/70",
    green: "border-emerald-100 bg-emerald-50/70",
    amber: "border-amber-100 bg-amber-50/70",
    purple: "border-purple-100 bg-purple-50/70",
  };

  return (
    <div
      className={`flex min-w-0 items-center gap-3 rounded-xl border p-4 ${themes[theme]}`}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-2xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-600">{title}</p>
        <p className="mt-1 truncate text-2xl font-bold text-slate-900">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-green-200 text-slate-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${
        styles[status] || styles.Upcoming
      }`}
    >
      {status}
    </span>
  );
}

function EventTable({ events, onView, onEdit, onMore }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-semibold text-slate-600">
            <th className="rounded-l-lg px-3 py-3">Event</th>
            <th className="px-3 py-3">Date &amp; Time</th>
            <th className="px-3 py-3">Location</th>
            <th className="px-3 py-3">Tickets Sold / Capacity</th>
            <th className="px-3 py-3">Ticket Price</th>
            <th className="px-3 py-3">Status</th>
            <th className="rounded-r-lg px-3 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              className="border-b border-slate-100 transition hover:bg-slate-50/70"
            >
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="h-16 w-24 shrink-0 rounded-lg object-cover"
                  />

                  <div className="min-w-0">
                    <p className="max-w-48 text-xs font-bold text-slate-900">
                      {event.name}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-purple-100 px-3 py-1 text-[10px] font-semibold text-purple-700">
                      {event.category}
                    </span>
                  </div>
                </div>
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <p className="text-xs text-slate-600">
                  ▦ &nbsp;{formatDate(event.date)}
                </p>
                <p className="mt-2 text-xs text-slate-600">
                  ◷ &nbsp;{event.startTime || "—"}
                </p>
              </td>

              <td className="px-3 py-3">
                <p className="max-w-36 text-xs leading-5 text-slate-700">
                  ♧ &nbsp;{event.location || "—"}
                </p>
              </td>

              <td className="px-3 py-3">
                <p className="text-xs font-semibold">
                  {formatNumber(event.ticket_sold)} /{" "}
                  {formatNumber(event.capacity)}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {event.capacity > 0
                    ? `${Math.round(
                        (event.ticket_sold / event.capacity) * 100
                      )}% booked`
                    : "Capacity unavailable"}
                </p>
              </td>

              <td className="whitespace-nowrap px-3 py-3">
                <p className="text-xs font-bold">
                  ₹{formatPrice(event.ticketPrice)}
                </p>
              </td>

              <td className="px-3 py-3">
                <StatusBadge status={event.status} />
              </td>

              <td className="px-3 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView(event)}
                    className="rounded-lg border border-blue-300 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    aria-label={`More actions for ${event.name}`}
                    onClick={() => onMore(event)}
                    className="rounded-lg px-2 py-2 text-lg text-slate-500 hover:bg-slate-100"
                  >
                    ⋮
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {events.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-12 text-center text-sm text-slate-500"
              >
                No events found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function MyEvents() {
  const [allEvents, setAllEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogMode, setDialogMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchEvents = async (pageOffset = 0) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1036285,
          search_value: search.trim(),
          filter_value: {},
          order_col: "event_date",
          order_col_dir: "DESC",
          limit,
          offset: pageOffset,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch events.");
      }

      const rows = result?.additional_response?.data;

      if (!Array.isArray(rows)) {
        throw new Error("Unexpected API response format.");
      }

      const mappedEvents = rows.map(mapApiEvent);

      setAllEvents(mappedEvents);
      setOffset(pageOffset);
      setHasMore(mappedEvents.length === limit);
    } catch (err) {
      setError(err.message || "Something went wrong while fetching events.");
      setAllEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Existing search behavior is intentionally preserved.
  useEffect(() => {
    fetchEvents(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const upcoming = useMemo(
    () => allEvents.filter((event) => event.status === "Upcoming"),
    [allEvents]
  );

  const completed = useMemo(
    () => allEvents.filter((event) => event.status === "Completed"),
    [allEvents]
  );

  const visibleEvents = activeTab === "Upcoming" ? upcoming : completed;

  const totalCapacity = allEvents.reduce(
    (sum, event) => sum + event.capacity,
    0
  );

  function showEvent(event, mode) {
    setSelectedEvent({ ...event });
    setDialogMode(mode);
  }

  function closeDialog() {
    setSelectedEvent(null);
    setDialogMode("");
  }

  function handleCreateEvent() {
    setNotice("Connect this button to your Create Event page or route.");
  }

  async function handleSaveEdit(event) {
    try {
      setNotice("");

      await updateEvent(event.id, event);

      setAllEvents((current) =>
        current.map((item) => (item.id === event.id ? event : item))
      );

      closeDialog();
      setNotice("Event updated successfully.");
    } catch (error) {
      setNotice(error.message || "Failed to update event.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-[calc(100vh-64px)]">
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 lg:block">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-950 text-center text-[10px] font-bold leading-tight text-white">
              EVENT
              <br />
              LIVE
            </div>

            <div>
              <p className="text-sm font-bold">Organizer Account</p>
              <p className="mt-1 text-xs text-slate-500">
                Event Management
              </p>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              ["⌂", "Dashboard"],
              ["▦", "My Events"],
              ["⊕", "Create Event"],
              ["▣", "Event Bookings"],
              ["▥", "Analytics"],
              ["♧", "Wallet & Payouts"],
              ["♙", "Profile"],
            ].map(([icon, label]) => (
              <button
                type="button"
                key={label}
                onClick={() =>
                  label === "My Events"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : setNotice(`${label} route can be connected next.`)
                }
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium ${
                  label === "My Events"
                    ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage, edit, and track your events.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateEvent}
              className="rounded-lg bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              ＋ Create New Event
            </button>
          </header>

          {notice && (
            <div
              role="status"
              className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
            >
              {notice}
              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => fetchEvents(offset)}
                className="font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              icon="▦"
              title="Events on This Page"
              value={allEvents.length}
              subtitle="Events returned by the API"
              theme="blue"
            />

            <StatCard
              icon="♟"
              title="Total Capacity"
              value={formatNumber(totalCapacity)}
              subtitle="Across fetched events"
              theme="green"
            />

            <StatCard
              icon="₹"
              title="Ticket Price Range"
              value={
                allEvents.length
                  ? `₹${formatPrice(
                      Math.min(...allEvents.map((event) => event.ticketPrice))
                    )}`
                  : "—"
              }
              subtitle="Lowest listed ticket price"
              theme="amber"
            />

            <StatCard
              icon="▥"
              title="Event Records"
              value={loading ? "…" : allEvents.length}
              subtitle="Current API response"
              theme="purple"
            />
          </div>

          <Card className="mt-4 !p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 pt-3">
              <div className="flex gap-5">
                {[
                  ["Upcoming", `Upcoming Events (${upcoming.length})`],
                  ["Completed", `Completed Events (${completed.length})`],
                ].map(([tab, label]) => (
                  <button
                    type="button"
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-2 pb-3 text-sm font-semibold ${
                      activeTab === tab
                        ? "border-emerald-600 text-emerald-700"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex w-full flex-wrap gap-3 pb-3 sm:w-auto">
                <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 sm:flex-none">
                  <span className="text-lg text-slate-500">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search events..."
                    className="w-full min-w-0 py-2 text-xs outline-none sm:w-40"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fetchEvents(0)}
                  disabled={loading}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>

            <div className="p-3">
              {loading ? (
                <p className="py-12 text-center text-sm text-slate-500">
                  Loading events...
                </p>
              ) : (
                <EventTable
                  events={visibleEvents}
                  onView={(event) => showEvent(event, "view")}
                  onEdit={(event) => showEvent(event, "edit")}
                  onMore={(event) => showEvent(event, "more")}
                />
              )}

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  Page offset: {offset}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loading || offset === 0}
                    onClick={() => fetchEvents(Math.max(0, offset - limit))}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    disabled={loading || !hasMore}
                    onClick={() => fetchEvents(offset + limit)}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">
                  {dialogMode === "edit"
                    ? "Edit Event"
                    : dialogMode === "more"
                      ? "Event Actions"
                      : "Event Details"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Event ID: {selectedEvent.id}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDialog}
                className="text-xl text-slate-500"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {dialogMode === "edit" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveEdit(selectedEvent);
                }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium">
                  Event Name
                  <input
                    required
                    value={selectedEvent.name}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        name: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Event Date
                  <input
                    required
                    type="date"
                    value={selectedEvent.date}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        date: e.target.value,
                        status:
                          e.target.value <
                          new Date().toLocaleDateString("en-CA")
                            ? "Completed"
                            : "Upcoming",
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Event Time
                  <input
                    required
                    type="text"
                    placeholder="e.g. 06:30PM"
                    value={selectedEvent.startTime}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        startTime: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Description
                  <textarea
                    rows={3}
                    value={selectedEvent.description}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        description: e.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : dialogMode === "more" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    closeDialog();
                    setNotice(
                      "Connect this action to your event duplication API."
                    );
                  }}
                  className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50"
                >
                  Duplicate event
                </button>

                <button
                  type="button"
                  onClick={() => {
                    closeDialog();
                    setNotice(
                      "Connect this action to your event cancellation API."
                    );
                  }}
                  className="w-full rounded-lg border border-red-100 p-3 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel event
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.name}
                  className="h-48 w-full rounded-xl object-cover"
                />

                <h3 className="mt-4 text-lg font-bold">
                  {selectedEvent.name}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {selectedEvent.description || "No description available."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="mt-1 font-semibold">
                      {formatDate(selectedEvent.date)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedEvent.status} />
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Ticket Price</p>
                    <p className="mt-1 font-semibold">
                      ₹{formatPrice(selectedEvent.ticketPrice)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Capacity</p>
                    <p className="mt-1 font-semibold">
                      {formatNumber(selectedEvent.capacity)}
                    </p>
                  </div>

                  <div className="col-span-2 rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Location</p>
                    <p className="mt-1 font-semibold">
                      {selectedEvent.location || "—"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeDialog}
                  className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

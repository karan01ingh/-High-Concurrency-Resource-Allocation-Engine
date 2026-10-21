
import { useMemo, useState } from "react";

const initialEvents = [
  {
    id: 1,
    name: "Sunburn Festival 2026",
    category: "Music Festival",
    date: "15 - 17 Feb 2026",
    startTime: "4:00 PM - 11:00 PM",
    location: "Vagator Beach, Goa",
    sold: 320,
    capacity: 500,
    revenue: 300000,
    status: "Live",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    name: "TechNext Conference",
    category: "Tech",
    date: "12 - 13 Mar 2026",
    startTime: "9:00 AM - 6:00 PM",
    location: "Bengaluru, India",
    sold: 180,
    capacity: 300,
    revenue: 249900,
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    name: "Jabalpur Food Carnival",
    category: "Food & Drinks",
    date: "5 Oct 2026",
    startTime: "12:00 PM - 11:00 PM",
    location: "Jabalpur, India",
    sold: 75,
    capacity: 200,
    revenue: 119600,
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    name: "Stand-up Comedy Night",
    category: "Comedy",
    date: "25 Mar 2026",
    startTime: "7:00 PM - 10:00 PM",
    location: "Jabalpur, India",
    sold: 150,
    capacity: 150,
    revenue: 149850,
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    name: "Indie Music Night",
    category: "Music",
    date: "10 Jan 2026",
    startTime: "6:00 PM - 11:00 PM",
    location: "Delhi, India",
    sold: 200,
    capacity: 200,
    revenue: 199500,
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80",
  },
];

const formatNumber = (number) =>
  number.toLocaleString("en-IN");

const formatCoins = (number) =>
  number.toLocaleString("en-IN");

function Card({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}

function Coin({ className = "" }) {
  return (
    <span
      className={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-gradient-to-br from-yellow-300 to-amber-500 text-[10px] font-bold text-white ${className}`}
    >
      $
    </span>
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
      <span className="text-xl text-slate-500">›</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Live: "bg-emerald-100 text-emerald-800",
    Upcoming: "bg-blue-50 text-blue-700",
    Completed: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold ${styles[status] || styles.Upcoming}`}
    >
      {status === "Live" ? "✚ " : ""}
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
            <th className="px-3 py-3">Revenue (EventCoins)</th>
            <th className="px-3 py-3">Status</th>
            <th className="rounded-r-lg px-3 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => {
            const percentage = event.capacity
              ? Math.round((event.sold / event.capacity) * 100)
              : 0;

            return (
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
                  <p className="text-xs text-slate-600">▦ &nbsp;{event.date}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    ◷ &nbsp;{event.startTime}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <p className="max-w-36 text-xs leading-5 text-slate-700">
                    ♧ &nbsp;{event.location}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <p className="text-xs font-semibold">
                    {event.sold} / {event.capacity}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2.5 w-28 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-600 transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {percentage}%
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <p className="flex items-center gap-2 text-xs font-bold">
                    <Coin />
                    {formatCoins(event.revenue)}
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

                    {event.status !== "Completed" && (
                      <button
                        type="button"
                        onClick={() => onEdit(event)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                    )}

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
            );
          })}

          {events.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-12 text-center text-sm text-slate-500">
                No events match your search or category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function MyEvents() {
  const [allEvents, setAllEvents] = useState(initialEvents);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [notice, setNotice] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogMode, setDialogMode] = useState("");

  const upcoming = useMemo(
    () => allEvents.filter((event) => event.status !== "Completed"),
    [allEvents]
  );

  const completed = useMemo(
    () => allEvents.filter((event) => event.status === "Completed"),
    [allEvents]
  );

  const filteredEvents = (list) =>
    list.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase()) ||
        event.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || event.category === category;

      return matchesSearch && matchesCategory;
    });

  const categories = [...new Set(allEvents.map((event) => event.category))];

  const totalAttendees = allEvents.reduce((sum, event) => sum + event.sold, 0);
  const totalRevenue = allEvents.reduce((sum, event) => sum + event.revenue, 0);

  function showEvent(event, mode) {
    setSelectedEvent(event);
    setDialogMode(mode);
  }

  function closeDialog() {
    setSelectedEvent(null);
    setDialogMode("");
  }

  function updateEvent(eventId, updates) {
    setAllEvents((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  }

  function handleCreateEvent() {
    setNotice("Connect this button to your Create Event page or route.");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Organizer sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 lg:block">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-950 text-center text-[10px] font-bold leading-tight text-white">
              SUNBURN<br />LIVE
            </div>
            <div>
              <p className="text-sm font-bold">Sunburn Live</p>
              <p className="mt-1 text-xs text-slate-500">Organizer Account</p>
              <button
                type="button"
                onClick={() => setNotice("Connect this action to the organizer profile page.")}
                className="mt-1 text-xs text-emerald-700 underline"
              >
                View Profile
              </button>
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
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage, edit, and track all your events.
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
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {notice}
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          {/* Summary statistics */}
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard
              icon="▦"
              title="Total Events"
              value={allEvents.length}
              subtitle={`${upcoming.length} Upcoming • ${completed.length} Completed`}
              theme="blue"
            />
            <StatCard
              icon="♟"
              title="Total Attendees"
              value={formatNumber(totalAttendees)}
              subtitle="Across all events"
              theme="green"
            />
            <StatCard
              icon="🟡"
              title="Total EventCoins Earned"
              value={formatCoins(totalRevenue)}
              subtitle="Across all events"
              theme="amber"
            />
            <StatCard
              icon="▥"
              title="Average Event Rating"
              value="4.6"
              subtitle="★★★★★"
              theme="purple"
            />
          </div>

          {/* Upcoming events and search */}
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

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-emerald-600"
                >
                  <option>All Categories</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3">
              <EventTable
                events={filteredEvents(activeTab === "Upcoming" ? upcoming : completed)}
                onView={(event) => showEvent(event, "view")}
                onEdit={(event) => showEvent(event, "edit")}
                onMore={(event) => showEvent(event, "more")}
              />
            </div>
          </Card>

          {/* Completed events */}
          <Card className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Completed Events ({completed.length})
              </h2>
            </div>

            <EventTable
              events={filteredEvents(completed)}
              onView={(event) => showEvent(event, "view")}
              onEdit={(event) => showEvent(event, "edit")}
              onMore={(event) => showEvent(event, "more")}
            />
          </Card>
        </main>
      </div>

      {/* View / edit event dialog */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl"
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
                <p className="mt-1 text-sm text-slate-500">{selectedEvent.name}</p>
              </div>
              <button type="button" onClick={closeDialog} className="text-xl text-slate-500" aria-label="Close">×</button>
            </div>

            {dialogMode === "edit" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  closeDialog();
                  setNotice("Event updated in local UI state. Connect the update API to persist it.");
                }}
                className="space-y-4"
              >
                <label className="block text-sm font-medium">
                  Event Name
                  <input
                    required
                    value={selectedEvent.name}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, name: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Category
                  <input
                    required
                    value={selectedEvent.category}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <label className="block text-sm font-medium">
                  Ticket Capacity
                  <input
                    required
                    type="number"
                    min={selectedEvent.sold}
                    value={selectedEvent.capacity}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, capacity: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-600"
                  />
                </label>

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeDialog} className="rounded-lg border border-slate-300 px-4 py-2 text-sm">Cancel</button>
                  <button
                    type="submit"
                    onClick={() => {
                      if (selectedEvent.name.trim()) {
                        updateEvent(selectedEvent.id, selectedEvent);
                      }
                    }}
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
                    updateEvent(selectedEvent.id, {
                      status: selectedEvent.status === "Live" ? "Upcoming" : "Live",
                    });
                    closeDialog();
                    setNotice("Event status changed in local UI state.");
                  }}
                  className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50"
                >
                  Change status: {selectedEvent.status === "Live" ? "Upcoming" : "Live"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDialog();
                    setNotice("Connect this action to your event duplication API.");
                  }}
                  className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm hover:bg-slate-50"
                >
                  Duplicate event
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeDialog();
                    setNotice("Connect this action to your event cancellation API.");
                  }}
                  className="w-full rounded-lg border border-red-100 p-3 text-left text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel event
                </button>
              </div>
            ) : (
              <div>
                <img src={selectedEvent.image} alt={selectedEvent.name} className="h-48 w-full rounded-xl object-cover" />
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="mt-1 font-semibold">{selectedEvent.date}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Status</p>
                    <div className="mt-1"><StatusBadge status={selectedEvent.status} /></div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Tickets Sold</p>
                    <p className="mt-1 font-semibold">{selectedEvent.sold} / {selectedEvent.capacity}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Revenue</p>
                    <p className="mt-1 font-semibold">{formatCoins(selectedEvent.revenue)} Coins</p>
                  </div>
                </div>
                <button type="button" onClick={closeDialog} className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

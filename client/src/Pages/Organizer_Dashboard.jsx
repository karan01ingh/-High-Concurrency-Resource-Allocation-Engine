
import { useState } from "react";

const events = [
  {
    name: "Sunburn Festival 2026",
    category: "Music Festival",
    date: "15 - 17 Feb 2026",
    location: "Vagator Beach, Goa",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80",
    sold: 320,
    total: 500,
    status: "Live",
  },
  {
    name: "TechNext Conference",
    category: "Tech",
    date: "12 - 13 Mar 2026",
    location: "Bengaluru, India",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80",
    sold: 180,
    total: 300,
    status: "Upcoming",
  },
  {
    name: "Jabalpur Food Carnival",
    category: "Food & Drinks",
    date: "5 Oct 2026",
    location: "Jabalpur, India",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
    sold: 75,
    total: 200,
    status: "Upcoming",
  },
];

const bookings = [
  { event: "Sunburn Festival 2026", customer: "Rahul Mehta", tickets: 2, amount: 3000, date: "25 Sep 2026", status: "Confirmed", image: events[0].image },
  { event: "TechNext Conference", customer: "Priya Sharma", tickets: 1, amount: 2499, date: "24 Sep 2026", status: "Confirmed", image: events[1].image },
  { event: "Jabalpur Food Carnival", customer: "Aman Verma", tickets: 4, amount: 1196, date: "24 Sep 2026", status: "Confirmed", image: events[2].image },
  { event: "Sunburn Festival 2026", customer: "Neha Patil", tickets: 1, amount: 1500, date: "23 Sep 2026", status: "Confirmed", image: events[0].image },
  { event: "Stand-up Comedy Night", customer: "Karan Gupta", tickets: 2, amount: 1598, date: "22 Sep 2026", status: "Cancelled", image: events[1].image },
];

const sales = [
  { name: "Sunburn Festival 2026", sold: 320, total: 500, image: events[0].image },
  { name: "TechNext Conference", sold: 180, total: 300, image: events[1].image },
  { name: "Jabalpur Food Carnival", sold: 75, total: 200, image: events[2].image },
  { name: "Stand-up Comedy Night", sold: 45, total: 150, image: events[1].image },
];

const chartTickets = [80, 95, 145, 125, 170, 120, 145, 210, 220, 270, 205, 170, 250, 245, 300, 270, 255, 290, 280, 305, 335, 400];
const chartRevenue = [25, 40, 55, 45, 65, 48, 60, 85, 100, 135, 105, 80, 120, 125, 150, 140, 165, 150, 175, 155, 180, 220];

function Card({ children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold tracking-tight text-slate-900 sm:text-lg">
        {children}
      </h2>
      {action}
    </div>
  );
}

function ViewAll({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
    >
      View All →
    </button>
  );
}

function StatCard({ icon, label, value, subtitle, color, onClick }) {
  const palettes = {
    blue: "border-blue-100 bg-blue-50/70 text-blue-600",
    green: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
    amber: "border-amber-100 bg-amber-50/70 text-amber-600",
    purple: "border-purple-100 bg-purple-50/70 text-purple-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-w-0 rounded-xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${palettes[color]}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-2xl">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-600">{label}</p>
          <p className="mt-1 truncate text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span className="text-xl">›</span>
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-600">{subtitle}</p>
    </button>
  );
}

function SalesChart({ period }) {
  const width = 520;
  const height = 155;
  const left = 34;
  const right = 8;
  const top = 8;
  const bottom = 23;
  const max = 450;

  const points = (values) =>
    values
      .map((value, index) => {
        const x = left + (index / (values.length - 1)) * (width - left - right);
        const y = top + (1 - value / max) * (height - top - bottom);
        return `${x},${y}`;
      })
      .join(" ");

  const ticketPoints = points(chartTickets);
  const revenuePoints = points(chartRevenue);
  const lastX = width - right;

  return (
    <div className="min-w-0">
      <div className="mb-3 flex flex-wrap justify-end gap-4 text-xs text-slate-600">
        <span><span className="mr-2 inline-block size-2.5 rounded-full bg-emerald-600" />Tickets Sold</span>
        <span><span className="mr-2 inline-block size-2.5 rounded-full bg-blue-600" />Revenue (EventCoins)</span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`Ticket sales and EventCoin revenue for ${period}`}
        className="w-full overflow-visible"
      >
        {[0, 100, 200, 300, 400].map((value) => {
          const y = top + (1 - value / max) * (height - top - bottom);
          return (
            <g key={value}>
              <line x1={left} y1={y} x2={width - right} y2={y} stroke="#e7edf5" strokeWidth="1" />
              <text x={left - 7} y={y + 4} fontSize="10" textAnchor="end" fill="#64748b">{value}</text>
            </g>
          );
        })}

        {[0, 4, 9, 14, 19, 21].map((index, i) => {
          const x = left + (index / 21) * (width - left - right);
          return (
            <g key={index}>
              <line x1={x} y1={top} x2={x} y2={height - bottom} stroke="#f0f4f8" />
              <text x={x} y={height - 5} fontSize="10" textAnchor="middle" fill="#64748b">
                {["1 Sep", "7 Sep", "14 Sep", "21 Sep", "28 Sep", "30 Sep"][i]}
              </text>
            </g>
          );
        })}

        <polygon
          points={`${left},${height - bottom} ${ticketPoints} ${lastX},${height - bottom}`}
          fill="#10b981"
          opacity="0.10"
        />
        <polygon
          points={`${left},${height - bottom} ${revenuePoints} ${lastX},${height - bottom}`}
          fill="#3b82f6"
          opacity="0.10"
        />

        <polyline points={ticketPoints} fill="none" stroke="#059669" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        <polyline points={revenuePoints} fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />

        {chartTickets.map((value, index) => {
          const x = left + (index / (chartTickets.length - 1)) * (width - left - right);
          const y = top + (1 - value / max) * (height - top - bottom);
          return <circle key={`t-${index}`} cx={x} cy={y} r="2.5" fill="#059669" />;
        })}

        {chartRevenue.map((value, index) => {
          const x = left + (index / (chartRevenue.length - 1)) * (width - left - right);
          const y = top + (1 - value / max) * (height - top - bottom);
          return <circle key={`r-${index}`} cx={x} cy={y} r="2.5" fill="#2563eb" />;
        })}
      </svg>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [period, setPeriod] = useState("Last 30 Days");
  const [notice, setNotice] = useState("");
  const [activeSection, setActiveSection] = useState("Dashboard");

  function navigate(label) {
    setActiveSection(label);
    setNotice(`${label} selected. Connect this action to its page or API.`);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Organizer sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 lg:block">
          <div className="mb-7 flex items-center gap-3 px-2">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-950 text-center text-[10px] font-bold leading-tight text-white">
              SUNBURN<br />LIVE
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">Sunburn Live</p>
              <p className="mt-1 text-xs text-slate-500">Organizer Account</p>
              <button type="button" onClick={() => navigate("Profile")} className="mt-1 text-xs font-medium text-emerald-700 underline">
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
                onClick={() => navigate(label)}
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                  activeSection === label
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
              onClick={() => navigate("Logout")}
              className="mt-5 flex w-full items-center gap-4 px-4 py-3 text-sm font-medium text-red-500"
            >
              <span className="text-xl">⇥</span> Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-5">
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Organizer Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage your events, track performance, and grow your audience.
              </p>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-3 text-sm shadow-sm">
              <span>▦</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="max-w-36 bg-transparent outline-none"
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>This Year</option>
              </select>
            </label>
          </header>

          {notice && (
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              {notice}
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          {/* Statistics */}
          <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <StatCard icon="▦" label="Total Events" value="5" subtitle="3 Upcoming • 2 Completed" color="blue" onClick={() => navigate("My Events")} />
            <StatCard icon="♢" label="Total Tickets Sold" value="1,248" subtitle="↑ 12% from last month" color="green" onClick={() => navigate("Event Bookings")} />
            <StatCard icon="🟡" label="Total EventCoins Earned" value="3,84,500" subtitle="↑ 18% from last month" color="amber" onClick={() => navigate("Wallet & Payouts")} />
            <StatCard icon="♟" label="Total Attendees" value="1,152" subtitle="↑ 15% from last month" color="purple" onClick={() => navigate("Analytics")} />
          </div>

          {/* Events + sales */}
          <div className="mt-4 grid items-start gap-4 2xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.95fr)]">
            <Card>
              <SectionTitle action={<ViewAll onClick={() => navigate("My Events")} />}>
                Upcoming Events
              </SectionTitle>

              <div className="divide-y divide-slate-100">
                {events.map((event) => {
                  const percentage = Math.round((event.sold / event.total) * 100);
                  return (
                    <button
                      type="button"
                      key={event.name}
                      onClick={() => navigate(event.name)}
                      className="grid w-full grid-cols-[100px_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left first:pt-1 last:pb-1 sm:grid-cols-[142px_minmax(0,1fr)_auto]"
                    >
                      <img
                        src={event.image}
                        alt={event.name}
                        className="h-24 w-full rounded-lg object-cover"
                      />

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-bold">{event.name}</h3>
                          <span className="rounded-full bg-purple-100 px-2 py-1 text-[10px] font-semibold text-purple-700">
                            {event.category}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-slate-600">▦ &nbsp;{event.date}</p>
                        <p className="mt-1 text-xs text-slate-600">♧ &nbsp;{event.location}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="h-2 w-full max-w-56 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-xs text-slate-500">{event.sold} / {event.total} sold</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`rounded-full px-2.5 py-2 text-xs font-semibold ${event.status === "Live" ? "bg-emerald-100 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>
                          {event.status === "Live" ? "✚ Live" : event.status}
                        </span>
                        <span className="text-xl text-slate-500">›</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card>
              <SectionTitle>
                Sales Overview
              </SectionTitle>

              <SalesChart period={period} />

              <div className="mt-4">
                <SectionTitle action={<ViewAll onClick={() => navigate("Analytics")} />}>
                  Sales by Event
                </SectionTitle>

                <div className="space-y-3">
                  {sales.map((item) => {
                    const percentage = Math.round((item.sold / item.total) * 100);
                    return (
                      <div key={item.name} className="grid grid-cols-[36px_minmax(100px,1fr)_minmax(70px,1.2fr)_54px] items-center gap-2">
                        <img src={item.image} alt="" className="size-9 rounded-md object-cover" />
                        <p className="truncate text-xs font-medium">{item.name}</p>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                          <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
                        </div>
                        <p className="text-right text-xs font-semibold">{percentage}%</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Recent bookings + quick actions */}
          <div className="mt-4 grid items-start gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
            <Card>
              <SectionTitle action={<ViewAll onClick={() => navigate("Event Bookings")} />}>
                Recent Bookings
              </SectionTitle>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] border-collapse text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      {["#", "Event", "Customer", "Tickets", "Amount (Coins)", "Date", "Status"].map((heading) => (
                        <th key={heading} className="px-2 py-2 font-semibold">{heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr key={`${booking.customer}-${index}`} className="border-b border-slate-100 last:border-0">
                        <td className="px-2 py-3 text-slate-500">#{index + 1}</td>
                        <td className="px-2 py-3">
                          <div className="flex items-center gap-2">
                            <img src={booking.image} alt="" className="size-8 rounded-md object-cover" />
                            <span className="max-w-36 font-medium">{booking.event}</span>
                          </div>
                        </td>
                        <td className="px-2 py-3">{booking.customer}</td>
                        <td className="px-2 py-3">{booking.tickets}</td>
                        <td className="px-2 py-3 font-semibold">
                          <span className="text-amber-500">●</span> &nbsp;{booking.amount.toLocaleString("en-IN")}
                        </td>
                        <td className="whitespace-nowrap px-2 py-3 text-slate-500">{booking.date}</td>
                        <td className="px-2 py-3">
                          <span className={`rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${booking.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-600"}`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <SectionTitle>Quick Actions</SectionTitle>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["✚", "Create New Event", "Set up and publish your next event", "Create Event", "text-emerald-600"],
                  ["▦", "Manage Events", "View and edit your events", "My Events", "text-blue-600"],
                  ["▥", "View Analytics", "Detailed insights and reports", "Analytics", "text-violet-600"],
                  ["♢", "View Bookings", "Manage attendee bookings", "Event Bookings", "text-blue-600"],
                  ["▤", "Wallet & Payouts", "View earnings and withdrawals", "Wallet & Payouts", "text-slate-600"],
                  ["⚑", "Promote Event", "Reach more audience", "Promote Event", "text-violet-600"],
                ].map(([icon, title, description, destination, color]) => (
                  <button
                    type="button"
                    key={title}
                    onClick={() => navigate(destination)}
                    className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center transition hover:border-emerald-200 hover:bg-emerald-50"
                  >
                    <span className={`mb-2 text-2xl font-bold ${color}`}>{icon}</span>
                    <span className="text-xs font-bold">{title}</span>
                    <span className="mt-1 text-[11px] leading-4 text-slate-500">{description}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

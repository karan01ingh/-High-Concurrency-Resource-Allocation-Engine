
import { useState } from "react";

const bookings = [
  {
    id: "EH20260215001",
    name: "Sunburn Festival 2026",
    date: "15 - 17 Feb 2026",
    tickets: 2,
    amount: 3000,
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "EH20260312045",
    name: "TechNext Conference",
    date: "12 - 13 Mar 2026",
    tickets: 1,
    amount: 2499,
    status: "Upcoming",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "EH20261005012",
    name: "Jabalpur Food Carnival",
    date: "5 Oct 2026",
    tickets: 2,
    amount: 299,
    status: "Completed",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "EH20260325033",
    name: "Stand-up Comedy Night",
    date: "25 Mar 2026",
    tickets: 1,
    amount: 799,
    status: "Cancelled",
    image:
      "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=500&q=80",
  },
];

const transactions = [
  { date: "20 Sep 2026", description: "Booking - Sunburn Festival 2026", type: "Debit", amount: -3000, balance: 2000 },
  { date: "15 Sep 2026", description: "Coins Purchase", type: "Credit", amount: 5000, balance: 5000 },
  { date: "10 Sep 2026", description: "Booking - TechNext Conference", type: "Debit", amount: -2499, balance: 0 },
  { date: "5 Sep 2026", description: "Referral Reward", type: "Credit", amount: 500, balance: 2499 },
  { date: "1 Sep 2026", description: "Coins Purchase", type: "Credit", amount: 2000, balance: 1999 },
];

const categories = [
  { name: "Music", percent: 45, amount: 3300, color: "#9333ea" },
  { name: "Food & Drinks", percent: 20, amount: 1450, color: "#f59e0b" },
  { name: "Tech", percent: 15, amount: 1099, color: "#3b82f6" },
  { name: "Travel", percent: 12, amount: 876, color: "#10b981" },
  { name: "Comedy", percent: 8, amount: 572, color: "#ec4899" },
];

const monthlySpending = [
  ["Jan", 550],
  ["Feb", 1000],
  ["Mar", 550],
  ["Apr", 800],
  ["May", 800],
  ["Jun", 1550],
  ["Jul", 450],
  ["Aug", 550],
  ["Sep", 3000],
  ["Oct", 800],
  ["Nov", 1000],
  ["Dec", 1550],
];

const fmt = (n) => n.toLocaleString("en-IN");

function Coin({ large = false }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-yellow-300 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 font-bold text-white shadow-sm ${
        large ? "size-11 text-2xl" : "size-5 text-[10px]"
      }`}
    >
      $
    </span>
  );
}

function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-100 bg-white p-4 shadow-sm ${className}`}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight text-slate-900">{title}</h2>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="shrink-0 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
          >
            {action.label} →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Status({ status }) {
  const style = {
    Upcoming: "bg-emerald-100 text-emerald-800",
    Completed: "bg-blue-100 text-blue-800",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-semibold ${style[status] || style.Upcoming}`}>
      {status}
    </span>
  );
}

function SummaryCard({ icon, title, value, subtitle, tone = "blue", children, onClick }) {
  const tones = {
    green: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    blue: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
    purple: "border-purple-100 bg-gradient-to-br from-purple-50 to-white",
    amber: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    rose: "border-rose-100 bg-gradient-to-br from-rose-50 to-white",
  };

  return (
    <section className={`min-w-0 rounded-xl border p-3.5 ${tones[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/90 text-2xl shadow-sm">
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-600">{title}</p>
          <p className="mt-1 break-words text-lg font-extrabold leading-tight text-slate-950 sm:text-xl">
            {value}
          </p>
          {subtitle && <p className="mt-2 text-[10px] leading-4 text-slate-500">{subtitle}</p>}
        </div>
        {onClick && (
          <button type="button" onClick={onClick} aria-label={`Open ${title}`} className="text-xl text-slate-500">
            ›
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function SpendingChart() {
  const max = Math.max(...monthlySpending.map(([, value]) => value));

  return (
    <div className="mt-4">
      <div className="flex h-28 items-end justify-between gap-1 border-b border-slate-200 px-1">
        {monthlySpending.map(([month, value]) => (
          <div key={month} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <div
              title={`${month}: ${fmt(value)} Coins`}
              className={`w-full max-w-5 rounded-t-sm transition hover:opacity-75 ${
                month === "Sep" ? "bg-emerald-700" : "bg-emerald-200"
              }`}
              style={{ height: `${Math.max(5, (value / max) * 90)}%` }}
            />
            <span className="pb-1 text-[9px] text-slate-500">{month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBreakdown() {
  const total = categories.reduce((sum, category) => sum + category.percent, 0);
  let current = 0;
  const gradient = categories
    .map((category) => {
      const start = current;
      current += (category.percent / total) * 100;
      return `${category.color} ${start}% ${current}%`;
    })
    .join(", ");

  return (
    <div className="mt-3 grid grid-cols-[110px_minmax(0,1fr)] items-center gap-3">
      <div
        className="relative size-[106px] rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
        role="img"
        aria-label="Spending by category chart"
      >
        <div className="absolute inset-[22px] flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-sm font-extrabold">7,297</span>
          <span className="text-[10px] text-slate-500">Coins</span>
        </div>
      </div>

      <div className="min-w-0">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center justify-between gap-2 border-b border-slate-100 py-1.5 text-[10px] last:border-0">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="truncate">{category.name}</span>
            </span>
            <span className="shrink-0 text-slate-500">{category.percent}%</span>
            <strong className="shrink-0">{fmt(category.amount)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [period, setPeriod] = useState("This Year");
  const [notice, setNotice] = useState("");

  const showNotice = (message) => setNotice(message);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        {/* User navigation */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/80 px-3 py-5 lg:block">
          <div className="mb-8 flex items-center gap-3 px-2">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
              alt="Karan Singh"
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-bold">Karan Singh</p>
              <p className="mt-1 text-xs text-slate-500">karan@example.com</p>
              <button onClick={() => showNotice("Connect Edit Profile to your profile route.")} className="mt-1 text-xs text-emerald-700 underline">
                Edit Profile
              </button>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              ["⌂", "Dashboard"],
              ["♢", "My Bookings"],
              ["♔", "My Rewards"],
              ["▤", "Wallet & Coins"],
              ["♙", "Profile"],
              ["⚙", "Settings"],
            ].map(([icon, label]) => (
              <button
                key={label}
                onClick={() =>
                  label === "Dashboard"
                    ? window.scrollTo({ top: 0, behavior: "smooth" })
                    : showNotice(`${label} route can be connected here.`)
                }
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm ${
                  label === "Dashboard"
                    ? "bg-emerald-50 font-semibold text-emerald-800 ring-1 ring-emerald-100"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-xl">{icon}</span>
                {label}
              </button>
            ))}
            <button onClick={() => showNotice("Connect this button to your logout API.")} className="mt-5 flex w-full items-center gap-4 px-4 py-3 text-sm text-red-500">
              <span className="text-xl">⇥</span> Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-5">
          {/* Greeting */}
          <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, Karan! 👋
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Discover, book, and enjoy amazing events with EventHub.
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-sm xl:flex">
              <span className="text-2xl text-violet-500">❝</span>
              <div>
                <p className="text-sm font-bold">Life is better with live events!</p>
                <p className="mt-1 text-[11px] text-slate-500">Explore new experiences and create unforgettable memories.</p>
              </div>
            </div>
          </header>

          {notice && (
            <div role="status" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss">×</button>
            </div>
          )}

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-5">
            <SummaryCard icon={<Coin large />} title="Your EventCoins" value="2,000 Coins" tone="green" onClick={() => showNotice("Connect your wallet API.")}>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button onClick={() => showNotice("Connect the coin purchase flow.")} className="rounded-md bg-emerald-700 px-2 py-2 text-[11px] font-semibold text-white hover:bg-emerald-800">
                  ⊕ Buy Coins
                </button>
                <button onClick={() => showNotice("Connect your wallet transaction history.")} className="rounded-md border border-slate-200 bg-white px-2 py-2 text-[11px] font-semibold text-emerald-800">
                  ◷ View History
                </button>
              </div>
            </SummaryCard>

            <SummaryCard icon="🎟️" title="Total Bookings" value="6" subtitle="3 Upcoming • 2 Completed • 1 Cancelled" tone="blue" onClick={() => showNotice("Connect My Bookings page.")} />
            <SummaryCard icon="💳" title="Total Spending" value="7,297 Coins" subtitle="Across all your bookings" tone="purple" onClick={() => showNotice("View all spending details.")} />
            <SummaryCard icon="🎁" title="Rewards Earned" value="500 Coins" subtitle="From referrals & offers" tone="amber" onClick={() => showNotice("Connect your rewards page.")} />
            <SummaryCard icon="❤️" title="Favorite Categories" value="Music, Food, Travel" subtitle="Based on your activity" tone="rose" onClick={() => showNotice("Connect your favorite categories.")} />
          </div>

          {/* Main content columns */}
          <div className="mt-4 grid items-start gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,1fr)]">
            <div className="min-w-0 space-y-3">
              {/* Upcoming event */}
              <Panel title="Your Upcoming Event" action={{ label: "View All", onClick: () => showNotice("Connect the My Bookings page.") }}>
                <div className="grid gap-4 sm:grid-cols-[minmax(180px,0.95fr)_minmax(0,1.1fr)]">
                  <img
                    src={bookings[0].image}
                    alt={bookings[0].name}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold">{bookings[0].name}</h3>
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-[10px] font-semibold text-purple-700">Music Festival</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs leading-5">▦ &nbsp; {bookings[0].date}<span className="block pl-5 text-slate-500">Fri, 4:00 PM - Sun, 11:00 PM</span></p>
                      <p className="text-xs">♧ &nbsp; Vagator Beach, Goa, India</p>
                      <p className="text-xs">♢ &nbsp; General Pass × 2<span className="block pl-5 text-slate-500">Access to all 3 days • Standing</span></p>
                      <p className="flex items-center gap-2 pt-1 text-sm font-bold"><Coin /> 3,000 Coins</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button onClick={() => showNotice("Connect this button to your ticket details.")} className="rounded-lg bg-emerald-700 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-800">♢ View Ticket</button>
                      <button onClick={() => showNotice("Connect this button to the event details page.")} className="rounded-lg border border-emerald-700 px-3 py-2.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50">◎ Event Details</button>
                    </div>
                  </div>
                </div>
              </Panel>

              {/* Recent bookings */}
              <Panel title="Recent Bookings" action={{ label: "View All", onClick: () => showNotice("Connect the My Bookings page.") }}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[550px] text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {["Event", "Date", "Tickets", "Amount", "Status", "Action"].map((heading) => (
                          <th key={heading} className="px-2 py-2 font-medium">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-2 py-2">
                            <div className="flex items-center gap-2">
                              <img src={booking.image} alt="" className="size-10 rounded-md object-cover" />
                              <span className="max-w-36 font-medium">{booking.name}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-2 py-2 text-slate-500">{booking.date}</td>
                          <td className="px-2 py-2">{booking.tickets}</td>
                          <td className="whitespace-nowrap px-2 py-2">
                            <span className="inline-flex items-center gap-1 font-bold"><Coin /> {fmt(booking.amount)}</span>
                          </td>
                          <td className="px-2 py-2"><Status status={booking.status} /></td>
                          <td className="px-2 py-2">
                            <button onClick={() => showNotice(`Open booking ${booking.id}.`)} className="whitespace-nowrap rounded-md border border-emerald-700 px-2.5 py-1.5 font-semibold text-emerald-800 hover:bg-emerald-50">
                              {booking.status === "Cancelled" ? "View Details" : "View Ticket"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              {/* Invite banner */}
              <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-3xl">🎁</span>
                  <div>
                    <h2 className="text-lg font-extrabold text-emerald-800">Invite Friends & Earn EventCoins!</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-600">Get 500 EventCoins for every friend who signs up and books their first event.</p>
                  </div>
                </div>
                <button onClick={() => showNotice("Connect your referral link and sharing flow.")} className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                  Invite Now
                </button>
              </section>
            </div>

            {/* Right column */}
            <div className="min-w-0 space-y-3">
              <Panel title="Spending Overview">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Coin large />
                    <div>
                      <p className="text-xs text-slate-500">Total Spending</p>
                      <p className="text-xl font-extrabold">7,297 Coins</p>
                    </div>
                  </div>
                  <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] outline-none">
                    <option>This Year</option>
                    <option>Last 30 Days</option>
                    <option>Last 7 Days</option>
                  </select>
                </div>

                <SpendingChart />

                <h3 className="mt-5 text-xs font-bold">Spending by Category</h3>
                <CategoryBreakdown />
              </Panel>

              <Panel title="Recent EventCoins Transactions" action={{ label: "View All", onClick: () => showNotice("Connect wallet transaction history.") }}>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[430px] text-left text-[10px]">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        {["Date", "Description", "Type", "Amount", "Balance"].map((heading) => (
                          <th key={heading} className="px-1.5 py-2 font-medium">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={`${transaction.date}-${transaction.description}`} className="border-b border-slate-100 last:border-0">
                          <td className="whitespace-nowrap px-1.5 py-2 text-slate-500">{transaction.date}</td>
                          <td className="px-1.5 py-2">
                            <div className="flex items-center gap-1.5">
                              <Coin />
                              <span className="min-w-28">{transaction.description}</span>
                            </div>
                          </td>
                          <td className="px-1.5 py-2">
                            <span className={`rounded-md px-2 py-1 ${transaction.type === "Credit" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{transaction.type}</span>
                          </td>
                          <td className={`whitespace-nowrap px-1.5 py-2 font-bold ${transaction.amount > 0 ? "text-emerald-700" : "text-red-600"}`}>
                            {transaction.amount > 0 ? "+" : ""}{fmt(transaction.amount)}
                          </td>
                          <td className="whitespace-nowrap px-1.5 py-2 font-bold">{fmt(transaction.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

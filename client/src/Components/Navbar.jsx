
import { useState } from "react";

const navLinks = ["Home", "Events", "Categories", "About", "Contact"];

export default function Navbar() {
  const [activeLink, setActiveLink] = useState("Home");
  const [location, setLocation] = useState("Jabalpur");
  const [showLocations, setShowLocations] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-[68px] border-b border-slate-800 bg-[#020b1b] text-white">
      <div className="flex h-full items-center justify-between gap-5 px-5 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-3">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            className="h-9 w-9 text-emerald-400"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="5" y="9" width="30" height="26" rx="4" />
            <path d="M12 4v10M28 4v10M5 17h30M12 23h5M23 23h5M12 29h5" />
          </svg>
          <span className="text-2xl font-semibold tracking-tight">
            EventHub
          </span>
        </a>

        {/* Main navigation */}
        <nav className="hidden h-full items-center lg:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() => setActiveLink(link)}
              className={`flex h-full items-center border-b-2 px-3.5 text-sm transition ${
                activeLink === link
                  ? "border-emerald-400 text-white"
                  : "border-transparent text-slate-200 hover:text-emerald-300"
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex min-w-0 items-center gap-3 xl:gap-5">
          {/* Search */}
          <div className="relative hidden w-52 xl:block 2xl:w-64">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300"
            >
              <circle cx="10.8" cy="10.8" r="7" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            <input
              type="search"
              placeholder="Search users, events..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/90 py-2 pl-10 pr-3 text-xs text-white outline-none placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Location */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowLocations(!showLocations)}
              className="flex items-center gap-2 whitespace-nowrap text-sm hover:text-emerald-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {location}
              <span className="text-xs">⌄</span>
            </button>

            {showLocations && (
              <div className="absolute right-0 top-10 w-40 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl">
                {["Jabalpur", "Delhi", "Mumbai", "Bengaluru"].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setLocation(city);
                      setShowLocations(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-slate-800"
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coins */}
          <button className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm hover:border-emerald-500">
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-yellow-400 bg-amber-500 text-xs font-bold text-white">
              S
            </span>
            <span className="hidden xl:inline">2,000 Coins</span>
            <span className="xl:hidden">2,000</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-800"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-6 w-6"
              >
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
              <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border border-[#020b1b] bg-red-500" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-64 rounded-xl border border-slate-700 bg-slate-900 p-4 shadow-xl">
                <p className="font-semibold">Notifications</p>
                <p className="mt-2 text-sm text-slate-400">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>

          {/* Admin dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="flex items-center gap-2 whitespace-nowrap rounded-lg py-1.5 hover:text-emerald-300"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-slate-900">
                ⚙
              </span>
              <span className="hidden md:inline">Admin</span>
              <span className="hidden text-xs sm:inline">⌄</span>
            </button>

            {showAdmin && (
              <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 py-1 shadow-xl">
                {["Admin Profile", "Settings", "Logout"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setShowAdmin(false)}
                    className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-slate-800 ${
                      item === "Logout" ? "text-red-400" : "text-slate-200"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

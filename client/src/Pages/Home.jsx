
import { useState } from "react";
import EventSection from "../components/EventSection";
import { trendingEvents, nearbyEvents } from "../data/events";

const categories = [
  { name: "Music", icon: "♫", color: "text-fuchsia-400" },
  { name: "Tech", icon: "▣", color: "text-sky-400" },
  { name: "Food", icon: "♜", color: "text-orange-400" },
  { name: "Art", icon: "◉", color: "text-purple-400" },
  { name: "Sports", icon: "⚒", color: "text-emerald-400" },
  { name: "Workshops", icon: "◧", color: "text-red-400" },
  { name: "Comedy", icon: "☻", color: "text-yellow-400" },
  { name: "Business", icon: "▣", color: "text-blue-400" },
  { name: "Travel", icon: "✈", color: "text-cyan-400" },
  { name: "All Categories", icon: "⊞", color: "text-white" },
];

export default function Home() {
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Jabalpur");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  function handleFavorite(eventId) {
    setFavorites((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId]
    );
  }

  function matches(event) {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [event.name, event.category, event.location, event.title]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const matchesCategory =
      selectedCategory === "All Categories" ||
      [event.category, event.name, event.title]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(selectedCategory.toLowerCase())
        );

    const matchesLocation =
      !location ||
      location === "All Locations" ||
      [event.location, event.city]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(location.toLowerCase()));

    return matchesSearch && matchesCategory && matchesLocation;
  }

  const filteredTrending = trendingEvents.filter(matches);
  const filteredNearby = nearbyEvents.filter(matches);

  function handleSearch() {
    document.getElementById("event-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=2200&q=90')",
          }}
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/10" />

        <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-10 sm:px-8 sm:pt-14 lg:px-10">
          <div className="max-w-3xl">
            <div className="mb-5 h-1.5 w-10 rounded-full bg-emerald-400" />

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 sm:text-sm">
              Live Events | Real Experiences
            </p>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Discover Amazing Events Around You
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Find, book, and enjoy the best events — from tech conferences
              to music festivals, all in one place.
            </p>
          </div>

          {/* Search and location */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSearch();
            }}
            className="mt-6 flex max-w-3xl flex-col gap-2 rounded-xl bg-white p-2 text-slate-900 shadow-xl sm:flex-row sm:items-center"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="size-6 shrink-0 text-slate-500"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for events, cities, or interests..."
                className="h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
                aria-label="Search events"
              />
            </div>

            <div className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-48">
              <span className="text-lg text-slate-500">♧</span>
              <select
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full min-w-0 bg-transparent text-sm outline-none"
                aria-label="Select location"
              >
                <option>Jabalpur</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bengaluru</option>
                <option>Goa</option>
                <option>All Locations</option>
              </select>
            </div>

            <button
              type="submit"
              className="h-11 rounded-lg bg-emerald-700 px-8 text-sm font-bold text-white transition hover:bg-emerald-800 sm:min-w-36"
            >
              Search
            </button>
          </form>

          {/* Category chips */}
          <div className="mt-5 flex gap-2.5 overflow-x-auto pb-1">
            {categories.map((category) => {
              const active = selectedCategory === category.name;

              return (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2.5 text-xs font-medium transition sm:text-sm ${
                    active
                      ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                      : "border-white/20 bg-slate-950/40 text-white hover:border-white/50 hover:bg-white/10"
                  }`}
                >
                  <span className={`text-lg ${category.color}`}>
                    {category.icon}
                  </span>
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Event sections */}
      <div
        id="event-results"
        className="mx-auto max-w-[1440px] space-y-8 px-5 py-7 sm:px-8 lg:px-10"
      >
        <EventSection
          title="Trending Events"
          events={filteredTrending}
          favorites={favorites}
          onFavorite={handleFavorite}
          onViewAll={() => {
            setSelectedCategory("All Categories");
            setSearch("");
            setLocation("All Locations");
          }}
        />

        <EventSection
          title="Events Near You"
          events={filteredNearby}
          favorites={favorites}
          onFavorite={handleFavorite}
          onViewAll={() => {
            setSelectedCategory("All Categories");
            setSearch("");
            setLocation("All Locations");
          }}
        />
      </div>
    </main>
  );
}

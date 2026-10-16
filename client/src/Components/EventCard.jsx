
export default function EventCard({ event, onFavorite, isFavorite = false }) {
  const categoryColors = {
    Music: "bg-purple-600",
    Tech: "bg-blue-600",
    Comedy: "bg-amber-500",
    Travel: "bg-teal-600",
    "Food & Drinks": "bg-orange-500",
    Workshop: "bg-red-500",
    Wellness: "bg-emerald-600",
    "Live Music": "bg-pink-600",
  };

  const categoryColor =
    categoryColors[event.category] || "bg-slate-700";

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 transition hover:-translate-y-1 hover:shadow-lg">
      {/* Event image */}
      <div className="relative h-28 sm:h-32">
        <img
          src={event.image}
          alt={event.title}
          className="h-full w-full object-cover"
        />

        {/* Category badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold text-white ${categoryColor}`}
        >
          {event.category}
        </span>

        {/* Favorite button */}
        <button
          type="button"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          onClick={() => onFavorite?.(event.id)}
          className="absolute right-2 top-2 flex size-9 items-center justify-center rounded-full bg-black/40 text-2xl text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      {/* Event details */}
      <div className="p-3.5">
        <h3 className="truncate text-base font-bold text-slate-900">
          {event.title}
        </h3>

        <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
          <span>♧</span>
          <span className="truncate">{event.location}</span>
        </p>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-center gap-2 text-sm text-slate-500">
            <span>▦</span>
            <span className="truncate">{event.date}</span>
          </p>

          <p className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-bold text-emerald-800">
            <span className="flex size-6 items-center justify-center rounded-full border border-yellow-300 bg-amber-400 text-xs text-white">
              S
            </span>
            {event.coins.toLocaleString("en-IN")} Coins
          </p>
        </div>
      </div>
    </article>
  );
}

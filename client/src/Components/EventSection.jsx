
import EventCard from "./EventCard";

export default function EventSection({
  title,
  events,
  favorites,
  onFavorite,
  onViewAll,
}) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950">
          {title}
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="font-semibold text-emerald-700 hover:text-emerald-900"
        >
          View All <span className="ml-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isFavorite={favorites.includes(event.id)}
            onFavorite={onFavorite}
          />
        ))}
      </div>
    </section>
  );
}

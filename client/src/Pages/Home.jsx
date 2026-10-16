
import { useState } from "react";
import EventSection from "../components/EventSection";
import { trendingEvents, nearbyEvents } from "../data/events";

export default function Home() {
  const [favorites, setFavorites] = useState([]);

  function handleFavorite(eventId) {
    setFavorites((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId]
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero section and Navbar go above these sections */}

      <div className="mx-auto max-w-[1440px] space-y-1 px-5 py-5 lg:px-8">
        <EventSection
          title="Trending Events"
          events={trendingEvents}
          favorites={favorites}
          onFavorite={handleFavorite}
          onViewAll={() => console.log("View all trending events")}
        />

        <EventSection
          title="Events Near You"
          events={nearbyEvents}
          favorites={favorites}
          onFavorite={handleFavorite}
          onViewAll={() => console.log("View all nearby events")}
        />
      </div>
    </main>
  );
}

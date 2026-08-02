import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import EventCard from "../components/events/EventCard";
import api from "../utils/apiClient";


export default function Home() {
  // const featured = events.filter((e) => e.featured).slice(0, 3);
  
const [featured, setFeatured] = useState([]);

useEffect(() => {
const fetchFeaturedEvents = async () => {
  try {
    const response = await api.get("/events");
    setFeatured(response.data.events.slice(0, 3)); // adjust key to match
  } catch (error) {
    console.error("Error fetching featured events:", error);
  }
};
  fetchFeaturedEvents();
}, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink text-paper">
        <svg viewBox="0 0 1200 500" className="absolute inset-0 h-full w-full opacity-90" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="hero-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3F5A38" />
              <stop offset="60%" stopColor="#14150F" />
              <stop offset="100%" stopColor="#1A2417" />
            </linearGradient>
          </defs>
          <rect width="1200" height="500" fill="url(#hero-grad)" />
          <circle cx="1020" cy="90" r="260" fill="#F1EFE3" fillOpacity="0.04" />
          <circle cx="140" cy="460" r="220" fill="#E6532C" fillOpacity="0.07" />
        </svg>
        <div className="grain-overlay absolute inset-0 mix-blend-overlay" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <p className="eyebrow text-paper/60">Cactus Fashions &middot; Event Register</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight sm:text-6xl">
            Every runway, trunk show, and trade fair — <span className="italic text-sand-300">one seat at a time.</span>
          </h1>
          <p className="mt-6 max-w-lg text-paper/70">
            Browse the season&apos;s fashion calendar, hold your seat before capacity closes, and keep
            a running record of every show you&apos;ve attended.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/events">
              <Button variant="cactus" size="lg">
                Browse events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="border-paper/40 text-paper hover:bg-paper hover:text-ink">
                Create an account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">On the calendar</p>
            <h2 className="mt-1 font-display text-2xl">Featured this season</h2>
          </div>
          <Link to="/events" className="eyebrow text-cactus-600 hover:text-cactus-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-ink/15 bg-sand-100/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4">
          {[
            ["12", "live events"],
            ["6", "categories"],
            ["6", "cities covered"],
            ["24hr", "hold before release"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="font-display text-3xl text-cactus-600">{num}</div>
              <div className="eyebrow mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

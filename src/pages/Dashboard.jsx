import { Link } from "react-router-dom";
import { Calendar, History, Ticket, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingsContext";
import { formatDate } from "../lib/utils";
import EventCard from "../components/events/EventCard";

export default function Dashboard() {
  const { user } = useAuth();
  const { myBookings } = useBookings();

  const bookings = myBookings();
  const now = new Date();
  const upcoming = bookings
    .filter((b) => new Date(b.event.date) >= now)
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
  const past = bookings
    .filter((b) => new Date(b.event.date) < now)
    .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

  const stats = [
    { label: "Registered events", value: bookings.length, icon: Ticket },
    { label: "Upcoming", value: upcoming.length, icon: Calendar },
    { label: "Past events", value: past.length, icon: History },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-1 font-display text-3xl">{user?.name}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 border border-ink/15 p-5">
            <div className="flex h-10 w-10 items-center justify-center bg-cactus-50 text-cactus-600">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-2xl">{value}</div>
              <div className="eyebrow">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* upcoming */}
      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-xl">Upcoming events</h2>
          <Link to="/my-bookings" className="eyebrow text-cactus-600 hover:text-cactus-700">
            View all &rarr;
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming registrations yet." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.slice(0, 3).map((b) => (
              <EventCard key={b.id} event={b.event} />
            ))}
          </div>
        )}
      </section>

      {/* past history */}
      <section className="mt-12">
        <h2 className="mb-5 font-display text-xl">Past event history</h2>
        {past.length === 0 ? (
          <EmptyState message="You haven't attended any events yet." />
        ) : (
          <div className="divide-y divide-ink/10 border-t border-ink/10">
            {past.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-display text-lg">{b.event.title || b.event.name}</div>
                  <div className="text-xs text-muted">
                    {formatDate(b.event.date)} &middot; {b.event.venue}, {b.event.location}
                  </div>
                </div>
                <Link to={`/events/${b.event._id || b.event.id}`} className="eyebrow text-cactus-600 hover:text-cactus-700">
                  Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="border border-dashed border-ink/20 py-14 text-center">
      <p className="text-sm text-muted">{message}</p>
      <Link to="/events" className="mt-3 inline-flex items-center gap-1 text-sm text-cactus-600 underline underline-offset-4">
        Browse events <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

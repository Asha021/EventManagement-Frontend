import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useBookings } from "../context/BookingsContext";
import { formatDate, formatTime } from "../lib/utils";

export default function MyBookings() {
  const { myBookings, cancelRegistration } = useBookings();
  const bookings = myBookings();
  const now = new Date();

  const upcoming = bookings
    .filter((b) => new Date(b.event.date) >= now)
    .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
  const past = bookings
    .filter((b) => new Date(b.event.date) < now)
    .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <p className="eyebrow">Your register</p>
      <h1 className="mt-1 font-display text-3xl">My bookings</h1>

      <Tabs defaultValue="upcoming" className="mt-8">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <BookingList bookings={upcoming} onCancel={cancelRegistration} cancellable />
        </TabsContent>
        <TabsContent value="past">
          <BookingList bookings={past} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingList({ bookings, onCancel, cancellable }) {
  if (bookings.length === 0) {
    return (
      <div className="border border-dashed border-ink/20 py-16 text-center">
        <p className="text-sm text-muted">Nothing here yet.</p>
        <Link to="/events" className="mt-3 inline-block text-sm text-cactus-600 underline underline-offset-4">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink/10 border-t border-ink/10">
      {bookings.map((b) => (
        <div key={b.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="cactus">{b.event.category}</Badge>
              <span className="font-mono text-[10px] text-muted">{b.event.id}</span>
            </div>
            <Link to={`/events/${b.event.id}`} className="font-display text-lg hover:text-cactus-600">
              {b.event.name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> {formatDate(b.event.date)} &middot; {formatTime(b.event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {b.event.venue}, {b.event.location}
              </span>
            </div>
          </div>
          {cancellable && (
            <Button variant="outline" size="sm" onClick={() => onCancel(b.event.id)}>
              Cancel
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

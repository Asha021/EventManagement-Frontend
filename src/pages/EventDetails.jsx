import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { MapPin, Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import EventThumb from "../components/events/EventThumb";
import SeatGauge from "../components/events/SeatGauge";
import { useAuth } from "../context/AuthContext";
import { useBookings } from "../context/BookingsContext";
import { formatDate, formatTime } from "../lib/utils";
import API from "../utils/API";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isRegistered, registerForEvent, cancelRegistration } = useBookings();
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.get(`/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch((err) => console.error("Error fetching event:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-5 py-24 text-center"><p className="font-display text-2xl">Loading event...</p></div>;
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="font-display text-2xl">Event not found</p>
        <Link to="/events" className="mt-4 inline-block text-cactus-600 underline underline-offset-4">
          Back to events
        </Link>
      </div>
    );
  }

  const registered = isRegistered(event._id || event.id);
  const available = event.availableSeats || 0;
  const full = available === 0;

  function handleRegister() {
    if (!user) {
      navigate("/login", { state: { from: { pathname: `/events/${event._id || event.id}` } } });
      return;
    }
    setBusy(true);
    API.post(`/registrations/${event._id || event.id}`)
      .then(() => {
        const res = registerForEvent(event._id || event.id);
        setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats - 1 }));
        setBusy(false);
        setMessage(res.ok ? { type: "success", text: "You're registered for this event." } : { type: "error", text: res.error });
      })
      .catch((err) => {
        setBusy(false);
        setMessage({ type: "error", text: err.response?.data?.message || "Registration failed" });
      });
  }

  function handleCancel() {
    setBusy(true);
    API.put(`/registrations/${event._id || event.id}`)
      .then(() => {
        const res = cancelRegistration(event._id || event.id);
        setEvent(prev => ({ ...prev, availableSeats: prev.availableSeats + 1 }));
        setBusy(false);
        setMessage(res.ok ? { type: "success", text: "Registration cancelled." } : { type: "error", text: res.error });
      })
      .catch((err) => {
        setBusy(false);
        setMessage({ type: "error", text: err.response?.data?.message || "Cancellation failed" });
      });
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <Link to="/events" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to events
      </Link>

      <EventThumb event={event} className="mt-5 h-56 w-full sm:h-72" />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="cactus">{event.category}</Badge>
        {event.price === 0 ? <Badge variant="sand">Free</Badge> : (event.price ? <Badge variant="outline">₹{event.price}</Badge> : null)}
        <span className="ml-auto font-mono text-xs text-muted">{event._id || event.id}</span>
      </div>

      <h1 className="mt-3 font-display text-3xl sm:text-4xl">{event.title || event.name}</h1>
      <p className="mt-1 text-sm text-muted">Organized by {event.organizer}</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <p className="eyebrow mb-2">About this event</p>
          <p className="text-ink/80 leading-relaxed">{event.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {(event.tags || []).map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-8 grid gap-4 border-t border-ink/15 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-2 text-sm">
              <Calendar className="mt-0.5 h-4 w-4 text-cactus-500" />
              <div>
                <div className="text-ink">{formatDate(event.date, { weekday: "long" })}</div>
                <div className="text-muted">Date</div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Clock className="mt-0.5 h-4 w-4 text-cactus-500" />
              <div>
                <div className="text-ink">{formatTime(event.date)}</div>
                <div className="text-muted">Time</div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 text-cactus-500" />
              <div>
                <div className="text-ink">{event.venue}</div>
                <div className="text-muted">{event.location}</div>
              </div>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Users className="mt-0.5 h-4 w-4 text-cactus-500" />
              <div>
                <div className="text-ink">{event.capacity} total capacity</div>
                <div className="text-muted">Venue size</div>
              </div>
            </div>
          </div>
        </div>

        {/* booking panel */}
        <div className="h-fit border border-ink/15 p-5">
          <SeatGauge event={event} />
          <div className="mt-5">
            {registered ? (
              <Button variant="outline" className="w-full" onClick={handleCancel} disabled={busy}>
                {busy ? "Cancelling…" : "Cancel registration"}
              </Button>
            ) : (
              <Button
                variant={full ? "outline" : "cactus"}
                className="w-full"
                onClick={handleRegister}
                disabled={full || busy}
              >
                {busy ? "Registering…" : full ? "Sold out" : "Register for this event"}
              </Button>
            )}
          </div>
          {message && (
            <p
              className={`mt-3 text-xs ${
                message.type === "success" ? "text-cactus-600" : "text-bloom-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

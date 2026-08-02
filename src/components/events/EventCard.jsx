import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import EventThumb from "./EventThumb";
import SeatGauge from "./SeatGauge";
import { formatDate, formatTime } from "../../lib/utils";

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event._id || event.id}`}
      className="group block border border-ink/15 bg-paper transition-shadow hover:shadow-[0_4px_0_0_rgba(20,21,15,0.15)]"
    >
      <EventThumb event={event} className="h-40 w-full" />

      <div className="">
        {/* main info zone */}
        <div className="flex-1 p-4">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant="cactus">{event.category}</Badge>
            {event.price === 0 && <Badge variant="sand">Free</Badge>}
          </div>
          <h3 className="font-display  truncate text-lg leading-snug group-hover:text-cactus-600   transition-colors">
            {event.title || event.name}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{event.organizer}</p>

          <div className="mt-3 space-y-1 text-xs text-ink/70">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cactus-500" />
              {formatDate(event.date)} &middot; {formatTime(event.date)}
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-cactus-500" />
              {event.venue} {event.location}
            </div>
          </div>

          <SeatGauge event={event} className="mt-4" />
        </div>

        {/* perforated ticket stub zone */}
        {/* <div className="relative flex w-16 flex-col items-center justify-center border-l border-dashed border-ink/25 px-2 py-3">
          <span
            className="font-mono text-[10px] tracking-widest2 text-muted"
            style={{ writingMode: "vertical-rl" }}
          >
            {event._id || event.id}
          </span>
        </div> */}
      </div>
    </Link>
  );
}

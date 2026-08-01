import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Users, Calendar as CalIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";
import { useBookings } from "../context/BookingsContext";
import { formatDate, formatTime } from "../lib/utils";
import { seatsLeft } from "../data/events";

export default function AdminDashboard() {
  const { events, bookings, deleteEvent } = useBookings();
  const [target, setTarget] = useState(null);

  const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0);

  const stats = [
    { label: "Total events", value: events.length },
    { label: "Total registrations", value: bookings.length },
    { label: "Aggregate capacity", value: totalCapacity },
    { label: "Seats filled", value: `${Math.round((totalRegistered / totalCapacity) * 100) || 0}%` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-1 font-display text-3xl">Manage events</h1>
        </div>
        <Link to="/admin/events/new">
          <Button variant="cactus">
            <Plus className="h-4 w-4" /> New event
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-ink/15 p-4">
            <div className="font-display text-2xl">{s.value}</div>
            <div className="eyebrow mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-10 overflow-x-auto border border-ink/15">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/15 bg-sand-100/60">
            <tr>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">Event</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">Category</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">Date</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">Seats</th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest2 text-muted">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="p-3">
                  <div className="font-display">{event.name}</div>
                  <div className="text-xs text-muted">{event.organizer}</div>
                </td>
                <td className="p-3">
                  <Badge variant="cactus">{event.category}</Badge>
                </td>
                <td className="p-3 text-xs text-ink/70">
                  <div className="flex items-center gap-1.5">
                    <CalIcon className="h-3.5 w-3.5 text-muted" />
                    {formatDate(event.date)} &middot; {formatTime(event.date)}
                  </div>
                </td>
                <td className="p-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted" />
                    {event.registered}/{event.capacity}
                    {seatsLeft(event) === 0 && (
                      <Badge variant="bloom" className="ml-1">
                        Full
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/events/${event.id}/edit`}>
                      <Button variant="ghost" size="icon" aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete"
                      onClick={() => setTarget(event)}
                    >
                      <Trash2 className="h-4 w-4 text-bloom-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete event?</DialogTitle>
            <DialogDescription>
              This removes &ldquo;{target?.name}&rdquo; and all of its registrations. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteEvent(target.id);
                setTarget(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

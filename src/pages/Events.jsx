import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import EventCard from "../components/events/EventCard";
import { useBookings } from "../context/BookingsContext";
import { categories, locations } from "../data/events";

const PAGE_SIZE = 6;

export default function Events() {
  const { events } = useBookings();
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  const search = params.get("q") || "";
  const category = params.get("category") || "all";
  const location = params.get("location") || "all";
  const page = Number(params.get("page") || "1");

  // simulate dynamic retrieval when filters change
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [search, category, location, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  const filtered = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.organizer.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "all" || e.category === category;
      const matchesLocation = location === "all" || e.location === location;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [events, search, category, location]);

  const visible = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < filtered.length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Discover</p>
      <h1 className="mt-1 font-display text-3xl">Browse events</h1>

      {/* filters */}
      <div className="mt-8 flex flex-col gap-3 border border-ink/15 bg-paper p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Search by name, organizer, or tag…"
            value={search}
            onChange={(e) => updateParam("q", e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={(v) => updateParam("category", v)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={(v) => updateParam("location", v)}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {filtered.length} event{filtered.length === 1 ? "" : "s"} match your filters
      </div>

      {/* results */}
      <div className="mt-6">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[22rem] animate-pulse border border-ink/10 bg-ink/5" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="border border-dashed border-ink/20 py-20 text-center">
            <p className="font-display text-xl">No events match those filters</p>
            <p className="mt-2 text-sm text-muted">Try clearing a filter or searching a different term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={() => updateParam("page", String(page + 1))}>
            Load more events
          </Button>
        </div>
      )}
    </div>
  );
}

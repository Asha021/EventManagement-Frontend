import { useEffect, useState } from "react";
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
import API from "../utils/api";

const PAGE_SIZE = 6;

export default function Events() {
  const [params, setParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // categories/locations for the dropdown lists — fetched once, separately,
  // since the main /events call now only returns the current page
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);

  const search = params.get("q") || "";
  const category = params.get("category") || "all";
  const location = params.get("location") || "all";
  const date = params.get("date") || "";
  const page = Number(params.get("page") || "1");

  // Debounce the search text so we don't fire a request on every keystroke
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch filter option lists once
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await API.get("/events/filters"); // { categories: [...], locations: [...] }
        setCategoryOptions(res.data.categories || []);
        setLocationOptions(res.data.locations || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };
    fetchFilters();
  }, []);

  // Fetch events from the server whenever any filter/page changes
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await API.get("/events", {
          params: {
            q: debouncedSearch,
            category,
            location,
            date,
            page,
            limit: PAGE_SIZE,
          },
        });

        setTotal(res.data.total ?? 0);
        setHasMore(Boolean(res.data.hasMore));

        setEvents((prev) =>
          page === 1 ? res.data.events : [...prev, ...res.data.events]
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [debouncedSearch, category, location, date, page]);

  function updateParam(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "all") {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  function updateParams(updates) {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") next.delete(key);
      else next.set(key, value);
    });
    next.delete("page");
    setParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Discover</p>
      <h1 className="mt-1 font-display text-3xl">Browse Events</h1>

      <div className="mt-8 flex flex-col gap-3 border border-ink/15 bg-paper p-4 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Search events..."
            value={search}
            onChange={(e) => updateParam("q", e.target.value)}
          />
        </div>

        {/* Category */}
        <Select value={category} onValueChange={(v) => updateParam("category", v)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={location} onValueChange={(v) => updateParam("location", v)}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {locationOptions.map((l) => (
              <SelectItem key={l} value={l}>
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date */}
        <Input
          type="date"
          className="sm:w-44"
          value={date}
          onChange={(e) => updateParam("date", e.target.value)}
        />

        {/* Clear All */}
        <Button
          variant="outline"
          onClick={() =>
            updateParams({ q: "", category: "all", location: "all", date: "" })
          }
        >
          Clear All
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        {total} Events Found
      </div>

      <div className="mt-6">
        {loading && page === 1 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[22rem] animate-pulse border border-ink/10 bg-ink/5"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-ink/20 py-20 text-center">
            <h2 className="text-xl font-semibold">No Events Found</h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      {hasMore && !loading && (
        <div className="mt-10 flex justify-center">
          <Button variant="outline" onClick={() => updateParam("page", String(page + 1))}>
            Load More Events
          </Button>
        </div>
      )}
    </div>
  );
}
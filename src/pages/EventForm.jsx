import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useBookings } from "../context/BookingsContext";
import { categories, locations } from "../data/events";

const emptyForm = {
  name: "",
  organizer: "",
  category: categories[0],
  location: locations[0],
  venue: "",
  date: "",
  time: "",
  description: "",
  capacity: "",
  price: "",
  tags: "",
};

export default function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { events, addEvent, updateEvent } = useBookings();
  const [form, setForm] = useState(emptyForm);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const ev = events.find((e) => e.id === id);
      if (ev) {
        const d = new Date(ev.date);
        setForm({
          name: ev.name,
          organizer: ev.organizer,
          category: ev.category,
          location: ev.location,
          venue: ev.venue,
          date: d.toISOString().slice(0, 10),
          time: d.toTimeString().slice(0, 5),
          description: ev.description,
          capacity: String(ev.capacity),
          price: String(ev.price),
          tags: ev.tags.join(", "),
        });
      }
    }
  }, [isEdit, id, events]);

  function handleChange(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      organizer: form.organizer,
      category: form.category,
      location: form.location,
      venue: form.venue,
      date: new Date(`${form.date}T${form.time || "10:00"}`).toISOString(),
      description: form.description,
      capacity: Number(form.capacity) || 0,
      price: Number(form.price) || 0,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: "custom",
      featured: false,
    };

    if (isEdit) {
      updateEvent(id, payload);
    } else {
      addEvent({ ...payload, registered: 0 });
    }
    setSaved(true);
    setTimeout(() => navigate("/admin"), 500);
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <Link to="/admin" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
      </Link>

      <p className="eyebrow mt-5">{isEdit ? "Edit event" : "New event"}</p>
      <h1 className="mt-1 font-display text-3xl">{isEdit ? "Update event details" : "Create an event"}</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Event name</Label>
          <Input id="name" required value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </div>
        <div>
          <Label htmlFor="organizer">Organizer</Label>
          <Input
            id="organizer"
            required
            value={form.organizer}
            onChange={(e) => handleChange("organizer", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => handleChange("category", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Location</Label>
            <Select value={form.location} onValueChange={(v) => handleChange("location", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locations.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" required value={form.venue} onChange={(e) => handleChange("venue", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              required
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              required
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={(e) => handleChange("capacity", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₹, 0 = free)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => handleChange("tags", e.target.value)}
            placeholder="Resortwear, Flagship, Press Invited"
          />
        </div>

        <Button type="submit" variant="cactus" className="w-full">
          {saved ? "Saved ✓" : isEdit ? "Save changes" : "Create event"}
        </Button>
      </form>
    </div>
  );
}

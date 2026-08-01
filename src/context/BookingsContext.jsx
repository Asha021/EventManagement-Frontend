import React, { createContext, useContext, useEffect, useState } from "react";
import { events as seedEvents } from "../data/events";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext(null);

const EVENTS_KEY = "cf_events_state";
const BOOKINGS_KEY = "cf_bookings";

function loadEvents() {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (stored) return JSON.parse(stored);
  return seedEvents;
}

function loadBookings() {
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function BookingsProvider({ children }) {
  const { user } = useAuth();
  const [eventsState, setEventsState] = useState(loadEvents);
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsState));
  }, [eventsState]);

  useEffect(() => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }, [bookings]);

  function isRegistered(eventId) {
    if (!user) return false;
    return bookings.some((b) => b.eventId === eventId && b.userId === user.id);
  }

  function myBookings() {
    if (!user) return [];
    return bookings
      .filter((b) => b.userId === user.id)
      .map((b) => ({ ...b, event: eventsState.find((e) => e.id === b.eventId) }))
      .filter((b) => b.event);
  }

  function registerForEvent(eventId) {
    if (!user) return { ok: false, error: "Please log in to register." };
    const ev = eventsState.find((e) => e.id === eventId);
    if (!ev) return { ok: false, error: "Event not found." };
    if (isRegistered(eventId)) return { ok: false, error: "Already registered." };
    if (ev.registered >= ev.capacity) return { ok: false, error: "This event is fully booked." };

    setEventsState((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registered: e.registered + 1 } : e))
    );
    setBookings((prev) => [
      ...prev,
      {
        id: `BKG-${Date.now()}`,
        eventId,
        userId: user.id,
        registeredAt: new Date().toISOString(),
        status: "confirmed",
      },
    ]);
    return { ok: true };
  }

  function cancelRegistration(eventId) {
    if (!user) return { ok: false, error: "Please log in." };
    const booking = bookings.find((b) => b.eventId === eventId && b.userId === user.id);
    if (!booking) return { ok: false, error: "No registration found." };

    setEventsState((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, registered: Math.max(e.registered - 1, 0) } : e))
    );
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    return { ok: true };
  }

  function addEvent(newEvent) {
    setEventsState((prev) => [
      { ...newEvent, id: `EVT-${Date.now()}`, registered: 0 },
      ...prev,
    ]);
  }

  function updateEvent(eventId, patch) {
    setEventsState((prev) => prev.map((e) => (e.id === eventId ? { ...e, ...patch } : e)));
  }

  function deleteEvent(eventId) {
    setEventsState((prev) => prev.filter((e) => e.id !== eventId));
    setBookings((prev) => prev.filter((b) => b.eventId !== eventId));
  }

  return (
    <BookingsContext.Provider
      value={{
        events: eventsState,
        bookings,
        isRegistered,
        myBookings,
        registerForEvent,
        cancelRegistration,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingsContext);
  if (!ctx) throw new Error("useBookings must be used within BookingsProvider");
  return ctx;
}

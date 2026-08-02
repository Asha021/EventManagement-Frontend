import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const BookingsContext = createContext(null);

const EVENTS_KEY = "cf_events_state";

function loadEvents() {
  const stored = localStorage.getItem(EVENTS_KEY);
  if (stored) return JSON.parse(stored);
  return [];
}

export function BookingsProvider({ children }) {
  const { user } = useAuth();
  const [eventsState, setEventsState] = useState(loadEvents);
  const [backendBookings, setBackendBookings] = useState([]);

  useEffect(() => {
    import("../utils/API").then(({ default: API }) => {
      API.get("/events")
        .then((res) => {
          if (res.data?.events) {
            setEventsState((prev) => {
              const merged = [...prev];
              res.data.events.forEach((apiEvent) => {
                const existingIndex = merged.findIndex((e) => (e._id || e.id) === (apiEvent._id || apiEvent.id));
                if (existingIndex > -1) {
                  merged[existingIndex] = { ...merged[existingIndex], ...apiEvent };
                } else {
                  merged.push(apiEvent);
                }
              });
              return merged;
            });
          }
        })
        .catch((err) => console.error("Failed to load backend events for context:", err));
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(eventsState));
  }, [eventsState]);

  const fetchMyBookings = () => {
    if (user) {
      import("../utils/API").then(({ default: API }) => {
        API.get("/registrations/my-events")
          .then((res) => {
             const formatted = res.data.map(b => ({
               id: b._id,
               eventId: b.event._id || b.event.id,
               userId: b.user,
               status: b.status,
               event: b.event
             }));
             setBackendBookings(formatted);
          })
          .catch(err => console.error(err));
      });
    } else {
      setBackendBookings([]);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user]);

  function isRegistered(eventId) {
    if (!user) return false;
    return backendBookings.some((b) => b.eventId === eventId);
  }

  function myBookings() {
    return backendBookings;
  }

  function registerForEvent(eventId) {
    if (!user) return { ok: false, error: "Please log in to register." };
    // This is called AFTER successful API post in EventDetails
    fetchMyBookings(); // Refetch from backend
    return { ok: true };
  }

  function cancelRegistration(eventId) {
    if (!user) return { ok: false, error: "Please log in." };
    // This is called AFTER successful API put in EventDetails/MyBookings
    setBackendBookings((prev) => prev.filter((b) => b.eventId !== eventId));
    return { ok: true };
  }

  function addEvent(newEvent) {
    setEventsState((prev) => [
      { ...newEvent, id: `EVT-${Date.now()}`, registered: 0 },
      ...prev,
    ]);
  }

  function updateEvent(eventId, patch) {
    setEventsState((prev) => prev.map((e) => ((e._id || e.id) === eventId ? { ...e, ...patch } : e)));
  }

  function deleteEvent(eventId) {
    setEventsState((prev) => prev.filter((e) => (e._id || e.id) !== eventId));
    // Bookings delete handled backend side usually, but we can clear local just in case
    setBackendBookings((prev) => prev.filter((b) => b.eventId !== eventId));
  }

  return (
    <BookingsContext.Provider
      value={{
        events: eventsState,
        bookings: backendBookings, // Provide mapping for AdminDashboard if used
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

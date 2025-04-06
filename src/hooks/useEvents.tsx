import { useState, useEffect } from "react";
import { Event } from "@/types/events";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const EVENTS_STORAGE_KEY = "app_events_data";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadEvents = () => {
      setIsLoading(true);
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          const eventsWithDates = parsedEvents.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
            // Mantieni il valore di assignedPersonnel se esiste già
            assignedPersonnel: event.assignedPersonnel || 0
          }));
          setEvents(eventsWithDates);
        } catch (error) {
          console.error("Errore nel caricamento degli eventi:", error);
          setDefaultEvents();
        }
      } else {
        setDefaultEvents();
      }
      
      setIsLoading(false);
    };

    const setDefaultEvents = () => {
      setEvents([
        {
          id: 1,
          title: "Concerto Rock in Roma",
          client: "Rock Productions",
          startDate: new Date(2023, 6, 15, 18, 0),
          endDate: new Date(2023, 6, 15, 23, 30),
          personnelTypes: ["security", "doorman", "hostess/steward"],
          assignedPersonnel: 0
        },
        {
          id: 2,
          title: "Fiera del Libro",
          client: "MediaGroup",
          startDate: new Date(2023, 7, 10, 9, 0),
          endDate: new Date(2023, 7, 12, 19, 0),
          personnelTypes: ["security", "hostess/steward"],
          assignedPersonnel: 0
        },
      ]);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const handleCreateEvent = () => {
    return "/events/create";
  };
  
  const handleEditEvent = (eventId: number) => {
    return `/events/create?id=${eventId}`;
  };
  
  const handleDeleteEvent = (eventId: number) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    toast.success("Evento eliminato con successo");
  };

  return {
    events,
    setEvents,
    isLoading,
    handleCreateEvent,
    handleEditEvent,
    handleDeleteEvent
  };
}


import { useState } from "react";
import { Event } from "@/types/events";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { updateOperatorsForClosedEvent } from "@/utils/eventUtils";

export function useEventDetail(events: Event[], setEvents: React.Dispatch<React.SetStateAction<Event[]>>) {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);

  const handleShowDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  const handleCloseEvent = async (eventId: number) => {
    setIsClosingEvent(true);
    
    try {
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return { ...event, status: 'completed' };
        }
        return event;
      });
      
      setEvents(updatedEvents);
      localStorage.setItem("app_events_data", JSON.stringify(updatedEvents));
      
      try {
        const { error: updateError } = await supabase
          .from('events')
          .update({ status: 'completed' })
          .eq('id', eventId);
          
        if (updateError) {
          console.error("Errore durante l'aggiornamento dell'evento nel database:", updateError);
        }
      } catch (dbError) {
        console.error("Errore nella comunicazione con il database:", dbError);
      }
      
      const eventToClose = updatedEvents.find(e => e.id === eventId);
      
      if (eventToClose) {
        await updateOperatorsForClosedEvent(eventId, eventToClose, supabase);
        
        toast.success("Evento chiuso e paghe aggiornate con successo!");
        
        setIsDetailsOpen(false);
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error("Errore durante la chiusura dell'evento:", error);
      toast.error("Si è verificato un errore durante la chiusura dell'evento");
    } finally {
      setIsClosingEvent(false);
    }
  };

  return {
    selectedEvent,
    isDetailsOpen,
    isClosingEvent,
    setIsDetailsOpen,
    handleShowDetails,
    handleCloseEvent
  };
}

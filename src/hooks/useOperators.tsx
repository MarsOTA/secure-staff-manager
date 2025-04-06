
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Event } from "@/types/events";
import { EVENTS_STORAGE_KEY } from "@/hooks/useEvents";

export interface Operator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  assignedEvents?: number[]; // IDs degli eventi assegnati
}

export const OPERATORS_STORAGE_KEY = "app_operators_data";

export const useOperators = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@example.com",
      phone: "+39 098 765 4321",
      status: "inactive",
      assignedEvents: [],
    },
  ]);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOperators = () => {
      const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
      if (storedOperators) {
        try {
          setOperators(JSON.parse(storedOperators));
        } catch (error) {
          console.error("Errore nel caricamento degli operatori:", error);
        }
      } else {
        localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
      }
      
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          const eventsWithDates = parsedEvents.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }));
          setEvents(eventsWithDates);
        } catch (error) {
          console.error("Errore nel caricamento degli eventi:", error);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
      
      setIsLoading(false);
    };
    
    loadOperators();
  }, []);
  
  useEffect(() => {
    localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
  }, [operators]);
  
  const handleStatusToggle = (id: number) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      )
    );
    toast.success("Stato operatore aggiornato con successo");
  };

  const handleDelete = (id: number) => {
    setOperators((prev) => prev.filter((op) => op.id !== id));
    toast.success("Operatore eliminato con successo");
  };
  
  const assignOperatorToEvent = (operatorId: number, eventId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator) {
      toast.error("Operatore non trovato");
      return false;
    }
    
    const currentAssignedEvents = operator.assignedEvents || [];
    if (currentAssignedEvents.includes(eventId)) {
      toast.info("Operatore già assegnato a questo evento");
      return false;
    }
    
    setOperators((prev) => {
      const updatedOperators = prev.map((op) => {
        if (op.id === operatorId) {
          return {
            ...op,
            assignedEvents: [...currentAssignedEvents, eventId]
          };
        }
        return op;
      });
      
      localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
      return updatedOperators;
    });
    
    // Aggiorna il conteggio degli operatori assegnati nell'evento
    setEvents((prevEvents) => {
      const updatedEvents = prevEvents.map((event) => {
        if (event.id === eventId) {
          // Incrementa il conteggio degli operatori assegnati
          const currentAssigned = event.assignedPersonnel || 0;
          return {
            ...event,
            assignedPersonnel: currentAssigned + 1
          };
        }
        return event;
      });
      
      // Salva gli eventi aggiornati in localStorage
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      return updatedEvents;
    });
    
    return true;
  };
  
  const getAssignedEvents = (operatorId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return [];
    }
    
    return events.filter(event => operator.assignedEvents?.includes(event.id));
  };

  return {
    operators,
    setOperators,
    events,
    isLoading,
    handleStatusToggle,
    handleDelete,
    assignOperatorToEvent,
    getAssignedEvents
  };
};

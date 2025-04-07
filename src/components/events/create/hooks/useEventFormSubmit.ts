
import { useNavigate } from "react-router-dom";
import { Event } from "@/types/events";
import { Client } from "@/pages/Clients";
import { toast } from "sonner";
import { combineDateTime } from "../eventCreateUtils";
import { EventFormData } from "../types/eventFormTypes";

const EVENTS_STORAGE_KEY = "app_events_data";

export function useEventFormSubmit(eventId: string | null, clients: Client[]) {
  const navigate = useNavigate();
  const isEditMode = !!eventId;
  
  const handleSubmit = (e: React.FormEvent, eventData: EventFormData) => {
    e.preventDefault();
    
    const {
      title, client, selectedPersonnel, personnelCounts,
      startDate, endDate, startTime, endTime,
      eventLocation, eventAddress,
      grossHours, breakStartTime, breakEndTime, netHours,
      hourlyRateCost, hourlyRateSell, workShifts
    } = eventData;
    
    if (!title || !client || selectedPersonnel.length === 0 || !startDate || !endDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    
    const fullStartDate = combineDateTime(startDate, startTime);
    const fullEndDate = combineDateTime(endDate, endTime);
    
    if (fullEndDate <= fullStartDate) {
      toast.error("La data di fine deve essere successiva alla data di inizio");
      return;
    }

    try {
      const existingEventsJson = localStorage.getItem(EVENTS_STORAGE_KEY) || "[]";
      const existingEvents: Event[] = JSON.parse(existingEventsJson).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      
      const selectedClient = clients.find(c => c.id.toString() === client);
      
      const additionalData = {
        grossHours: grossHours ? Number(grossHours) : undefined,
        breakStartTime: breakStartTime || undefined,
        breakEndTime: breakEndTime || undefined,
        netHours: netHours ? Number(netHours) : undefined,
        hourlyRateCost: hourlyRateCost ? Number(hourlyRateCost) : undefined,
        hourlyRateSell: hourlyRateSell ? Number(hourlyRateSell) : undefined,
        personnelCount: personnelCounts,
        workShifts: workShifts.length > 0 ? workShifts : undefined
      };
      
      if (isEditMode) {
        const updatedEvents = existingEvents.map(event => {
          if (event.id === Number(eventId)) {
            return {
              ...event,
              title,
              client: selectedClient ? selectedClient.companyName : 'Cliente sconosciuto',
              startDate: fullStartDate,
              endDate: fullEndDate,
              personnelTypes: selectedPersonnel,
              location: eventLocation,
              address: eventAddress,
              ...additionalData,
              assignedPersonnel: event.assignedPersonnel || 0
            };
          }
          return event;
        });
        
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        toast.success("Evento aggiornato con successo!");
      } else {
        const maxId = existingEvents.reduce((max, event) => Math.max(max, event.id), 0);
        
        const newEvent: Event = {
          id: maxId + 1,
          title,
          client: selectedClient ? selectedClient.companyName : 'Cliente sconosciuto',
          startDate: fullStartDate,
          endDate: fullEndDate,
          personnelTypes: selectedPersonnel,
          location: eventLocation,
          address: eventAddress,
          ...additionalData,
          assignedPersonnel: 0
        };
        
        const updatedEvents = [...existingEvents, newEvent];
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        
        toast.success("Evento creato con successo!");
      }
      
      navigate("/events");
    } catch (error) {
      console.error("Errore durante il salvataggio dell'evento:", error);
      toast.error("Errore durante il salvataggio dell'evento");
    }
  };

  return { handleSubmit };
}

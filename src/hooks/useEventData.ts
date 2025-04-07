
import { useState, useEffect } from "react";
import { Client } from "@/pages/Clients";
import { Event, WorkShift } from "@/types/events";
import { toast } from "sonner";

const EVENTS_STORAGE_KEY = "app_events_data";

export function useEventData(eventId: string | null, clients: Client[]) {
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [personnelCounts, setPersonnelCounts] = useState<Record<string, number>>({});
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [grossHours, setGrossHours] = useState("");
  const [breakStartTime, setBreakStartTime] = useState("13:00");
  const [breakEndTime, setBreakEndTime] = useState("14:00");
  const [netHours, setNetHours] = useState("");
  const [hourlyRateCost, setHourlyRateCost] = useState("");
  const [hourlyRateSell, setHourlyRateSell] = useState("");
  const [workShifts, setWorkShifts] = useState<WorkShift[]>([]);

  // Load event data if in edit mode
  useEffect(() => {
    if (eventId) {
      try {
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        if (storedEvents) {
          const events: Event[] = JSON.parse(storedEvents).map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }));
          
          const eventToEdit = events.find(e => e.id === Number(eventId));
          
          if (eventToEdit) {
            setTitle(eventToEdit.title);
            
            const clientObject = clients.find(c => c.companyName === eventToEdit.client);
            if (clientObject) {
              setClient(clientObject.id.toString());
            }
            
            setSelectedPersonnel(eventToEdit.personnelTypes);
            
            if (eventToEdit.personnelCount && typeof eventToEdit.personnelCount === 'object') {
              setPersonnelCounts(eventToEdit.personnelCount);
            } else {
              const counts: Record<string, number> = {};
              eventToEdit.personnelTypes.forEach(type => {
                counts[type] = 1;
              });
              setPersonnelCounts(counts);
            }
            
            setStartDate(eventToEdit.startDate);
            setEndDate(eventToEdit.endDate);
            setStartTime(eventToEdit.startDate.getHours().toString().padStart(2, '0') + ":" + 
                       eventToEdit.startDate.getMinutes().toString().padStart(2, '0'));
            setEndTime(eventToEdit.endDate.getHours().toString().padStart(2, '0') + ":" + 
                     eventToEdit.endDate.getMinutes().toString().padStart(2, '0'));
            
            if (eventToEdit.location) {
              setEventLocation(eventToEdit.location);
            }
            
            if (eventToEdit.address) {
              setEventAddress(eventToEdit.address);
            }
            
            if (eventToEdit.grossHours) {
              setGrossHours(eventToEdit.grossHours.toString());
            }
            
            if (eventToEdit.breakStartTime) {
              setBreakStartTime(eventToEdit.breakStartTime);
            }
            
            if (eventToEdit.breakEndTime) {
              setBreakEndTime(eventToEdit.breakEndTime);
            }
            
            if (eventToEdit.netHours) {
              setNetHours(eventToEdit.netHours.toString());
            }
            
            if (eventToEdit.hourlyRateCost) {
              setHourlyRateCost(eventToEdit.hourlyRateCost.toString());
            }
            
            if (eventToEdit.hourlyRateSell) {
              setHourlyRateSell(eventToEdit.hourlyRateSell.toString());
            }
            
            if (eventToEdit.workShifts && Array.isArray(eventToEdit.workShifts)) {
              setWorkShifts(eventToEdit.workShifts);
            }
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
        toast.error("Impossibile caricare i dati dell'evento");
      }
    }
  }, [eventId, clients]);

  return {
    title, setTitle,
    client, setClient,
    selectedPersonnel, setSelectedPersonnel,
    personnelCounts, setPersonnelCounts,
    startDate, setStartDate,
    endDate, setEndDate,
    startTime, setStartTime,
    endTime, setEndTime,
    eventLocation, setEventLocation,
    eventAddress, setEventAddress,
    grossHours, setGrossHours,
    breakStartTime, setBreakStartTime,
    breakEndTime, setBreakEndTime,
    netHours, setNetHours,
    hourlyRateCost, setHourlyRateCost,
    hourlyRateSell, setHourlyRateSell,
    workShifts, setWorkShifts
  };
}


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import EventDetailsSection from "./EventDetailsSection";
import PersonnelSection from "./PersonnelSection";
import DateTimeSection from "./DateTimeSection";
import LocationSection from "./LocationSection";
import HoursAndCostsSection from "./HoursAndCostsSection";
import { Event } from "@/pages/Events";
import { Client } from "@/pages/Clients";
import { toast } from "sonner";
import { combineDateTime } from "./eventCreateUtils";

const EVENTS_STORAGE_KEY = "app_events_data";

interface EventFormProps {
  eventId: string | null;
  eventData: {
    title: string;
    client: string;
    selectedPersonnel: string[];
    personnelCounts: Record<string, number>;
    startDate: Date | undefined;
    endDate: Date | undefined;
    startTime: string;
    endTime: string;
    eventLocation: string;
    eventAddress: string;
    grossHours: string;
    breakStartTime: string;
    breakEndTime: string;
    netHours: string;
    hourlyRateCost: string;
    hourlyRateSell: string;
  };
  setters: {
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setClient: React.Dispatch<React.SetStateAction<string>>;
    setSelectedPersonnel: React.Dispatch<React.SetStateAction<string[]>>;
    setPersonnelCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setStartTime: React.Dispatch<React.SetStateAction<string>>;
    setEndTime: React.Dispatch<React.SetStateAction<string>>;
    setEventLocation: React.Dispatch<React.SetStateAction<string>>;
    setEventAddress: React.Dispatch<React.SetStateAction<string>>;
    setGrossHours: React.Dispatch<React.SetStateAction<string>>;
    setBreakStartTime: React.Dispatch<React.SetStateAction<string>>;
    setBreakEndTime: React.Dispatch<React.SetStateAction<string>>;
    setNetHours: React.Dispatch<React.SetStateAction<string>>;
    setHourlyRateCost: React.Dispatch<React.SetStateAction<string>>;
    setHourlyRateSell: React.Dispatch<React.SetStateAction<string>>;
  };
  clients: Client[];
  locationHelpers: {
    locationSuggestions: any[];
    addressSuggestions: any[];
    showLocationSuggestions: boolean;
    showAddressSuggestions: boolean;
    handleLocationChange: (value: string) => void;
    handleAddressChange: (value: string) => void;
    handleSelectLocationSuggestion: (suggestion: any) => void;
    handleSelectAddressSuggestion: (suggestion: any) => void;
  };
}

const EventForm: React.FC<EventFormProps> = ({
  eventId,
  eventData,
  setters,
  clients,
  locationHelpers
}) => {
  const navigate = useNavigate();
  const isEditMode = !!eventId;

  const {
    title, client, selectedPersonnel, personnelCounts,
    startDate, endDate, startTime, endTime,
    eventLocation, eventAddress,
    grossHours, breakStartTime, breakEndTime, netHours,
    hourlyRateCost, hourlyRateSell
  } = eventData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
        personnelCount: personnelCounts
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
              ...additionalData
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
          ...additionalData
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
  
  return (
    <>
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/events')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna agli eventi
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Modifica evento" : "Crea nuovo evento"}</CardTitle>
          <CardDescription>
            {isEditMode 
              ? "Modifica i dettagli dell'evento esistente" 
              : "Compila il form per creare un nuovo evento"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <EventDetailsSection
              title={title}
              client={client}
              setTitle={setters.setTitle}
              setClient={setters.setClient}
              clients={clients}
              navigate={navigate}
            />
            
            <LocationSection
              eventLocation={eventLocation}
              eventAddress={eventAddress}
              locationHelpers={locationHelpers}
            />
            
            <PersonnelSection
              selectedPersonnel={selectedPersonnel}
              personnelCounts={personnelCounts}
              setSelectedPersonnel={setters.setSelectedPersonnel}
              setPersonnelCounts={setters.setPersonnelCounts}
            />
            
            <DateTimeSection
              startDate={startDate}
              endDate={endDate}
              startTime={startTime}
              endTime={endTime}
              setStartDate={setters.setStartDate}
              setEndDate={setters.setEndDate}
              setStartTime={setters.setStartTime}
              setEndTime={setters.setEndTime}
            />
            
            <HoursAndCostsSection
              grossHours={grossHours}
              netHours={netHours}
              breakStartTime={breakStartTime}
              breakEndTime={breakEndTime}
              hourlyRateCost={hourlyRateCost}
              hourlyRateSell={hourlyRateSell}
              setGrossHours={setters.setGrossHours}
              setNetHours={setters.setNetHours}
              setBreakStartTime={setters.setBreakStartTime}
              setBreakEndTime={setters.setBreakEndTime}
              setHourlyRateCost={setters.setHourlyRateCost}
              setHourlyRateSell={setters.setHourlyRateSell}
            />
            
            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                {isEditMode ? "Aggiorna Evento" : "Crea Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default EventForm;

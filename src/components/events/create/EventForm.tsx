
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import EventDetailsSection from "./EventDetailsSection";
import PersonnelSection from "./PersonnelSection";
import DateTimeSection from "./DateTimeSection";
import LocationSection from "./LocationSection";
import HoursAndCostsSection from "./HoursAndCostsSection";
import WorkShiftsSection from "./WorkShiftsSection";
import { Client } from "@/pages/Clients";
import { countEventDays } from "@/utils/dateTimeUtils";
import { useEventFormSubmit } from "./hooks/useEventFormSubmit";
import { EventFormData, EventFormSetters, LocationHelpers } from "./types/eventFormTypes";

interface EventFormProps {
  eventId: string | null;
  eventData: EventFormData;
  setters: EventFormSetters;
  clients: Client[];
  locationHelpers: LocationHelpers;
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
  const { handleSubmit } = useEventFormSubmit(eventId, clients);

  const { startDate, endDate } = eventData;
  
  // Calculate if this is a multi-day event
  const isMultiDayEvent = useMemo(() => {
    if (startDate && endDate) {
      return countEventDays(startDate, endDate) > 1;
    }
    return false;
  }, [startDate, endDate]);

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, eventData);
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
          <form onSubmit={onSubmit} className="space-y-6">
            <EventDetailsSection
              title={eventData.title}
              client={eventData.client}
              setTitle={setters.setTitle}
              setClient={setters.setClient}
              clients={clients}
              navigate={navigate}
            />
            
            <LocationSection
              eventLocation={eventData.eventLocation}
              eventAddress={eventData.eventAddress}
              locationHelpers={locationHelpers}
            />
            
            <PersonnelSection
              selectedPersonnel={eventData.selectedPersonnel}
              personnelCounts={eventData.personnelCounts}
              setSelectedPersonnel={setters.setSelectedPersonnel}
              setPersonnelCounts={setters.setPersonnelCounts}
            />
            
            <DateTimeSection
              startDate={eventData.startDate}
              endDate={eventData.endDate}
              startTime={eventData.startTime}
              endTime={eventData.endTime}
              setStartDate={setters.setStartDate}
              setEndDate={setters.setEndDate}
              setStartTime={setters.setStartTime}
              setEndTime={setters.setEndTime}
            />
            
            <WorkShiftsSection
              startDate={eventData.startDate}
              endDate={eventData.endDate}
              workShifts={eventData.workShifts}
              setWorkShifts={setters.setWorkShifts}
              showWorkShifts={isMultiDayEvent}
            />
            
            <HoursAndCostsSection
              grossHours={eventData.grossHours}
              netHours={eventData.netHours}
              breakStartTime={eventData.breakStartTime}
              breakEndTime={eventData.breakEndTime}
              hourlyRateCost={eventData.hourlyRateCost}
              hourlyRateSell={eventData.hourlyRateSell}
              startDate={eventData.startDate}
              endDate={eventData.endDate}
              setGrossHours={setters.setGrossHours}
              setNetHours={setters.setNetHours}
              setBreakStartTime={setters.setBreakStartTime}
              setBreakEndTime={setters.setBreakEndTime}
              setHourlyRateCost={setters.setHourlyRateCost}
              setHourlyRateSell={setters.setHourlyRateSell}
              workShifts={eventData.workShifts}
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

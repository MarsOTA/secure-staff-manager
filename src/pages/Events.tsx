import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventTable from "@/components/events/EventTable";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import EmptyEventCard from "@/components/events/EmptyEventCard";

export interface Event {
  id: number;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  personnelTypes: string[];
  location?: string;
  address?: string;
  grossHours?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  netHours?: number;
  hourlyRateCost?: number;
  hourlyRateSell?: number;
  status?: string;
}

const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  
  useEffect(() => {
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
        setEvents([
          {
            id: 1,
            title: "Concerto Rock in Roma",
            client: "Rock Productions",
            startDate: new Date(2023, 6, 15, 18, 0),
            endDate: new Date(2023, 6, 15, 23, 30),
            personnelTypes: ["security", "doorman", "hostess/steward"],
          },
          {
            id: 2,
            title: "Fiera del Libro",
            client: "MediaGroup",
            startDate: new Date(2023, 7, 10, 9, 0),
            endDate: new Date(2023, 7, 12, 19, 0),
            personnelTypes: ["security", "hostess/steward"],
          },
        ]);
      }
    } else {
      setEvents([
        {
          id: 1,
          title: "Concerto Rock in Roma",
          client: "Rock Productions",
          startDate: new Date(2023, 6, 15, 18, 0),
          endDate: new Date(2023, 6, 15, 23, 30),
          personnelTypes: ["security", "doorman", "hostess/steward"],
        },
        {
          id: 2,
          title: "Fiera del Libro",
          client: "MediaGroup",
          startDate: new Date(2023, 7, 10, 9, 0),
          endDate: new Date(2023, 7, 12, 19, 0),
          personnelTypes: ["security", "hostess/steward"],
        },
      ]);
    }
  }, []);
  
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  const handleCreateEvent = () => {
    navigate("/events/create");
  };
  
  const handleEditEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    navigate(`/events/create?id=${eventId}`);
  };
  
  const handleDeleteEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    toast.success("Evento eliminato con successo");
  };
  
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
      
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      
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
        // Continue with local storage only
      }
      
      const eventToClose = updatedEvents.find(e => e.id === eventId);
      
      if (eventToClose) {
        const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
        if (storedOperators) {
          try {
            const operators = JSON.parse(storedOperators);
            let operatorsUpdated = false;
            
            for (const operator of operators) {
              if (operator.assignedEvents && operator.assignedEvents.includes(eventId)) {
                if (!operator.eventPayments) {
                  operator.eventPayments = [];
                }
                
                operator.eventPayments.push({
                  eventId,
                  eventTitle: eventToClose.title,
                  date: new Date().toISOString(),
                  grossHours: eventToClose.grossHours || calculateHours(eventToClose.startDate, eventToClose.endDate),
                  netHours: eventToClose.netHours || calculateNetHours(eventToClose.startDate, eventToClose.endDate),
                  hourlyRate: eventToClose.hourlyRateCost || 15,
                  mealAllowance: (eventToClose.grossHours || calculateHours(eventToClose.startDate, eventToClose.endDate)) > 5 ? 10 : 0,
                  travelAllowance: 15,
                  status: 'paid'
                });
                
                operatorsUpdated = true;
              }
            }
            
            if (operatorsUpdated) {
              localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
            }
          } catch (error) {
            console.error("Errore nell'aggiornamento degli operatori:", error);
          }
        }
        
        try {
          const { data: eventOperators, error: eventOperatorsError } = await supabase
            .from('event_operators')
            .select('*')
            .eq('event_id', eventId);
            
          if (eventOperatorsError) {
            console.error("Errore durante il recupero degli operatori per l'evento:", eventOperatorsError);
          } else if (eventOperators && eventOperators.length > 0) {
            console.log("Operatori trovati per l'evento:", eventOperators);
            
            for (const operator of eventOperators) {
              const netHours = eventToClose.netHours || operator.net_hours || calculateNetHours(eventToClose.startDate, eventToClose.endDate);
              const hourlyRate = eventToClose.hourlyRateCost || operator.hourly_rate || 15;
              const totalCompensation = netHours * hourlyRate;
              
              try {
                const { error: updateOperatorError } = await supabase
                  .from('event_operators')
                  .update({
                    net_hours: netHours,
                    total_hours: eventToClose.grossHours || operator.total_hours || calculateHours(eventToClose.startDate, eventToClose.endDate),
                    hourly_rate: hourlyRate,
                    total_compensation: totalCompensation,
                    meal_allowance: operator.meal_allowance || ((netHours > 5) ? 10 : 0),
                    travel_allowance: operator.travel_allowance || 15,
                    revenue_generated: (eventToClose.hourlyRateSell || 25) * netHours
                  })
                  .eq('id', operator.id);
                  
                if (updateOperatorError) {
                  console.error(`Errore durante l'aggiornamento dell'operatore ${operator.id}:`, updateOperatorError);
                }
              } catch (error) {
                console.error(`Errore nella comunicazione con il database per l'operatore ${operator.id}:`, error);
              }
            }
          }
        } catch (error) {
          console.error("Errore durante l'accesso al database per gli operatori:", error);
        }
        
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

  const calculateHours = (startDate: Date, endDate: Date): number => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 10) / 10;
  };

  const calculateNetHours = (startDate: Date, endDate: Date): number => {
    const grossHours = calculateHours(startDate, endDate);
    return grossHours > 5 ? grossHours - 1 : grossHours;
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Eventi</CardTitle>
          <Button onClick={handleCreateEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Crea nuovo evento
          </Button>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <EventTable
              events={events}
              onShowDetails={handleShowDetails}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <EmptyEventCard onCreateEvent={handleCreateEvent} />
          )}
        </CardContent>
      </Card>
      
      <EventDetailDialog
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventClose={handleCloseEvent}
        isClosingEvent={isClosingEvent}
      />
    </Layout>
  );
};

export default Events;

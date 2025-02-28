
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "./Events";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipo Operatore
interface Operator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  assignedEvents?: number[]; // IDs degli eventi assegnati
}

// Chiavi localStorage
const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

// Definizione del contenuto del calendario
interface CalendarContent {
  [date: string]: {
    events: Event[];
    hasEvents: boolean;
  };
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [calendarContent, setCalendarContent] = useState<CalendarContent>({});
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Caricamento dati
  useEffect(() => {
    // Carica eventi
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
    }

    // Carica operatori
    const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        setOperators(JSON.parse(storedOperators));
      } catch (error) {
        console.error("Errore nel caricamento degli operatori:", error);
        setOperators([]);
      }
    }
  }, []);

  // Preparazione contenuto calendario
  useEffect(() => {
    if (events.length > 0) {
      const content: CalendarContent = {};
      
      // Itera su tutti i giorni del mese corrente
      const currentMonth = selectedMonth.getMonth();
      const currentYear = selectedMonth.getFullYear();
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        // Filtra eventi che si svolgono in questa data
        const eventsOnDay = events.filter(event => {
          const eventStart = new Date(event.startDate);
          const eventEnd = new Date(event.endDate);
          
          // Normalizza le date per confrontare solo giorno/mese/anno
          const normalizedDate = new Date(date);
          normalizedDate.setHours(0, 0, 0, 0);
          
          const normalizedStart = new Date(eventStart);
          normalizedStart.setHours(0, 0, 0, 0);
          
          const normalizedEnd = new Date(eventEnd);
          normalizedEnd.setHours(0, 0, 0, 0);
          
          // Controlla se la data è compresa nell'intervallo dell'evento
          return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
        });
        
        content[dateStr] = {
          events: eventsOnDay,
          hasEvents: eventsOnDay.length > 0
        };
      }
      
      setCalendarContent(content);
    }
  }, [events, selectedMonth]);

  // Funzione per ottenere gli operatori assegnati a un evento
  const getOperatorsForEvent = (eventId: number) => {
    return operators.filter(op => 
      op.assignedEvents?.includes(eventId) && op.status === "active"
    );
  };

  // Gestione selezione data
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (calendarContent[dateStr] && calendarContent[dateStr].hasEvents) {
        setSelectedDate(date);
        setSelectedEvents(calendarContent[dateStr].events);
        setIsDetailsOpen(true);
      }
    }
  };

  // Funzione per generare il contenuto modifidato per i giorni del calendario
  const modifyDayContent = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const hasEventsToday = calendarContent[dateStr]?.hasEvents || false;
    const eventsCount = calendarContent[dateStr]?.events.length || 0;
    
    if (hasEventsToday) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <div>{format(date, 'd')}</div>
          <div className="absolute bottom-1 flex justify-center">
            <Badge className="text-xs h-4 min-w-4 flex items-center justify-center bg-primary">
              {eventsCount}
            </Badge>
          </div>
        </div>
      );
    }
    
    return format(date, 'd');
  };

  // Formattazione dell'orario dell'evento
  const formatEventTime = (event: Event) => {
    const startTime = format(new Date(event.startDate), "HH:mm");
    const endTime = format(new Date(event.endDate), "HH:mm");
    return `${startTime} - ${endTime}`;
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle>Calendario Eventi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={selectedMonth}
                onMonthChange={setSelectedMonth}
                locale={it}
                className="rounded-md border mx-auto"
                modifiersClassNames={{
                  selected: "!bg-primary text-primary-foreground",
                }}
                modifiers={{
                  event: (date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    return calendarContent[dateStr]?.hasEvents || false;
                  }
                }}
                components={{
                  DayContent: ({ date }) => modifyDayContent(date)
                }}
              />
            </div>
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Legenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="h-4 min-w-4 flex items-center justify-center bg-primary">1</Badge>
                      <span>Giorni con eventi</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Clicca su un giorno con eventi per visualizzare i dettagli.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Sommario eventi questo mese */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Eventi in {format(selectedMonth, 'MMMM yyyy', { locale: it })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.values(calendarContent)
                    .flatMap(day => day.events)
                    .filter((event, index, self) => 
                      index === self.findIndex(e => e.id === event.id)
                    )
                    .slice(0, 5) // Limite di 5 eventi per non sovraccaricare
                    .map(event => (
                      <div key={event.id} className="mb-2 p-2 border rounded-md">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(event.startDate), 'dd/MM/yyyy')} - {format(new Date(event.endDate), 'dd/MM/yyyy')}
                        </div>
                      </div>
                    ))}
                  {Object.values(calendarContent)
                    .flatMap(day => day.events)
                    .filter((event, index, self) => 
                      index === self.findIndex(e => e.id === event.id)
                    ).length > 5 && (
                    <div className="text-sm text-muted-foreground text-center mt-2">
                      + altri eventi...
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog dettagli eventi del giorno */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Eventi del {selectedDate ? format(selectedDate, 'd MMMM yyyy', { locale: it }) : ''}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 p-2">
              {selectedEvents.map((event) => (
                <div 
                  key={event.id}
                  className="p-4 border rounded-md"
                >
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orario:</span>
                      <span>{formatEventTime(event)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span>{event.client}</span>
                    </div>
                    {event.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Luogo:</span>
                        <span>{event.location}</span>
                      </div>
                    )}
                    {event.address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Indirizzo:</span>
                        <span>{event.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Operatori assegnati */}
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Operatori assegnati:</h4>
                    <div className="mt-2">
                      {getOperatorsForEvent(event.id).length > 0 ? (
                        <div className="space-y-2">
                          {getOperatorsForEvent(event.id).map(operator => (
                            <div key={operator.id} className="flex items-center justify-between text-sm">
                              <span>{operator.name}</span>
                              <span className="text-muted-foreground">{operator.phone}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          Nessun operatore assegnato
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>
              Chiudi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Calendar;

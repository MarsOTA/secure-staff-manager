
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
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
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format as formatTz, parse, startOfWeek, getDay } from 'date-fns';
import "react-big-calendar/lib/css/react-big-calendar.css";

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

// Configurazione del localizzatore per il calendario
const locales = {
  'it': it,
};

const localizer = dateFnsLocalizer({
  format: formatTz,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Interfaccia per gli eventi del calendario
interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  client?: string;
  location?: string;
  address?: string;
  originalEvent: Event;
}

const Calendar = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedView, setSelectedView] = useState<string>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
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

  // Converti gli eventi per il formato del calendario
  useEffect(() => {
    if (events.length > 0) {
      const formattedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        client: event.client,
        location: event.location,
        address: event.address,
        originalEvent: event
      }));
      
      setCalendarEvents(formattedEvents);
    }
  }, [events]);

  // Funzione per ottenere gli operatori assegnati a un evento
  const getOperatorsForEvent = (eventId: number) => {
    return operators.filter(op => 
      op.assignedEvents?.includes(eventId) && op.status === "active"
    );
  };

  // Gestione selezione evento
  const handleEventSelect = (calendarEvent: CalendarEvent) => {
    setSelectedEvent(calendarEvent.originalEvent);
    setIsDetailsOpen(true);
  };

  // Formattazione dell'orario dell'evento
  const formatEventTime = (event: Event) => {
    const startTime = format(new Date(event.startDate), "HH:mm");
    const endTime = format(new Date(event.endDate), "HH:mm");
    return `${startTime} - ${endTime}`;
  };

  // Formattazione delle date nel calendario
  const formatWeekdayHeader = (date: Date) => {
    return format(date, 'EEE', { locale: it });
  };

  // Gestione cambio visualizzazione
  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  // Gestione cambio data
  const handleNavigate = (date: Date) => {
    setSelectedDate(date);
  };

  // Personalizzazione del formato del titolo del mese/settimana/giorno
  const formats = {
    monthHeaderFormat: (date: Date) => format(date, 'MMMM yyyy', { locale: it }),
    weekHeaderFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${format(start, 'd', { locale: it })} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
    },
    dayHeaderFormat: (date: Date) => format(date, 'EEEE d MMMM yyyy', { locale: it }),
    dayRangeHeaderFormat: ({ start, end }: { start: Date, end: Date }) => {
      return `${format(start, 'd', { locale: it })} - ${format(end, 'd MMMM yyyy', { locale: it })}`;
    },
  };

  // Componente per personalizzare il rendering degli eventi nel calendario
  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    const assignedOperators = getOperatorsForEvent(event.id);
    const hasOperators = assignedOperators.length > 0;
    
    return (
      <div className="p-1 text-xs overflow-hidden">
        <div className="font-semibold truncate">{event.title}</div>
        <div className="truncate">{event.client}</div>
        {hasOperators && (
          <div className="text-xs italic truncate">
            {assignedOperators.length} {assignedOperators.length === 1 ? 'operatore' : 'operatori'}
          </div>
        )}
      </div>
    );
  };

  // Classificazione degli eventi per colore (in base al cliente)
  const eventPropGetter = (event: CalendarEvent) => {
    const clientName = event.client || '';
    // Una semplice funzione hash per generare un colore basato sul nome del cliente
    const hash = clientName.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash % 360);
    
    return {
      style: {
        backgroundColor: `hsl(${hue}, 70%, 50%)`,
        borderColor: `hsl(${hue}, 70%, 40%)`,
      }
    };
  };

  return (
    <Layout>
      <Card className="overflow-hidden mb-8">
        <CardHeader className="pb-2">
          <CardTitle>Calendario Eventi</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-4">
          <div className="w-full" style={{ height: "calc(100vh - 240px)" }}>
            <div className="mb-2 mt-2 px-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <Button 
                  variant={selectedView === Views.DAY ? "default" : "outline"} 
                  onClick={() => handleViewChange(Views.DAY)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Giorno
                </Button>
                <Button 
                  variant={selectedView === Views.WEEK ? "default" : "outline"} 
                  onClick={() => handleViewChange(Views.WEEK)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Settimana
                </Button>
                <Button 
                  variant={selectedView === Views.MONTH ? "default" : "outline"} 
                  onClick={() => handleViewChange(Views.MONTH)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Mese
                </Button>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigate(new Date())}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  Oggi
                </Button>
              </div>
            </div>
            
            <div className="calendar-container h-full pb-4 px-2 sm:px-4">
              <div dangerouslySetInnerHTML={{ __html: `
                <style>
                  .rbc-calendar {
                    width: 100%;
                    height: 100%;
                    min-height: 580px;
                    display: flex;
                    flex-direction: column;
                  }
                  .rbc-header {
                    padding: 4px 2px;
                    font-size: 0.875rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  .rbc-event {
                    border-radius: 4px;
                    padding: 2px 4px;
                    border: none;
                  }
                  .rbc-month-view {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: auto !important;
                    height: 100% !important;
                    min-height: 580px;
                  }
                  .rbc-month-header {
                    flex: none;
                  }
                  .rbc-month-row {
                    min-height: 100px;
                    flex: 1;
                    overflow: visible;
                    position: relative;
                  }
                  .rbc-row-bg {
                    flex: 1;
                    display: flex;
                    overflow: visible;
                  }
                  .rbc-row-content {
                    position: relative;
                    z-index: 4;
                    overflow: visible;
                  }
                  .rbc-row {
                    display: flex;
                    flex: 1;
                    position: relative;
                    overflow: visible;
                  }
                  .rbc-date-cell {
                    text-align: center;
                    padding: 2px;
                  }
                  .rbc-show-more {
                    color: #0066cc;
                    font-weight: bold;
                    cursor: pointer;
                    padding: 0 2px;
                    z-index: 10;
                    position: relative;
                  }
                  .rbc-day-slot .rbc-events-container {
                    min-height: 100%;
                  }
                  .rbc-today {
                    background-color: rgba(240, 240, 240, 0.5);
                  }
                  .rbc-off-range-bg {
                    background-color: rgba(245, 245, 245, 0.3);
                  }
                  .rbc-overlay {
                    position: absolute;
                    z-index: 100;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                    padding: 10px;
                  }
                  /* Fixed height for month rows to ensure all days are visible */
                  .rbc-month-row {
                    min-height: 110px;
                    max-height: 110px;
                  }
                  /* Ensure row content scrolls properly */
                  .rbc-row-content {
                    overflow: visible !important;
                    max-height: none !important;
                  }
                  /* Ensure events are visible within cells */
                  .rbc-event-content {
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  /* Make the "show more" button more visible */
                  .rbc-row-segment {
                    padding: 0 1px;
                  }
                  /* Fix for weeks in month view */
                  .rbc-month-view .rbc-month-row {
                    overflow: visible !important;
                    display: flex;
                    flex: 1;
                  }
                  /* Ensure the entire calendar is scrollable */
                  .calendar-container {
                    height: 100%;
                    overflow: auto;
                  }
                  @media (max-width: 640px) {
                    .rbc-toolbar {
                      font-size: 0.75rem;
                      flex-direction: column;
                    }
                    .rbc-toolbar-label {
                      padding: 8px 0;
                    }
                    .rbc-header {
                      font-size: 0.75rem;
                      padding: 3px 1px;
                    }
                    .rbc-btn-group button {
                      padding: 4px 8px;
                    }
                    .rbc-day-slot .rbc-events-container {
                      margin-right: 0;
                    }
                  }
                </style>
              `}} />
              <BigCalendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                view={selectedView as any}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                onView={handleViewChange as any}
                date={selectedDate}
                onNavigate={handleNavigate}
                onSelectEvent={(event: any) => handleEventSelect(event)}
                formats={formats as any}
                eventPropGetter={eventPropGetter as any}
                components={{
                  event: EventComponent as any,
                }}
                popup={true}
                length={80}
                messages={{
                  today: 'Oggi',
                  previous: 'Prec',
                  next: 'Succ',
                  month: 'Mese',
                  week: 'Sett',
                  day: 'Giorno',
                  agenda: 'Agenda',
                  date: 'Data',
                  time: 'Ora',
                  event: 'Evento',
                  noEventsInRange: 'Nessun evento',
                  showMore: (total: number) => `+${total}`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog dettagli evento */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvent && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-2">
                <div className="p-4 border rounded-md">
                  <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Data:</span>
                      <span>{format(new Date(selectedEvent.startDate), 'dd/MM/yyyy')} - {format(new Date(selectedEvent.endDate), 'dd/MM/yyyy')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Orario:</span>
                      <span>{formatEventTime(selectedEvent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cliente:</span>
                      <span>{selectedEvent.client}</span>
                    </div>
                    {selectedEvent.location && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Luogo:</span>
                        <span>{selectedEvent.location}</span>
                      </div>
                    )}
                    {selectedEvent.address && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Indirizzo:</span>
                        <span>{selectedEvent.address}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Operatori assegnati */}
                  <div className="mt-4">
                    <h4 className="font-medium text-sm">Operatori assegnati:</h4>
                    <div className="mt-2">
                      {getOperatorsForEvent(selectedEvent.id).length > 0 ? (
                        <div className="space-y-2">
                          {getOperatorsForEvent(selectedEvent.id).map(operator => (
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
              </div>
            </ScrollArea>
          )}
          
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

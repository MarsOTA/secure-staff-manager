
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { it } from "date-fns/locale";

// Definizione dell'interfaccia Event per l'applicazione
export interface Event {
  id: number;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  personnelTypes: string[];
}

// Chiave per il localStorage
const EVENTS_STORAGE_KEY = "app_events_data";

const Events = () => {
  const navigate = useNavigate();
  
  // Stato per gli eventi
  const [events, setEvents] = useState<Event[]>([]);
  
  // Carica gli eventi dal localStorage all'avvio
  useEffect(() => {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (storedEvents) {
      try {
        // Parsifichiamo gli eventi dal localStorage
        const parsedEvents = JSON.parse(storedEvents);
        
        // Convertiamo le stringhe di date in oggetti Date
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        
        // Dati di esempio come fallback
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
      // Nessun evento nel localStorage, utilizziamo i dati di esempio
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
  
  // Salva gli eventi nel localStorage quando cambiano
  useEffect(() => {
    if (events.length > 0) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    }
  }, [events]);

  // Funzione per formattare data e ora
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                    start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };

  // Funzione per navigare alla pagina di creazione evento
  const handleCreateEvent = () => {
    navigate("/events/create");
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titolo Evento</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data e Ora</TableHead>
                  <TableHead>Personale Richiesto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/events/${event.id}`)}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>{event.client}</TableCell>
                    <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {event.personnelTypes.map((type) => (
                          <span 
                            key={type}
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">Nessun evento</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Non ci sono eventi programmati. Inizia creando un nuovo evento.
              </p>
              <Button onClick={handleCreateEvent} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Crea nuovo evento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Events;

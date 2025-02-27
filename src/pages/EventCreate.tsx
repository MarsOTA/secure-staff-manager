
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowLeft, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Event } from "./Events";

// Tipo di personale con etichette
const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
];

// Clienti fittizi
const clients = [
  { id: 1, name: "Rock Productions" },
  { id: 2, name: "MediaGroup" },
  { id: 3, name: "Festival Italiano" },
  { id: 4, name: "Sport Events" },
];

// Chiave per il localStorage
const EVENTS_STORAGE_KEY = "app_events_data";

// Interfaccia per i risultati di Google Places API
interface PlacePrediction {
  description: string;
  place_id: string;
}

const EventCreate = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  
  // Recupera l'ID dell'evento da modificare (se presente)
  const eventId = new URLSearchParams(locationHook.search).get("id");
  const isEditMode = !!eventId;
  
  // Stati per il form
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [eventLocation, setEventLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Ref per lo script di Google Maps
  const googleScriptLoaded = useRef(false);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  
  // Carica lo script di Google Maps
  useEffect(() => {
    if (!googleScriptLoaded.current) {
      // Callback quando lo script è caricato
      const initGoogleMapsServices = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          googleScriptLoaded.current = true;
          console.log("Google Maps API loaded successfully");
        }
      };

      // Crea lo script per Google Maps API
      const googleMapsScript = document.createElement("script");
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC0HttgvqRiRYKBoRh_pnUsyqem4AqO1zY&libraries=places&callback=initGoogleMapsCallback`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      // Aggiungi la callback globale
      window.initGoogleMapsCallback = initGoogleMapsServices;
      
      // Aggiungi lo script al DOM
      document.head.appendChild(googleMapsScript);
      
      // Cleanup
      return () => {
        // Rimuovi lo script e la callback globale
        document.head.removeChild(googleMapsScript);
        delete window.initGoogleMapsCallback;
      };
    }
  }, []);
  
  // Carica i dati dell'evento se siamo in modalità modifica
  useEffect(() => {
    if (isEditMode) {
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
            // Popola i campi del form con i dati dell'evento
            setTitle(eventToEdit.title);
            
            // Trova l'ID del cliente dal nome
            const clientObject = clients.find(c => c.name === eventToEdit.client);
            if (clientObject) {
              setClient(clientObject.id.toString());
            }
            
            setSelectedPersonnel(eventToEdit.personnelTypes);
            setStartDate(eventToEdit.startDate);
            setEndDate(eventToEdit.endDate);
            setStartTime(format(eventToEdit.startDate, "HH:mm"));
            setEndTime(format(eventToEdit.endDate, "HH:mm"));
            
            // Imposta la località se presente
            if (eventToEdit.location) {
              setEventLocation(eventToEdit.location);
            }
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
        toast.error("Impossibile caricare i dati dell'evento");
      }
    }
  }, [eventId, isEditMode]);
  
  // Gestione personale selezionato
  const handlePersonnelChange = (personnelId: string) => {
    setSelectedPersonnel((current) => {
      if (current.includes(personnelId)) {
        return current.filter((id) => id !== personnelId);
      } else {
        return [...current, personnelId];
      }
    });
  };
  
  // Gestione suggerimenti località con Google Places API
  const handleLocationChange = (value: string) => {
    setEventLocation(value);
    
    if (value.length > 2 && autocompleteService.current && googleScriptLoaded.current) {
      // Utilizziamo l'API di Google Places per ottenere suggerimenti
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['(cities)'] // Limita i risultati a città
        },
        (predictions, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            setLocationSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            setLocationSuggestions([]);
            setShowSuggestions(false);
          }
        }
      );
    } else {
      setShowSuggestions(false);
    }
  };
  
  // Gestione selezione suggerimento
  const handleSelectSuggestion = (suggestion: PlacePrediction) => {
    setEventLocation(suggestion.description);
    setShowSuggestions(false);
  };
  
  // Gestione invio form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!title || !client || selectedPersonnel.length === 0 || !startDate || !endDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    
    // Creazione oggetto evento completo
    const fullStartDate = combineDateTime(startDate, startTime);
    const fullEndDate = combineDateTime(endDate, endTime);
    
    // Validazione date
    if (fullEndDate <= fullStartDate) {
      toast.error("La data di fine deve essere successiva alla data di inizio");
      return;
    }

    try {
      // Carichiamo gli eventi esistenti dal localStorage
      const existingEventsJson = localStorage.getItem(EVENTS_STORAGE_KEY) || "[]";
      const existingEvents: Event[] = JSON.parse(existingEventsJson).map((event: any) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate)
      }));
      
      // Troviamo il nome del cliente dal suo ID
      const selectedClient = clients.find(c => c.id.toString() === client);
      
      if (isEditMode) {
        // Aggiornamento evento esistente
        const updatedEvents = existingEvents.map(event => {
          if (event.id === Number(eventId)) {
            return {
              ...event,
              title,
              client: selectedClient ? selectedClient.name : 'Cliente sconosciuto',
              startDate: fullStartDate,
              endDate: fullEndDate,
              personnelTypes: selectedPersonnel,
              location: eventLocation
            };
          }
          return event;
        });
        
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
        toast.success("Evento aggiornato con successo!");
      } else {
        // Creazione nuovo evento
        // Troviamo l'ID più alto per assegnare un nuovo ID
        const maxId = existingEvents.reduce((max, event) => Math.max(max, event.id), 0);
        
        // Creiamo il nuovo evento
        const newEvent: Event = {
          id: maxId + 1,
          title,
          client: selectedClient ? selectedClient.name : 'Cliente sconosciuto',
          startDate: fullStartDate,
          endDate: fullEndDate,
          personnelTypes: selectedPersonnel,
          location: eventLocation
        };
        
        // Aggiungiamo il nuovo evento alla lista e salviamo
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
  
  // Funzione per combinare data e ora
  const combineDateTime = (date: Date | undefined, timeString: string): Date => {
    if (!date) return new Date();
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };
  
  return (
    <Layout>
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
            {/* Titolo evento */}
            <div className="space-y-2">
              <Label htmlFor="title">Titolo evento *</Label>
              <Input 
                id="title" 
                placeholder="Inserisci titolo evento" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            {/* Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <Select 
                value={client} 
                onValueChange={setClient}
              >
                <SelectTrigger id="client">
                  <SelectValue placeholder="Seleziona cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Località evento con suggerimenti Google Maps */}
            <div className="space-y-2">
              <Label htmlFor="eventLocation">Località evento</Label>
              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="eventLocation" 
                      placeholder="Inserisci località evento" 
                      value={eventLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Suggerimenti località da Google Maps */}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {locationSuggestions.map((suggestion) => (
                        <li 
                          key={suggestion.place_id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Inizia a digitare per vedere i suggerimenti (minimo 3 caratteri)
              </p>
            </div>
            
            {/* Tipo di personale */}
            <div className="space-y-2">
              <Label>Tipologia di personale richiesto *</Label>
              <div className="space-y-2">
                {personnelTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`personnel-${type.id}`} 
                      checked={selectedPersonnel.includes(type.id)}
                      onCheckedChange={() => handlePersonnelChange(type.id)}
                    />
                    <Label htmlFor={`personnel-${type.id}`} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date e orari */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Data e ora inizio */}
              <div className="space-y-2">
                <Label>Data inizio *</Label>
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={it}
                    className="mx-auto"
                  />
                  <div className="mt-4">
                    <Label htmlFor="start-time">Ora inizio *</Label>
                    <Input 
                      id="start-time" 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Data e ora fine */}
              <div className="space-y-2">
                <Label>Data fine *</Label>
                <div className="border rounded-md p-4">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={it}
                    className="mx-auto"
                  />
                  <div className="mt-4">
                    <Label htmlFor="end-time">Ora fine *</Label>
                    <Input 
                      id="end-time" 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                {isEditMode ? "Aggiorna Evento" : "Crea Evento"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

// Aggiungi la dichiarazione del tipo per la callback di Google Maps
declare global {
  interface Window {
    google: typeof google;
    initGoogleMapsCallback: () => void;
  }
}

export default EventCreate;

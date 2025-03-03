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
import { Calendar as CalendarIcon, ArrowLeft, MapPin, Building, Clock, Euro } from "lucide-react";
import { toast } from "sonner";
import { Event } from "./Events";
import { Client } from "./Clients";

const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
];

const EVENTS_STORAGE_KEY = "app_events_data";
const CLIENTS_STORAGE_KEY = "app_clients_data";

interface PlacePrediction {
  description: string;
  place_id: string;
}

declare global {
  interface Window {
    google: {
      maps: {
        places: {
          AutocompleteService: new () => {
            getPlacePredictions: (
              request: { input: string; types?: string[] },
              callback: (
                predictions: PlacePrediction[] | null,
                status: string
              ) => void
            ) => void;
          };
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            OVER_QUERY_LIMIT: string;
            REQUEST_DENIED: string;
            INVALID_REQUEST: string;
            UNKNOWN_ERROR: string;
          };
        };
      };
    };
    initGoogleMapsCallback: () => void;
  }
}

const EventCreate = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  
  const eventId = new URLSearchParams(locationHook.search).get("id");
  const isEditMode = !!eventId;
  
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [eventLocation, setEventLocation] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  const [grossHours, setGrossHours] = useState("");
  const [breakStartTime, setBreakStartTime] = useState("13:00");
  const [breakEndTime, setBreakEndTime] = useState("14:00");
  const [netHours, setNetHours] = useState("");
  const [hourlyRateCost, setHourlyRateCost] = useState("");
  const [hourlyRateSell, setHourlyRateSell] = useState("");
  
  const [clients, setClients] = useState<Client[]>([]);
  
  const googleScriptLoaded = useRef(false);
  const autocompleteService = useRef<any>(null);
  
  useEffect(() => {
    const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
    if (storedClients) {
      try {
        const parsedClients = JSON.parse(storedClients);
        setClients(parsedClients);
      } catch (error) {
        console.error("Errore nel caricamento dei clienti:", error);
        setClients([]);
      }
    } else {
      setClients([]);
    }
  }, []);
  
  useEffect(() => {
    if (!googleScriptLoaded.current) {
      const initGoogleMapsServices = () => {
        if (window.google && window.google.maps && window.google.maps.places) {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          googleScriptLoaded.current = true;
          console.log("Google Maps API loaded successfully");
        }
      };

      const googleMapsScript = document.createElement("script");
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC0HttgvqRiRYKBoRh_pnUsyqem4AqO1zY&libraries=places&callback=initGoogleMapsCallback`;
      googleMapsScript.async = true;
      googleMapsScript.defer = true;
      
      window.initGoogleMapsCallback = initGoogleMapsServices;
      
      document.head.appendChild(googleMapsScript);
      
      return () => {
        document.head.removeChild(googleMapsScript);
        delete window.initGoogleMapsCallback;
      };
    }
  }, []);
  
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
            setTitle(eventToEdit.title);
            
            const clientObject = clients.find(c => c.companyName === eventToEdit.client);
            if (clientObject) {
              setClient(clientObject.id.toString());
            }
            
            setSelectedPersonnel(eventToEdit.personnelTypes);
            setStartDate(eventToEdit.startDate);
            setEndDate(eventToEdit.endDate);
            setStartTime(format(eventToEdit.startDate, "HH:mm"));
            setEndTime(format(eventToEdit.endDate, "HH:mm"));
            
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
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
        toast.error("Impossibile caricare i dati dell'evento");
      }
    }
  }, [eventId, isEditMode, clients]);
  
  const handlePersonnelChange = (personnelId: string) => {
    setSelectedPersonnel((current) => {
      if (current.includes(personnelId)) {
        return current.filter((id) => id !== personnelId);
      } else {
        return [...current, personnelId];
      }
    });
  };
  
  const handleLocationChange = (value: string) => {
    setEventLocation(value);
    
    if (value.length > 2 && autocompleteService.current && googleScriptLoaded.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['(cities)']
        },
        (predictions: PlacePrediction[] | null, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setLocationSuggestions(predictions);
            setShowLocationSuggestions(true);
          } else {
            setLocationSuggestions([]);
            setShowLocationSuggestions(false);
          }
        }
      );
    } else {
      setShowLocationSuggestions(false);
    }
  };
  
  const handleAddressChange = (value: string) => {
    setEventAddress(value);
    
    if (value.length > 2 && autocompleteService.current && googleScriptLoaded.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ['address']
        },
        (predictions: PlacePrediction[] | null, status: string) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            setAddressSuggestions(predictions);
            setShowAddressSuggestions(true);
          } else {
            setAddressSuggestions([]);
            setShowAddressSuggestions(false);
          }
        }
      );
    } else {
      setShowAddressSuggestions(false);
    }
  };
  
  const handleSelectLocationSuggestion = (suggestion: PlacePrediction) => {
    setEventLocation(suggestion.description);
    setShowLocationSuggestions(false);
  };
  
  const handleSelectAddressSuggestion = (suggestion: PlacePrediction) => {
    setEventAddress(suggestion.description);
    setShowAddressSuggestions(false);
  };
  
  useEffect(() => {
    if (grossHours) {
      const breakStart = breakStartTime.split(':').map(Number);
      const breakEnd = breakEndTime.split(':').map(Number);
      
      const breakStartMinutes = breakStart[0] * 60 + breakStart[1];
      const breakEndMinutes = breakEnd[0] * 60 + breakEnd[1];
      
      const breakDurationHours = (breakEndMinutes - breakStartMinutes) / 60;
      
      const netHoursValue = Math.max(0, Number(grossHours) - breakDurationHours);
      
      setNetHours(netHoursValue.toFixed(2));
    } else {
      setNetHours("");
    }
  }, [grossHours, breakStartTime, breakEndTime]);
  
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
        hourlyRateSell: hourlyRateSell ? Number(hourlyRateSell) : undefined
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
                  {clients.length > 0 ? (
                    clients.map((clientItem) => (
                      <SelectItem key={clientItem.id} value={clientItem.id.toString()}>
                        {clientItem.companyName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-clients" disabled>
                      Nessun cliente disponibile
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {clients.length === 0 && (
                <p className="text-sm text-amber-500 mt-1">
                  Non ci sono clienti disponibili. 
                  <Button 
                    variant="link" 
                    className="px-1 py-0 h-auto text-sm" 
                    onClick={() => navigate('/client-create')}
                  >
                    Crea un cliente
                  </Button>
                </p>
              )}
            </div>
            
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
                      placeholder="Inserisci località evento (città)" 
                      value={eventLocation}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {locationSuggestions.map((suggestion) => (
                        <li 
                          key={suggestion.place_id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectLocationSuggestion(suggestion)}
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
            
            <div className="space-y-2">
              <Label htmlFor="eventAddress">Indirizzo evento</Label>
              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Building className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="eventAddress" 
                      placeholder="Inserisci indirizzo specifico dell'evento" 
                      value={eventAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {addressSuggestions.map((suggestion) => (
                        <li 
                          key={suggestion.place_id}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleSelectAddressSuggestion(suggestion)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Inserisci l'indirizzo completo dell'evento (via, numero civico, ecc.)
              </p>
            </div>
            
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
            
            <div className="grid md:grid-cols-2 gap-6">
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
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium mb-4">Informazioni su ore e costi</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grossHours">Ore lorde previste</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="grossHours" 
                      type="number"
                      step="0.5"
                      min="0"
                      placeholder="Inserisci ore lorde" 
                      value={grossHours}
                      onChange={(e) => setGrossHours(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="netHours">Ore nette previste</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="netHours" 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Calcolato automaticamente" 
                      value={netHours}
                      readOnly
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Calcolato automaticamente (ore lorde - pausa)
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label>Pausa prevista</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="breakStartTime" className="text-sm">Da</Label>
                    <Input 
                      id="breakStartTime" 
                      type="time" 
                      value={breakStartTime}
                      onChange={(e) => setBreakStartTime(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="breakEndTime" className="text-sm">A</Label>
                    <Input 
                      id="breakEndTime" 
                      type="time" 
                      value={breakEndTime}
                      onChange={(e) => setBreakEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRateCost">€/h operatore (costo)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Euro className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="hourlyRateCost" 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Es. 15.00" 
                      value={hourlyRateCost}
                      onChange={(e) => setHourlyRateCost(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hourlyRateSell">€/h operatore (prezzo di vendita)</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Euro className="w-4 h-4 text-gray-400" />
                    </div>
                    <Input 
                      id="hourlyRateSell" 
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Es. 25.00" 
                      value={hourlyRateSell}
                      onChange={(e) => setHourlyRateSell(e.target.value)}
                      className="pl-10"
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

export default EventCreate;

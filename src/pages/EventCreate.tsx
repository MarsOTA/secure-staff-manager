import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Event } from "@/types/events";
import { Client } from "./Clients";
import EventForm from "@/components/events/create/EventForm";
import { calculateGrossHours, calculateBreakDuration, calculateNetHours, countEventDays } from "@/components/events/create/eventCreateUtils";

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
          }
        }
      } catch (error) {
        console.error("Errore nel caricare i dati dell'evento:", error);
        toast.error("Impossibile caricare i dati dell'evento");
      }
    }
  }, [eventId, clients]);
  
  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const fullStartDate = new Date(startDate);
      const fullEndDate = new Date(endDate);
      
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      fullStartDate.setHours(startHours, startMinutes, 0, 0);
      fullEndDate.setHours(endHours, endMinutes, 0, 0);
      
      const hours = calculateGrossHours(fullStartDate, fullEndDate);
      setGrossHours(hours.toFixed(2));
      
      const breakDurationPerDay = calculateBreakDuration(breakStartTime, breakEndTime);
      const eventDays = countEventDays(fullStartDate, fullEndDate);
      
      const netHoursValue = calculateNetHours(hours, breakDurationPerDay, eventDays);
      setNetHours(netHoursValue.toFixed(2));
    }
  }, [startDate, endDate, startTime, endTime]);
  
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
  
  const eventData = {
    title,
    client,
    selectedPersonnel,
    personnelCounts,
    startDate,
    endDate,
    startTime,
    endTime,
    eventLocation,
    eventAddress,
    grossHours,
    breakStartTime,
    breakEndTime,
    netHours,
    hourlyRateCost,
    hourlyRateSell
  };
  
  const setters = {
    setTitle,
    setClient,
    setSelectedPersonnel,
    setPersonnelCounts,
    setStartDate,
    setEndDate,
    setStartTime,
    setEndTime,
    setEventLocation,
    setEventAddress,
    setGrossHours,
    setBreakStartTime,
    setBreakEndTime,
    setNetHours,
    setHourlyRateCost,
    setHourlyRateSell
  };
  
  const locationHelpers = {
    locationSuggestions,
    addressSuggestions,
    showLocationSuggestions,
    showAddressSuggestions,
    handleLocationChange,
    handleAddressChange,
    handleSelectLocationSuggestion,
    handleSelectAddressSuggestion
  };

  return (
    <Layout>
      <EventForm 
        eventId={eventId}
        eventData={eventData}
        setters={setters}
        clients={clients}
        locationHelpers={locationHelpers}
      />
    </Layout>
  );
};

export default EventCreate;

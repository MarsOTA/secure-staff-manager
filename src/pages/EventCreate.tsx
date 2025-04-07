
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Client } from "./Clients";
import EventForm from "@/components/events/create/EventForm";
import { useGoogleMapsAutocomplete } from "@/hooks/useGoogleMapsAutocomplete";
import { useEventData } from "@/hooks/useEventData";
import { useEventHoursCalculation } from "@/hooks/useEventHoursCalculation";

const CLIENTS_STORAGE_KEY = "app_clients_data";

const EventCreate = () => {
  const navigate = useNavigate();
  const locationHook = useLocation();
  const eventId = new URLSearchParams(locationHook.search).get("id");
  
  const [clients, setClients] = useState<Client[]>([]);
  
  // Load clients data
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
  
  // Get Google Maps autocomplete functionality
  const googleMapsHelpers = useGoogleMapsAutocomplete();
  
  // Get event data and state setters
  const eventState = useEventData(eventId, clients);
  
  // Setup automatic calculation of hours
  useEventHoursCalculation(
    eventState.startDate,
    eventState.endDate,
    eventState.startTime,
    eventState.endTime,
    eventState.breakStartTime,
    eventState.breakEndTime,
    eventState.setGrossHours,
    eventState.setNetHours
  );
  
  // Prepare data objects for the EventForm
  const eventData = {
    title: eventState.title,
    client: eventState.client,
    selectedPersonnel: eventState.selectedPersonnel,
    personnelCounts: eventState.personnelCounts,
    startDate: eventState.startDate,
    endDate: eventState.endDate,
    startTime: eventState.startTime,
    endTime: eventState.endTime,
    eventLocation: eventState.eventLocation,
    eventAddress: eventState.eventAddress,
    grossHours: eventState.grossHours,
    breakStartTime: eventState.breakStartTime,
    breakEndTime: eventState.breakEndTime,
    netHours: eventState.netHours,
    hourlyRateCost: eventState.hourlyRateCost,
    hourlyRateSell: eventState.hourlyRateSell,
    workShifts: eventState.workShifts
  };
  
  const setters = {
    setTitle: eventState.setTitle,
    setClient: eventState.setClient,
    setSelectedPersonnel: eventState.setSelectedPersonnel,
    setPersonnelCounts: eventState.setPersonnelCounts,
    setStartDate: eventState.setStartDate,
    setEndDate: eventState.setEndDate,
    setStartTime: eventState.setStartTime,
    setEndTime: eventState.setEndTime,
    setEventLocation: eventState.setEventLocation,
    setEventAddress: eventState.setEventAddress,
    setGrossHours: eventState.setGrossHours,
    setBreakStartTime: eventState.setBreakStartTime,
    setBreakEndTime: eventState.setBreakEndTime,
    setNetHours: eventState.setNetHours,
    setHourlyRateCost: eventState.setHourlyRateCost,
    setHourlyRateSell: eventState.setHourlyRateSell,
    setWorkShifts: eventState.setWorkShifts
  };
  
  const locationHelpers = {
    locationSuggestions: googleMapsHelpers.locationSuggestions,
    addressSuggestions: googleMapsHelpers.addressSuggestions,
    showLocationSuggestions: googleMapsHelpers.showLocationSuggestions,
    showAddressSuggestions: googleMapsHelpers.showAddressSuggestions,
    handleLocationChange: (value: string) => {
      eventState.setEventLocation(value);
      googleMapsHelpers.handleLocationChange(value);
    },
    handleAddressChange: (value: string) => {
      eventState.setEventAddress(value);
      googleMapsHelpers.handleAddressChange(value);
    },
    handleSelectLocationSuggestion: (suggestion: any) => {
      const locationValue = googleMapsHelpers.handleSelectLocationSuggestion(suggestion);
      eventState.setEventLocation(locationValue);
    },
    handleSelectAddressSuggestion: (suggestion: any) => {
      const addressValue = googleMapsHelpers.handleSelectAddressSuggestion(suggestion);
      eventState.setEventAddress(addressValue);
    }
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

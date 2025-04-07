
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Building } from "lucide-react";
import { LocationHelpers } from "./types/eventFormTypes";

interface LocationSectionProps {
  eventLocation: string;
  eventAddress: string;
  locationHelpers: LocationHelpers;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  eventLocation,
  eventAddress,
  locationHelpers
}) => {
  const {
    locationSuggestions,
    addressSuggestions,
    showLocationSuggestions,
    showAddressSuggestions,
    handleLocationChange,
    handleAddressChange,
    handleSelectLocationSuggestion,
    handleSelectAddressSuggestion
  } = locationHelpers;

  return (
    <>
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
    </>
  );
};

export default LocationSection;

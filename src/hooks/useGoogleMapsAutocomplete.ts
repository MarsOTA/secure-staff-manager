
import { useRef, useEffect, useState } from "react";
import { PlacePrediction } from "@/components/events/create/types/eventFormTypes";

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

export function useGoogleMapsAutocomplete() {
  const [locationSuggestions, setLocationSuggestions] = useState<PlacePrediction[]>([]);
  const [addressSuggestions, setAddressSuggestions] = useState<PlacePrediction[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  
  const googleScriptLoaded = useRef(false);
  const autocompleteService = useRef<any>(null);
  
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
  
  const handleLocationChange = (value: string) => {
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
    setShowLocationSuggestions(false);
    return suggestion.description;
  };
  
  const handleSelectAddressSuggestion = (suggestion: PlacePrediction) => {
    setShowAddressSuggestions(false);
    return suggestion.description;
  };
  
  return {
    locationSuggestions,
    addressSuggestions,
    showLocationSuggestions,
    showAddressSuggestions,
    handleLocationChange,
    handleAddressChange,
    handleSelectLocationSuggestion,
    handleSelectAddressSuggestion
  };
}


import { WorkShift } from "@/types/events";

export interface EventFormData {
  title: string;
  client: string;
  selectedPersonnel: string[];
  personnelCounts: Record<string, number>;
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  eventLocation: string;
  eventAddress: string;
  grossHours: string;
  breakStartTime: string;
  breakEndTime: string;
  netHours: string;
  hourlyRateCost: string;
  hourlyRateSell: string;
  workShifts: WorkShift[];
}

export interface EventFormSetters {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setClient: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPersonnel: React.Dispatch<React.SetStateAction<string[]>>;
  setPersonnelCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  setEventLocation: React.Dispatch<React.SetStateAction<string>>;
  setEventAddress: React.Dispatch<React.SetStateAction<string>>;
  setGrossHours: React.Dispatch<React.SetStateAction<string>>;
  setBreakStartTime: React.Dispatch<React.SetStateAction<string>>;
  setBreakEndTime: React.Dispatch<React.SetStateAction<string>>;
  setNetHours: React.Dispatch<React.SetStateAction<string>>;
  setHourlyRateCost: React.Dispatch<React.SetStateAction<string>>;
  setHourlyRateSell: React.Dispatch<React.SetStateAction<string>>;
  setWorkShifts: React.Dispatch<React.SetStateAction<WorkShift[]>>;
}

export interface PlacePrediction {
  description: string;
  place_id: string;
}

export interface LocationHelpers {
  locationSuggestions: PlacePrediction[];
  addressSuggestions: PlacePrediction[];
  showLocationSuggestions: boolean;
  showAddressSuggestions: boolean;
  handleLocationChange: (value: string) => void;
  handleAddressChange: (value: string) => void;
  handleSelectLocationSuggestion: (suggestion: PlacePrediction) => void;
  handleSelectAddressSuggestion: (suggestion: PlacePrediction) => void;
}

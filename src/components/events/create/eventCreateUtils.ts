
// Utility functions for event creation

// Combines a date and time string into a single Date object
export const combineDateTime = (date: Date | undefined, timeString: string): Date => {
  if (!date) return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate;
};

// Interface for place prediction from Google Places API
export interface PlacePrediction {
  description: string;
  place_id: string;
}

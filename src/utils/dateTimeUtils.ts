
// Date and time utility functions

// Combines a date and time string into a single Date object
export const combineDateTime = (date: Date | undefined, timeString: string): Date => {
  if (!date) return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes);
  return newDate;
};

// Count number of days in an event
export const countEventDays = (startDate: Date, endDate: Date): number => {
  if (!startDate || !endDate) return 1;
  
  // Create copies of dates and reset time to compare just the dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive
  
  return Math.max(diffDays, 1); // Ensure at least 1 day
};

// Calculate break duration in hours per day
export const calculateBreakDuration = (breakStartTime: string, breakEndTime: string): number => {
  if (!breakStartTime || !breakEndTime) return 0;
  
  try {
    const [startHours, startMinutes] = breakStartTime.split(':').map(Number);
    const [endHours, endMinutes] = breakEndTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    // Calculate difference in minutes
    const diffMinutes = endTotalMinutes - startTotalMinutes;
    
    // Convert to hours (decimal)
    return diffMinutes > 0 ? Math.round((diffMinutes / 60) * 100) / 100 : 0;
  } catch (error) {
    console.error("Errore nel calcolo della durata della pausa:", error);
    return 0;
  }
};

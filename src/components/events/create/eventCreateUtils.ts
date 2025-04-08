
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

// Calculate gross hours between two dates considering multiple days
export const calculateGrossHours = (startDate: Date, endDate: Date): number => {
  if (!startDate || !endDate) return 0;
  
  // Calculate total milliseconds difference
  const diffMs = endDate.getTime() - startDate.getTime();
  
  // Convert milliseconds to hours
  const diffHours = diffMs / (1000 * 60 * 60);
  
  // Return rounded to 2 decimal places
  return Math.round(diffHours * 100) / 100;
};

// Calculate gross hours based on work shifts
export const calculateGrossHoursFromShifts = (
  workShifts: { dayOfWeek: string; startTime: string; endTime: string }[], 
  startDate: Date, 
  endDate: Date
): number => {
  if (!workShifts.length || !startDate || !endDate) return 0;
  
  const days = countEventDays(startDate, endDate);
  let totalHours = 0;
  
  // Per ogni turno, calcola le ore
  workShifts.forEach(shift => {
    const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
    const [endHours, endMinutes] = shift.endTime.split(':').map(Number);
    
    let shiftDuration: number;
    
    // Calcola la durata del turno in ore
    if (endHours > startHours || (endHours === startHours && endMinutes >= startMinutes)) {
      // Lo stesso giorno
      shiftDuration = (endHours - startHours) + (endMinutes - startMinutes) / 60;
    } else {
      // Turno notturno che si estende al giorno successivo
      shiftDuration = (24 - startHours + endHours) + (endMinutes - startMinutes) / 60;
    }
    
    // Moltiplica per il numero di giorni in cui questo turno è applicabile
    let applicableDays = 1; // Default: un solo giorno
    
    if (shift.dayOfWeek === "lunedi-venerdi") {
      // Calcola quanti giorni feriali (lunedì-venerdì) ci sono nell'evento
      applicableDays = calculateWeekdaysInRange(startDate, endDate);
    } else if (shift.dayOfWeek === "sabato-domenica") {
      // Calcola quanti weekend (sabato-domenica) ci sono nell'evento
      applicableDays = calculateWeekendsInRange(startDate, endDate);
    } else {
      // Per singoli giorni, controlla quante volte quel giorno appare nell'intervallo
      applicableDays = countSpecificDayInRange(shift.dayOfWeek, startDate, endDate);
    }
    
    totalHours += shiftDuration * applicableDays;
  });
  
  return Math.round(totalHours * 100) / 100;
};

// Conta quanti giorni feriali (lunedì-venerdì) ci sono nell'intervallo di date
const calculateWeekdaysInRange = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Resetta l'ora a mezzanotte per considerare solo i giorni
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Itera attraverso ogni giorno nell'intervallo
  const currentDate = new Date(start);
  while (currentDate <= end) {
    // 0 = domenica, 1-5 = lunedì-venerdì, 6 = sabato
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      count++;
    }
    
    // Passa al giorno successivo
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

// Conta quanti giorni weekend (sabato-domenica) ci sono nell'intervallo di date
const calculateWeekendsInRange = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Resetta l'ora a mezzanotte per considerare solo i giorni
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Itera attraverso ogni giorno nell'intervallo
  const currentDate = new Date(start);
  while (currentDate <= end) {
    // 0 = domenica, 6 = sabato
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      count++;
    }
    
    // Passa al giorno successivo
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

// Conta quante volte un giorno specifico appare nell'intervallo di date
const countSpecificDayInRange = (dayOfWeek: string, startDate: Date, endDate: Date): number => {
  const dayMap: Record<string, number> = {
    domenica: 0,
    lunedi: 1,
    martedi: 2,
    mercoledi: 3,
    giovedi: 4,
    venerdi: 5,
    sabato: 6
  };
  
  // Ottieni il numero del giorno della settimana (0-6)
  const targetDayNum = dayMap[dayOfWeek];
  if (targetDayNum === undefined) return 0;
  
  let count = 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Resetta l'ora a mezzanotte per considerare solo i giorni
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // Itera attraverso ogni giorno nell'intervallo
  const currentDate = new Date(start);
  while (currentDate <= end) {
    if (currentDate.getDay() === targetDayNum) {
      count++;
    }
    
    // Passa al giorno successivo
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
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

// Calculate net hours by subtracting break time for each day from gross hours
export const calculateNetHours = (grossHours: number, breakDuration: number, days: number): number => {
  if (!grossHours) return 0;
  
  const totalBreakDuration = breakDuration * days;
  return Math.max(0, Math.round((grossHours - totalBreakDuration) * 100) / 100);
};

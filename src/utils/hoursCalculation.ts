
import { countEventDays } from "./dateTimeUtils";
import { WorkShift } from "@/types/events";
import { dayMapping } from "./dayMappingUtils";

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
  workShifts: WorkShift[], 
  startDate: Date, 
  endDate: Date
): number => {
  if (!workShifts.length || !startDate || !endDate) return 0;
  
  // Calcola il numero totale di giorni dell'evento
  const eventDays = countEventDays(startDate, endDate);
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
    
    // Determina per quanti giorni questo turno è applicabile in base al giorno della settimana
    let applicableDays = 0;
    
    if (shift.dayOfWeek === "lunedi-venerdi") {
      // Calcola quanti giorni feriali (lunedì-venerdì) ci sono nell'evento
      applicableDays = calculateWeekdaysInRange(startDate, endDate);
    } else if (shift.dayOfWeek === "sabato-domenica") {
      // Calcola quanti weekend (sabato-domenica) ci sono nell'evento
      applicableDays = calculateWeekendsInRange(startDate, endDate);
    } else if (shift.dayOfWeek === "tutti") {
      // Il turno si applica a tutti i giorni dell'evento
      applicableDays = eventDays;
    } else {
      // Per singoli giorni, controlla quante volte quel giorno appare nell'intervallo
      applicableDays = countSpecificDayInRange(shift.dayOfWeek, startDate, endDate);
    }
    
    // Moltiplica le ore del turno per il numero di giorni applicabili
    totalHours += shiftDuration * applicableDays;
  });
  
  return Math.round(totalHours * 100) / 100;
};

// Calculate net hours by subtracting break time for each day from gross hours
export const calculateNetHours = (grossHours: number, breakDuration: number, days: number): number => {
  if (!grossHours) return 0;
  
  const totalBreakDuration = breakDuration * days;
  return Math.max(0, Math.round((grossHours - totalBreakDuration) * 100) / 100);
};

// Conta quante volte un giorno specifico appare nell'intervallo di date
export const countSpecificDayInRange = (dayOfWeek: string, startDate: Date, endDate: Date): number => {
  const targetDayNum = dayMapping[dayOfWeek];
  
  // Se è "tutti", ritorna il numero totale di giorni
  if (targetDayNum === -1) {
    return countEventDays(startDate, endDate);
  }
  
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

// Conta quanti giorni feriali (lunedì-venerdì) ci sono nell'intervallo di date
export const calculateWeekdaysInRange = (startDate: Date, endDate: Date): number => {
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
export const calculateWeekendsInRange = (startDate: Date, endDate: Date): number => {
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

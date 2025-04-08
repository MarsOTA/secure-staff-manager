
import { useEffect } from "react";
import { calculateGrossHoursFromShifts, calculateNetHours } from "@/utils/hoursCalculation";
import { calculateBreakDuration, countEventDays } from "@/utils/dateTimeUtils";
import { WorkShift } from "@/types/events";

export function useEventHoursCalculation(
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string,
  endTime: string,
  breakStartTime: string,
  breakEndTime: string,
  workShifts: WorkShift[],
  setGrossHours: (hours: string) => void,
  setNetHours: (hours: string) => void
) {
  useEffect(() => {
    if (startDate && endDate) {
      let hours: number;
      
      // Se ci sono turni di lavoro, calcola le ore lorde dai turni
      if (workShifts.length > 0) {
        hours = calculateGrossHoursFromShifts(workShifts, startDate, endDate);
        console.log("Ore calcolate dai turni:", hours);
      } else if (startTime && endTime) {
        // Altrimenti usa il metodo tradizionale basato su date di inizio e fine evento
        const eventDays = countEventDays(startDate, endDate);
        console.log("Numero di giorni evento:", eventDays);
        
        // Calcola le ore per un singolo giorno
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        let hoursPerDay;
        if (endHours > startHours || (endHours === startHours && endMinutes >= startMinutes)) {
          // Lo stesso giorno
          hoursPerDay = (endHours - startHours) + (endMinutes - startMinutes) / 60;
        } else {
          // Turno notturno che si estende al giorno successivo
          hoursPerDay = (24 - startHours + endHours) + (endMinutes - startMinutes) / 60;
        }
        
        // Moltiplica le ore giornaliere per il numero di giorni dell'evento
        hours = hoursPerDay * eventDays;
        console.log("Ore per giorno:", hoursPerDay, "x", eventDays, "=", hours);
      } else {
        hours = 0;
      }
      
      setGrossHours(hours.toFixed(2));
      
      const breakDurationPerDay = calculateBreakDuration(breakStartTime, breakEndTime);
      const eventDays = countEventDays(startDate, endDate);
      
      const netHoursValue = calculateNetHours(hours, breakDurationPerDay, eventDays);
      setNetHours(netHoursValue.toFixed(2));
    }
  }, [startDate, endDate, startTime, endTime, breakStartTime, breakEndTime, workShifts, setGrossHours, setNetHours]);
}

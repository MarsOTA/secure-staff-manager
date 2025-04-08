
import { useEffect } from "react";
import { calculateGrossHours, calculateBreakDuration, calculateNetHours, countEventDays, calculateGrossHoursFromShifts } from "@/components/events/create/eventCreateUtils";
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
      } else if (startTime && endTime) {
        // Altrimenti usa il metodo tradizionale con orario di inizio e fine
        const fullStartDate = new Date(startDate);
        const fullEndDate = new Date(endDate);
        
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        
        fullStartDate.setHours(startHours, startMinutes, 0, 0);
        fullEndDate.setHours(endHours, endMinutes, 0, 0);
        
        hours = calculateGrossHours(fullStartDate, fullEndDate);
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

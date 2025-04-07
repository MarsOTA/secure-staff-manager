
import { useEffect } from "react";
import { calculateGrossHours, calculateBreakDuration, calculateNetHours, countEventDays } from "@/components/events/create/eventCreateUtils";

export function useEventHoursCalculation(
  startDate: Date | undefined,
  endDate: Date | undefined,
  startTime: string,
  endTime: string,
  breakStartTime: string,
  breakEndTime: string,
  setGrossHours: (hours: string) => void,
  setNetHours: (hours: string) => void
) {
  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      const fullStartDate = new Date(startDate);
      const fullEndDate = new Date(endDate);
      
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      
      fullStartDate.setHours(startHours, startMinutes, 0, 0);
      fullEndDate.setHours(endHours, endMinutes, 0, 0);
      
      const hours = calculateGrossHours(fullStartDate, fullEndDate);
      setGrossHours(hours.toFixed(2));
      
      const breakDurationPerDay = calculateBreakDuration(breakStartTime, breakEndTime);
      const eventDays = countEventDays(fullStartDate, fullEndDate);
      
      const netHoursValue = calculateNetHours(hours, breakDurationPerDay, eventDays);
      setNetHours(netHoursValue.toFixed(2));
    }
  }, [startDate, endDate, startTime, endTime, breakStartTime, breakEndTime, setGrossHours, setNetHours]);
}

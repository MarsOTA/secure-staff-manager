
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "../types";
import { ExtendedOperator } from "@/types/operator";
import { fetchOperatorEvents } from "../api"; // Updated import
import { 
  calculateSummary, 
  processPayrollCalculations, 
  validateAttendance 
} from "../utils/payrollCalculations";

export const usePayrollData = (operator: ExtendedOperator, contractHourlyRate: number = 0) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calculations, setCalculations] = useState<PayrollCalculation[]>([]);
  const [summaryData, setSummaryData] = useState<PayrollSummary>({
    totalGrossHours: 0,
    totalNetHours: 0,
    totalCompensation: 0,
    totalAllowances: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Calculate break duration in hours
  const calculateBreakDuration = (breakStartTime: string | undefined, breakEndTime: string | undefined): number => {
    if (!breakStartTime || !breakEndTime) return 0;
    
    try {
      const [startHours, startMinutes] = breakStartTime.split(':').map(Number);
      const [endHours, endMinutes] = breakEndTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      // Calculate difference in minutes
      const diffMinutes = endTotalMinutes - startTotalMinutes;
      
      // Convert to hours (decimal)
      return diffMinutes > 0 ? diffMinutes / 60 : 0;
    } catch (error) {
      console.error("Errore nel calcolo della durata della pausa:", error);
      return 0;
    }
  };

  // Update actual hours for an event
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Use contract hourly rate if available, otherwise use the default
          const hourlyRate = contractHourlyRate > 0 ? contractHourlyRate : 15; // Default hourly rate
          const newCompensation = actualHours * hourlyRate;
          
          return { 
            ...calc, 
            actual_hours: actualHours,
            compensation: newCompensation
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary
      const newSummary = calculateSummary(updatedCalculations);
      setSummaryData(newSummary);
      
      toast.success("Ore effettive aggiornate con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento delle ore effettive:", error);
      toast.error("Errore nell'aggiornamento delle ore effettive");
      return false;
    }
  };

  // Add the updateAllowance function
  const updateAllowance = (eventId: number, type: 'meal' | 'travel', value: number) => {
    try {
      // Update calculations with the new allowance value
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          if (type === 'meal') {
            return { 
              ...calc, 
              mealAllowance: value
            };
          } else {
            return { 
              ...calc, 
              travelAllowance: value
            };
          }
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Calculate new summary
      const newSummary = calculateSummary(updatedCalculations);
      setSummaryData(newSummary);
      
      toast.success("Rimborsi aggiornati con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento dei rimborsi:", error);
      toast.error("Errore nell'aggiornamento dei rimborsi");
      return false;
    }
  };

  // Load events and calculate payroll from Supabase or localStorage
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log("Loading events for operator ID:", operator.id);
        
        // Fetch events for this operator
        const { events: eventsData, calculations: calculationsData } = await fetchOperatorEvents(operator.id);
        
        if (!eventsData || eventsData.length === 0) {
          console.log("No events found for operator ID:", operator.id);
          setEvents([]);
          setCalculations([]);
          setSummaryData({
            totalGrossHours: 0,
            totalNetHours: 0,
            totalCompensation: 0,
            totalAllowances: 0,
            totalRevenue: 0
          });
          setLoading(false);
          return;
        }

        // Process completed events and calculate actual hours
        const processedCalculations = calculationsData.map(calc => {
          // Count number of days in the event
          const start = new Date(calc.start_date);
          const end = new Date(calc.end_date);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          const diffTime = end.getTime() - start.getTime();
          const eventDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive

          // Calculate break duration for each day
          const breakDuration = calculateBreakDuration(calc.breakStartTime, calc.breakEndTime) * Math.max(eventDays, 1);
          
          // Get net hours from the event data directly
          // We prioritize using the netHours from the event data itself
          const grossHours = calc.grossHours;
          const netHours = calc.netHours || Math.max(grossHours - breakDuration, 0);
          
          // Always use netHours from the event data for actual_hours if not already set
          const actual_hours = calc.actual_hours !== undefined ? calc.actual_hours : netHours;
          
          // Use contract hourly rate if available, otherwise use the default
          const hourlyRate = contractHourlyRate > 0 ? contractHourlyRate : 15;
          const compensation = actual_hours * hourlyRate;
          
          return {
            ...calc,
            netHours,
            actual_hours,
            breakDuration,
            eventDays: Math.max(eventDays, 1),
            compensation
          };
        });
        
        // Set events and calculations
        setEvents(eventsData);
        setCalculations(processedCalculations);
        
        // Calculate summary
        const summary = calculateSummary(processedCalculations);
        setSummaryData(summary);
        
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        toast.error("Errore nel caricamento degli eventi");
        
        setEvents([]);
        setCalculations([]);
        setSummaryData({
          totalGrossHours: 0,
          totalNetHours: 0,
          totalCompensation: 0,
          totalAllowances: 0,
          totalRevenue: 0
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [operator.id, contractHourlyRate]);

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    updateAllowance
  };
};

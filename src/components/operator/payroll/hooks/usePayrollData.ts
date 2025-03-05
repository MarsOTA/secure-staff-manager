
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "../types";
import { ExtendedOperator } from "@/types/operator";
import { fetchOperatorEvents } from "../api/payrollApi";
import { 
  calculateSummary, 
  processPayrollCalculations, 
  validateAttendance 
} from "../utils/payrollCalculations";

export const usePayrollData = (operator: ExtendedOperator) => {
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

  // Load events and calculate payroll from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log("Loading events for operator ID:", operator.id);
        
        // Fetch events for this operator
        const { events: eventsData, calculations: calculationsData } = await fetchOperatorEvents(operator.id);
        
        // If no events found
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
          return;
        }
        
        // Set events and calculations
        setEvents(eventsData);
        setCalculations(calculationsData);
        
        // Calculate summary
        const summary = calculateSummary(calculationsData);
        setSummaryData(summary);
        
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        toast.error("Errore nel caricamento degli eventi");
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [operator.id]);

  // Update attendance for an event
  const updateAttendance = (eventId: number, attendanceValue: string | null) => {
    if (!attendanceValue) return false;
    
    try {
      // Validate the selected attendance
      const validAttendance = validateAttendance(attendanceValue);
      
      // Update local state
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, attendance: validAttendance } 
          : e
      ));
      
      setCalculations(calculations.map(calc => 
        calc.eventId === eventId 
          ? { ...calc, attendance: validAttendance } 
          : calc
      ));
      
      // Calculate new summary
      const newCalculations = calculations.map(calc => 
        calc.eventId === eventId 
          ? { ...calc, attendance: validAttendance } 
          : calc
      );
      
      const newSummary = calculateSummary(newCalculations);
      setSummaryData(newSummary);
      
      toast.success("Presenza aggiornata con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento della presenza:", error);
      toast.error("Errore nell'aggiornamento della presenza");
      return false;
    }
  };

  // Update actual hours for an event
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Update compensation and revenue based on actual hours
          const hourlyRate = calc.compensation / (calc.netHours || 1);
          const newCompensation = actualHours * hourlyRate;
          const newRevenue = actualHours * (calc.totalRevenue / (calc.netHours || 1));
          
          return { 
            ...calc, 
            actual_hours: actualHours,
            compensation: newCompensation,
            totalRevenue: newRevenue
          };
        }
        return calc;
      });
      
      setCalculations(updatedCalculations);
      
      // Also update events if needed
      setEvents(events.map(e => 
        e.id === eventId 
          ? { ...e, actual_hours: actualHours } 
          : e
      ));
      
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

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateAttendance,
    updateActualHours
  };
};

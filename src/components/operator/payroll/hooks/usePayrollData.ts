
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

  // Update actual hours for an event
  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      // Update calculations with the new actual hours
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          // Calculate compensation based on actual hours
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
          if (calc.actual_hours === undefined) {
            // For completed events without actual hours set, use estimated hours minus break
            const grossHours = calc.grossHours;
            const netHours = grossHours > 5 ? grossHours - 1 : grossHours;
            return {
              ...calc,
              netHours,
              actual_hours: netHours // Set actual_hours equal to netHours (estimated - break)
            };
          }
          return calc;
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
  }, [operator.id]);

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours
  };
};

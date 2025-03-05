
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "./types";
import { ExtendedOperator } from "@/types/operator";

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

  // Helper function to validate attendance value
  const validateAttendance = (value: any): "present" | "absent" | "late" | null => {
    if (value === "present" || value === "absent" || value === "late") {
      return value;
    }
    return null;
  };

  // Calculate summary totals based on calculations
  const calculateSummary = (calculationsData: PayrollCalculation[]): PayrollSummary => {
    return calculationsData
      .filter(calc => calc.attendance === "present" || calc.attendance === "late")
      .reduce((acc, curr) => {
        const hoursToUse = curr.actual_hours || curr.netHours;
        return {
          totalGrossHours: acc.totalGrossHours + (curr.actual_hours || curr.grossHours),
          totalNetHours: acc.totalNetHours + hoursToUse,
          totalCompensation: acc.totalCompensation + curr.compensation,
          totalAllowances: acc.totalAllowances + (curr.mealAllowance + curr.travelAllowance),
          totalRevenue: acc.totalRevenue + curr.totalRevenue
        };
      }, {
        totalGrossHours: 0,
        totalNetHours: 0,
        totalCompensation: 0,
        totalAllowances: 0,
        totalRevenue: 0
      });
  };

  // Load events and calculate payroll from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log("Loading events for operator ID:", operator.id);
        
        // Fetch events and event_operators data for this operator
        const { data: eventOperatorsData, error: eventOperatorsError } = await supabase
          .from('event_operators')
          .select(`
            id,
            event_id,
            hourly_rate,
            total_hours,
            net_hours,
            meal_allowance,
            travel_allowance,
            total_compensation,
            revenue_generated,
            events(
              id,
              title,
              start_date,
              end_date,
              location,
              status,
              clients(name)
            )
          `)
          .eq('operator_id', operator.id);
        
        if (eventOperatorsError) {
          console.error("Errore nel caricamento degli eventi:", eventOperatorsError);
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
          setLoading(false);
          return;
        }
        
        console.log("Event operators data:", eventOperatorsData);
        
        if (!eventOperatorsData || eventOperatorsData.length === 0) {
          // No events found
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
        
        // Process events data with proper type casting for status and attendance
        const eventsData = eventOperatorsData.map(item => {
          if (!item.events) {
            console.warn("Event data missing for event_operator entry:", item);
            return null;
          }
          
          // Ensure status is one of the valid enum values, or default to "upcoming"
          let validStatus: "upcoming" | "in-progress" | "completed" | "cancelled" = "upcoming";
          
          if (item.events.status === "upcoming" || 
              item.events.status === "in-progress" || 
              item.events.status === "completed" || 
              item.events.status === "cancelled") {
            validStatus = item.events.status as "upcoming" | "in-progress" | "completed" | "cancelled";
          }
          
          // Check if event is past for automatic attendance
          const endDate = new Date(item.events.end_date);
          const now = new Date();
          const isPast = endDate < now;
          
          // Default attendance value for completed past events with proper type validation
          const attendanceValue = isPast && validStatus === "completed" ? "present" as const : null;
          
          return {
            id: item.events.id,
            title: item.events.title,
            client: item.events.clients?.name || 'Cliente sconosciuto',
            start_date: item.events.start_date,
            end_date: item.events.end_date,
            location: item.events.location || '',
            status: validStatus,
            hourly_rate: item.hourly_rate || 15,
            hourly_rate_sell: item.revenue_generated ? (item.revenue_generated / (item.net_hours || 1)) : 25,
            attendance: attendanceValue,
            estimated_hours: item.total_hours || 0
          };
        }).filter(Boolean) as Event[];
        
        setEvents(eventsData);
        
        // Generate payroll calculations
        const payrollData = eventOperatorsData.map(item => {
          if (!item.events) {
            console.warn("Event data missing for calculation:", item);
            return null;
          }
          
          const event = item.events;
          const endDate = new Date(event.end_date);
          const now = new Date();
          const isPast = endDate < now;
          
          // Use provided hours from database first
          const totalHours = item.total_hours || 0;
          const netHours = item.net_hours || (totalHours > 5 ? totalHours - 1 : totalHours); // 1 hour lunch break if > 5 hours
          const hourlyRate = item.hourly_rate || 15;
          const compensation = item.total_compensation || (netHours * hourlyRate);
          const mealAllowance = item.meal_allowance || (totalHours > 5 ? 10 : 0);
          const travelAllowance = item.travel_allowance || 15;
          const totalRevenue = item.revenue_generated || (netHours * (hourlyRate * 1.667)); // Default margin
          
          // Default attendance for completed past events with proper type validation
          const attendanceValue = isPast && event.status === "completed" ? "present" as const : null;
          
          return {
            eventId: event.id,
            eventTitle: event.title,
            client: event.clients?.name || 'Cliente sconosciuto',
            date: new Date(event.start_date).toLocaleDateString('it-IT'),
            grossHours: totalHours,
            netHours,
            compensation,
            mealAllowance,
            travelAllowance,
            totalRevenue,
            attendance: attendanceValue,
            estimated_hours: totalHours,
            actual_hours: undefined // Will be set by user
          };
        }).filter(Boolean) as PayrollCalculation[];
        
        setCalculations(payrollData);
        
        // Calculate summary
        const summary = calculateSummary(payrollData);
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

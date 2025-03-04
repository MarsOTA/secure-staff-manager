
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
        return {
          totalGrossHours: acc.totalGrossHours + curr.grossHours,
          totalNetHours: acc.totalNetHours + curr.netHours,
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
          return;
        }
        
        if (!eventOperatorsData || eventOperatorsData.length === 0) {
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
        
        // Process events data - with proper type casting for status and attendance
        const eventsData = eventOperatorsData.map(item => {
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
            attendance: attendanceValue
          };
        });
        
        setEvents(eventsData);
        
        // Generate payroll calculations
        const payrollData = eventOperatorsData.map(item => {
          const event = item.events;
          const endDate = new Date(event.end_date);
          const now = new Date();
          const isPast = endDate < now;
          
          // In case we need to calculate on our own (fallback)
          const startDate = new Date(event.start_date);
          const totalHours = item.total_hours || (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
          const netHours = item.net_hours || (totalHours > 5 ? totalHours - 1 : totalHours); // 1 hour lunch break if > 5 hours
          const hourlyRate = item.hourly_rate || 15;
          const compensation = item.total_compensation || (netHours * hourlyRate);
          const mealAllowance = item.meal_allowance || (totalHours > 5 ? 10 : 0);
          const travelAllowance = item.travel_allowance || 15;
          const totalRevenue = item.revenue_generated || (netHours * (item.hourly_rate * 1.667)); // Default margin
          
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
            attendance: attendanceValue
          };
        });
        
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
    if (!attendanceValue) return;
    
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

  return {
    events,
    calculations,
    summaryData,
    loading,
    updateAttendance
  };
};

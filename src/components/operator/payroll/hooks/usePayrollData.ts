import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Event, PayrollCalculation, PayrollSummary } from "../types";
import { ExtendedOperator } from "@/types/operator";
import { fetchOperatorEvents } from "../api/apiCore";
import { supabase } from "@/integrations/supabase/client";
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

  const calculateBreakDuration = (breakStartTime: string | undefined, breakEndTime: string | undefined): number => {
    if (!breakStartTime || !breakEndTime) return 0;
    
    try {
      const [startHours, startMinutes] = breakStartTime.split(':').map(Number);
      const [endHours, endMinutes] = breakEndTime.split(':').map(Number);
      
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = endHours * 60 + endMinutes;
      
      const diffMinutes = endTotalMinutes - startTotalMinutes;
      
      return diffMinutes > 0 ? diffMinutes / 60 : 0;
    } catch (error) {
      console.error("Errore nel calcolo della durata della pausa:", error);
      return 0;
    }
  };

  const updateActualHours = (eventId: number, actualHours: number) => {
    try {
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          const hourlyRate = contractHourlyRate > 0 ? contractHourlyRate : 15;
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

  const updateAllowance = (eventId: number, type: 'meal' | 'travel', value: number) => {
    try {
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

  const updateAttendance = async (eventId: number, attendance: string | null) => {
    try {
      if (!attendance) {
        toast.error("Stato di presenza non valido");
        return false;
      }

      const validAttendance = attendance as "present" | "absent" | "late" | "completed" | null;
      
      const updatedEvents = events.map(event => {
        if (event.id === eventId) {
          return { 
            ...event, 
            attendance: validAttendance
          };
        }
        return event;
      });
      
      const updatedCalculations = calculations.map(calc => {
        if (calc.eventId === eventId) {
          return { 
            ...calc, 
            attendance: validAttendance
          };
        }
        return calc;
      });
      
      setEvents(updatedEvents as Event[]);
      setCalculations(updatedCalculations as PayrollCalculation[]);
      
      if (operator.id) {
        console.log("Updating attendance in database:", eventId, attendance, operator.id);
        const { error } = await supabase
          .from('attendance')
          .insert({
            operator_id: operator.id,
            event_id: eventId,
            status: attendance,
            latitude: null,
            longitude: null
          });
          
        if (error) {
          console.error("Error updating attendance in database:", error);
          toast.error("Errore nell'aggiornamento dello stato di presenza nel database");
          return false;
        }
        
        console.log("Successfully updated attendance in database");
      }
      
      toast.success("Stato di presenza aggiornato con successo");
      return true;
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato di presenza:", error);
      toast.error("Errore nell'aggiornamento dello stato di presenza");
      return false;
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log("Loading events for operator ID:", operator.id);
        
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

        const eventsWithAttendance = await Promise.all(eventsData.map(async (event) => {
          const { data: attendanceRecords, error } = await supabase
            .from('attendance')
            .select('*')
            .eq('event_id', event.id)
            .eq('operator_id', operator.id)
            .order('timestamp', { ascending: false });
            
          if (error) {
            console.error("Error fetching attendance records:", error);
            return event;
          }
          
          if (attendanceRecords && attendanceRecords.length > 0) {
            const lastRecord = attendanceRecords[0];
            const statusMap: Record<string, "present" | "absent" | "late" | "completed"> = {
              'check-in': 'present',
              'check-out': 'completed',
              'present': 'present',
              'absent': 'absent',
              'late': 'late',
              'completed': 'completed'
            };
            
            return {
              ...event,
              attendance: statusMap[lastRecord.status] || null
            };
          }
          
          return event;
        }));

        const processedCalculations = calculationsData.map(calc => {
          const eventWithAttendance = eventsWithAttendance.find(e => e.id === calc.eventId);
          
          const start = new Date(calc.start_date);
          const end = new Date(calc.end_date);
          start.setHours(0, 0, 0, 0);
          end.setHours(0, 0, 0, 0);
          const diffTime = end.getTime() - start.getTime();
          const eventDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          
          const breakDuration = calculateBreakDuration(calc.breakStartTime, calc.breakEndTime) * Math.max(eventDays, 1);
          
          const grossHours = calc.grossHours;
          const netHours = calc.netHours || Math.max(grossHours - breakDuration, 0);
          
          const actual_hours = calc.actual_hours !== undefined ? calc.actual_hours : netHours;
          
          const hourlyRate = contractHourlyRate > 0 ? contractHourlyRate : 15;
          const compensation = actual_hours * hourlyRate;
          
          return {
            ...calc,
            netHours,
            actual_hours,
            breakDuration,
            eventDays: Math.max(eventDays, 1),
            compensation,
            attendance: eventWithAttendance?.attendance || calc.attendance
          };
        });
        
        setEvents(eventsWithAttendance as Event[]);
        setCalculations(processedCalculations as PayrollCalculation[]);
        
        const summary = calculateSummary(processedCalculations as PayrollCalculation[]);
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
    updateAllowance,
    updateAttendance
  };
};

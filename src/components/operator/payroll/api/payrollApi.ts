
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";

// Fetch events and event_operators data for an operator
export const fetchOperatorEvents = async (operatorId: string) => {
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
    .eq('operator_id', operatorId);
  
  if (eventOperatorsError) {
    console.error("Error fetching operator events:", eventOperatorsError);
    throw new Error("Failed to load events");
  }
  
  console.log("Event operators data:", eventOperatorsData);
  
  if (!eventOperatorsData || eventOperatorsData.length === 0) {
    return { events: [], calculations: [] };
  }
  
  // Process events data with proper type casting for status and attendance
  const eventsData = processEvents(eventOperatorsData);
  
  // Process payroll calculations
  const calculationsData = processPayrollCalculations(eventOperatorsData);
  
  console.log("Processed payroll data:", calculationsData);
  
  return {
    events: eventsData,
    calculations: calculationsData
  };
};

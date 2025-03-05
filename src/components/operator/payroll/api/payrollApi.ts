
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";

// Fetch events and event_operators data for an operator
export const fetchOperatorEvents = async (operatorId: number) => {
  console.log("Fetching events for operator ID:", operatorId);
  
  // First, let's check if the operator exists in the system
  const { data: operatorData, error: operatorError } = await supabase
    .from('operators')
    .select('id, name')
    .eq('id', operatorId)
    .single();
    
  if (operatorError) {
    console.error("Error fetching operator:", operatorError);
    throw new Error("Failed to find operator");
  }
  
  console.log("Found operator:", operatorData);
  
  // Now let's find any events assigned to this operator through event_operators table
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
  
  // If no events found, let's also check directly in the events table
  // to see if there are any events that should be assigned
  if (!eventOperatorsData || eventOperatorsData.length === 0) {
    console.log("No event_operators entries found, checking events table for assignments");
    
    const { data: allEvents, error: eventsError } = await supabase
      .from('events')
      .select(`
        id,
        title,
        start_date,
        end_date,
        location,
        status,
        clients(name)
      `);
      
    if (eventsError) {
      console.error("Error fetching all events:", eventsError);
    } else {
      console.log("All available events:", allEvents);
    }
    
    return { events: [], calculations: [] };
  }
  
  // Aggiorniamo automaticamente lo status degli eventi passati a "completed" se non è già impostato
  const now = new Date();
  const updatedEventOperatorsData = eventOperatorsData.map(item => {
    if (item.events) {
      const endDate = new Date(item.events.end_date);
      if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
        // Se l'evento è passato e non è già completato o cancellato, lo consideriamo come completato
        item.events.status = "completed";
      }
    }
    return item;
  });
  
  // Process events data with proper type casting for status and attendance
  const eventsData = processEvents(updatedEventOperatorsData);
  
  // Process payroll calculations
  const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
  
  console.log("Processed payroll data:", calculationsData);
  
  return {
    events: eventsData,
    calculations: calculationsData
  };
};

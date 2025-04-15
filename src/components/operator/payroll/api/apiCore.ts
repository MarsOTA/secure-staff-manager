
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";
import { fetchLocalStorageData } from "./localStorageApi";
import { updateEventStatus } from "./eventStatusUtils";

// Main function to fetch events and payroll data for an operator
export const fetchOperatorEvents = async (operatorId: number) => {
  console.log("Fetching events for operator ID:", operatorId);
  
  try {
    // First, check if the operator exists in the database
    const { data: operatorData, error: operatorError } = await supabase
      .from('operators')
      .select('id, name')
      .eq('id', operatorId);
      
    if (operatorError) {
      console.error("Error fetching operator:", operatorError);
      return { events: [], calculations: [] };
    }
    
    // If operator is not found in database, try local storage
    if (!operatorData || operatorData.length === 0) {
      console.log("Operator not found in database, using local data");
      return fetchLocalStorageData(operatorId);
    }
    
    console.log("Found operator in database:", operatorData);
    
    // Fetch events assigned to this operator from database
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
      return { events: [], calculations: [] };
    }
    
    console.log("Event operators data from database:", eventOperatorsData);
    
    // If no events found in database, check local storage
    if (!eventOperatorsData || eventOperatorsData.length === 0) {
      console.log("No event_operators entries found, checking local storage for assignments");
      return fetchLocalStorageData(operatorId);
    }
    
    // Update status automatically for past events
    const updatedEventOperatorsData = updateEventStatus(eventOperatorsData);
    
    // Process events data with proper type casting for status and attendance
    const eventsData = processEvents(updatedEventOperatorsData);
    
    // Process payroll calculations
    const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
    
    console.log("Processed payroll data from database:", calculationsData);
    
    // Fetch attendance records for this operator
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('attendance')
      .select('*')
      .eq('operator_id', operatorId);
      
    if (attendanceError) {
      console.error("Error fetching attendance records:", attendanceError);
    } else if (attendanceRecords && attendanceRecords.length > 0) {
      console.log("Found attendance records:", attendanceRecords);
      
      // Group attendance records by event_id
      const attendanceByEvent = attendanceRecords.reduce((acc, record) => {
        if (!acc[record.event_id]) {
          acc[record.event_id] = [];
        }
        acc[record.event_id].push(record);
        return acc;
      }, {} as Record<number, any[]>);
      
      // Update events with attendance data
      for (let i = 0; i < eventsData.length; i++) {
        const eventId = eventsData[i].id;
        if (attendanceByEvent[eventId]) {
          // Sort by timestamp (newest first)
          const eventAttendance = attendanceByEvent[eventId].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          
          // Use the most recent record's status
          const lastRecord = eventAttendance[0];
          if (lastRecord.status === 'check-in') {
            eventsData[i].attendance = 'present';
            if (i < calculationsData.length) {
              calculationsData[i].attendance = 'present';
            }
          } else if (lastRecord.status === 'check-out') {
            eventsData[i].attendance = 'completed';
            if (i < calculationsData.length) {
              calculationsData[i].attendance = 'completed';
            }
          } else if (lastRecord.status === 'present' || lastRecord.status === 'absent' || 
                     lastRecord.status === 'late' || lastRecord.status === 'completed') {
            // Direct attendance status
            eventsData[i].attendance = lastRecord.status;
            if (i < calculationsData.length) {
              calculationsData[i].attendance = lastRecord.status;
            }
          }
        }
      }
    }
    
    return {
      events: eventsData,
      calculations: calculationsData
    };
  } catch (error) {
    console.error("Error in fetchOperatorEvents:", error);
    return { events: [], calculations: [] };
  }
};

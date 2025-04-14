
import { Event, PayrollCalculation } from "../types";
import { processEvents, processPayrollCalculations } from "../utils/payrollCalculations";

// Helper function to calculate hours between two dates
export const calculateHours = (startDate: Date, endDate: Date): number => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // Round to 1 decimal place
};

// Helper function to calculate net hours (gross hours minus break)
export const calculateNetHours = (startDate: Date, endDate: Date): number => {
  const grossHours = calculateHours(startDate, endDate);
  return grossHours > 5 ? grossHours - 1 : grossHours; // 1 hour break if working > 5 hours
};

// Fetch and process data from local storage
export const fetchLocalStorageData = (operatorId: number) => {
  try {
    // Get events from localStorage as fallback
    const storedEvents = localStorage.getItem("app_events_data");
    const storedOperators = localStorage.getItem("app_operators_data");
    
    if (!storedEvents || !storedOperators) {
      return { events: [], calculations: [] };
    }
    
    const operators = JSON.parse(storedOperators);
    const operator = operators.find((op: any) => op.id === operatorId);
    
    if (!operator || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      console.log("No assigned events found for operator in local storage");
      return { events: [], calculations: [] };
    }
    
    const allEvents = JSON.parse(storedEvents);
    // Filter events assigned to this operator
    const operatorEvents = allEvents.filter((event: any) => {
      return operator.assignedEvents.includes(event.id);
    }).map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    }));
    
    console.log("Assigned events from local storage:", operatorEvents);
    
    // Process events and calculations from local storage
    if (operatorEvents.length === 0) {
      return { events: [], calculations: [] };
    }
    
    // Convert local storage events to the format expected by processEvents
    const eventOperatorsData = formatLocalStorageEvents(operatorEvents);
    
    // Automatically update status for past events
    const updatedEventOperatorsData = updateEventStatus(eventOperatorsData);
    
    // Process events data
    const eventsData = processEvents(updatedEventOperatorsData);
    
    // Process payroll calculations
    const calculationsData = processPayrollCalculations(updatedEventOperatorsData);
    
    console.log("Processed payroll data from local storage:", calculationsData);
    
    return {
      events: eventsData,
      calculations: calculationsData
    };
  } catch (error) {
    console.error("Error processing local storage data:", error);
    return { events: [], calculations: [] };
  }
};

// Format local storage events to match the API format
export const formatLocalStorageEvents = (operatorEvents: any[]) => {
  return operatorEvents.map((event: any) => ({
    event_id: event.id,
    hourly_rate: event.hourlyRateCost || 15,
    total_hours: event.grossHours || calculateHours(event.startDate, event.endDate),
    net_hours: event.netHours || calculateNetHours(event.startDate, event.endDate),
    meal_allowance: event.totalHours > 5 ? 10 : 0,
    travel_allowance: 15,
    total_compensation: (event.netHours || calculateNetHours(event.startDate, event.endDate)) * (event.hourlyRateCost || 15),
    revenue_generated: (event.netHours || calculateNetHours(event.startDate, event.endDate)) * (event.hourlyRateSell || 25),
    events: {
      id: event.id,
      title: event.title,
      start_date: event.startDate,
      end_date: event.endDate,
      location: event.location || '',
      status: event.status || 'upcoming',
      breakStartTime: event.breakStartTime || '',
      breakEndTime: event.breakEndTime || '',
      clients: {
        name: event.client
      }
    }
  }));
};

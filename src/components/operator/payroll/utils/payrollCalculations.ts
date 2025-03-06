
import { Event, PayrollCalculation, PayrollSummary } from "../types";

// Process events data from Supabase
export const processEvents = (eventOperatorsData: any[]): Event[] => {
  return eventOperatorsData.map(item => {
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
    
    // Per eventi passati, imposta lo stato a "completed" se non è già "cancelled"
    if (isPast && validStatus !== "cancelled") {
      validStatus = "completed";
    }
    
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
};

// Process payroll calculations from event data
export const processPayrollCalculations = (eventOperatorsData: any[]): PayrollCalculation[] => {
  return eventOperatorsData.map(item => {
    if (!item.events) {
      console.warn("Event data missing for calculation:", item);
      return null;
    }
    
    const event = item.events;
    const endDate = new Date(event.end_date);
    const now = new Date();
    const isPast = endDate < now;
    
    // Forza lo stato dell'evento a "completed" se è passato e non è cancellato
    const eventStatus = isPast && event.status !== "cancelled" ? "completed" : event.status;
    
    // Use provided hours from database first
    const totalHours = item.total_hours || 0;
    const netHours = item.net_hours || (totalHours > 5 ? totalHours - 1 : totalHours); // 1 hour lunch break if > 5 hours
    const hourlyRate = item.hourly_rate || 15;
    const compensation = item.total_compensation || (netHours * hourlyRate);
    const mealAllowance = item.meal_allowance || (totalHours > 5 ? 10 : 0);
    const travelAllowance = item.travel_allowance || 15;
    const totalRevenue = item.revenue_generated || (netHours * (hourlyRate * 1.667)); // Default margin
    
    // For completed events, set actual hours to net hours by default if not provided
    const actualHours = eventStatus === "completed" ? (item.actual_hours || netHours) : undefined;
    
    return {
      eventId: event.id,
      eventTitle: event.title,
      client: event.clients?.name || 'Cliente sconosciuto',
      date: new Date(event.start_date).toLocaleDateString('it-IT'),
      start_date: event.start_date,
      end_date: event.end_date,
      grossHours: totalHours,
      netHours,
      compensation,
      mealAllowance,
      travelAllowance,
      totalRevenue,
      attendance: isPast && eventStatus === "completed" ? "present" as const : null,
      estimated_hours: totalHours,
      actual_hours: actualHours  // Set actual_hours for completed events
    };
  }).filter(Boolean) as PayrollCalculation[];
};

// Helper function to validate attendance value
export const validateAttendance = (value: any): "present" | "absent" | "late" | null => {
  if (value === "present" || value === "absent" || value === "late") {
    return value;
  }
  return null;
};

// Calculate summary totals based on calculations
export const calculateSummary = (calculationsData: PayrollCalculation[]): PayrollSummary => {
  return calculationsData.reduce((acc, curr) => {
    // Use actual_hours if available, otherwise use netHours
    const hoursToUse = curr.actual_hours !== undefined ? curr.actual_hours : curr.netHours;
    
    return {
      totalGrossHours: acc.totalGrossHours + curr.grossHours,
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

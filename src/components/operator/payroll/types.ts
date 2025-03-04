
// Define the event type
export interface Event {
  id: number;
  title: string;
  client: string;
  start_date: string;
  end_date: string;
  location: string;
  personnel_types?: string[];
  personnel_count?: number;
  hourly_rate?: number;
  hourly_rate_sell?: number;
  status?: "upcoming" | "in-progress" | "completed" | "cancelled";
}

// Define the payroll calculation type
export interface PayrollCalculation {
  eventId: number;
  eventTitle: string;
  client: string;
  date: string;
  grossHours: number;
  netHours: number;
  compensation: number;
  mealAllowance: number;
  travelAllowance: number;
  totalRevenue: number;
}

export interface PayrollSummary {
  totalGrossHours: number;
  totalNetHours: number;
  totalCompensation: number;
  totalAllowances: number;
  totalRevenue: number;
}

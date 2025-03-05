
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
  attendance?: "present" | "absent" | "late" | null;
  estimated_hours?: number;
  actual_hours?: number;
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
  attendance?: "present" | "absent" | "late" | null;
  estimated_hours?: number;
  actual_hours?: number;
  start_date?: string;
  end_date?: string;
}

export interface PayrollSummary {
  totalGrossHours: number;
  totalNetHours: number;
  totalCompensation: number;
  totalAllowances: number;
  totalRevenue: number;
}

// Define attendance options
export const attendanceOptions = [
  { value: "present", label: "Presente", color: "bg-green-100 text-green-800" },
  { value: "late", label: "In ritardo", color: "bg-yellow-100 text-yellow-800" },
  { value: "absent", label: "Assente", color: "bg-red-100 text-red-800" }
];


export interface WorkShift {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Event {
  id: number;
  title: string;
  client: string;
  startDate: Date;
  endDate: Date;
  personnelTypes: string[];
  personnelCount?: Record<string, number> | number;
  location?: string;
  address?: string;
  grossHours?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  netHours?: number;
  hourlyRateCost?: number;
  hourlyRateSell?: number;
  status?: string;
  assignedPersonnel?: number;
  workShifts?: WorkShift[];
}

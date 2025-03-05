
import React, { useState } from "react";
import { ExtendedOperator } from "@/types/operator";
import { attendanceOptions, PayrollCalculation } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/usePayrollData";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import PayrollHeader from "./payroll/PayrollHeader";
import AttendanceDialog from "./payroll/AttendanceDialog";
import HoursAdjustmentDialog from "./payroll/HoursAdjustmentDialog";
import { toast } from "sonner";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PayrollCalculation | null>(null);
  
  const {
    events,
    calculations,
    summaryData,
    loading,
    updateAttendance,
    updateActualHours
  } = usePayrollData(operator);
  
  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };
  
  const openAttendanceDialog = (event: PayrollCalculation) => {
    setSelectedEvent(event);
    setIsAttendanceDialogOpen(true);
  };
  
  const openHoursDialog = (event: PayrollCalculation) => {
    setSelectedEvent(event);
    setIsHoursDialogOpen(true);
  };
  
  const handleAttendanceSubmit = (eventId: number, attendanceValue: string | null) => {
    if (!attendanceValue) {
      toast.error("Seleziona lo stato di presenza");
      return;
    }
    
    const success = updateAttendance(eventId, attendanceValue);
    if (success) {
      setIsAttendanceDialogOpen(false);
    }
  };
  
  const handleHoursSubmit = (eventId: number, actualHours: number) => {
    if (actualHours < 0) {
      toast.error("Le ore devono essere maggiori di zero");
      return;
    }
    
    const success = updateActualHours(eventId, actualHours);
    if (success) {
      setIsHoursDialogOpen(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <PayrollHeader 
        operatorName={operator.name}
        onExportCSV={handleExportCSV}
      />
      
      {/* Summary Cards */}
      <PayrollSummary 
        summaryData={summaryData} 
        eventCount={calculations.filter(e => e.attendance === "present" || e.attendance === "late").length} 
      />
      
      {/* Charts */}
      <PayrollCharts 
        calculations={calculations.filter(c => c.attendance === "present" || c.attendance === "late")} 
        totalCompensation={summaryData.totalCompensation} 
      />
      
      {/* Event Table */}
      <PayrollTable 
        calculations={calculations} 
        summaryData={summaryData} 
        loading={loading} 
        onAttendanceClick={openAttendanceDialog}
        onClientClick={openHoursDialog}
        attendanceOptions={attendanceOptions}
      />
      
      {/* Attendance Dialog */}
      <AttendanceDialog
        isOpen={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
        selectedEvent={selectedEvent ? {
          id: selectedEvent.eventId,
          title: selectedEvent.eventTitle,
          client: selectedEvent.client,
          start_date: selectedEvent.date,
          end_date: selectedEvent.date,
          location: "",
          attendance: selectedEvent.attendance as "present" | "absent" | "late" | null
        } : null}
        onSubmit={handleAttendanceSubmit}
      />
      
      {/* Hours Adjustment Dialog */}
      <HoursAdjustmentDialog
        isOpen={isHoursDialogOpen}
        onOpenChange={setIsHoursDialogOpen}
        selectedEvent={selectedEvent}
        onSubmit={handleHoursSubmit}
      />
    </div>
  );
};

export default PayrollTab;

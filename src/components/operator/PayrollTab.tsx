
import React, { useState } from "react";
import { ExtendedOperator } from "@/types/operator";
import { Event, attendanceOptions } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/usePayrollData";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import PayrollHeader from "./payroll/PayrollHeader";
import AttendanceDialog from "./payroll/AttendanceDialog";
import { toast } from "sonner";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const {
    events,
    calculations,
    summaryData,
    loading,
    updateAttendance
  } = usePayrollData(operator);
  
  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };
  
  const openAttendanceDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsAttendanceDialogOpen(true);
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
        eventCount={events.filter(e => e.attendance === "present" || e.attendance === "late").length} 
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
        attendanceOptions={attendanceOptions}
      />
      
      {/* Attendance Dialog */}
      <AttendanceDialog
        isOpen={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
        selectedEvent={selectedEvent}
        onSubmit={handleAttendanceSubmit}
      />
    </div>
  );
};

export default PayrollTab;

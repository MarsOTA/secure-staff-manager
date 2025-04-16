
import React, { useState } from "react";
import { ExtendedOperator } from "@/types/operator";
import { attendanceOptions, PayrollCalculation, Event } from "./payroll/types";
import { exportToCSV } from "./payroll/payrollUtils";
import { usePayrollData } from "./payroll/hooks/usePayrollData";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import PayrollHeader from "./payroll/PayrollHeader";
import HoursAdjustmentDialog from "./payroll/HoursAdjustmentDialog";
import AttendanceDialog from "./payroll/AttendanceDialog";
import { toast } from "sonner";
import AttendanceAccordion from "./payroll/AttendanceAccordion";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [isHoursDialogOpen, setIsHoursDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<PayrollCalculation | null>(null);
  const [selectedAttendanceEvent, setSelectedAttendanceEvent] = useState<Event | null>(null);
  
  // Extract gross salary from contract data
  const grossSalaryValue = operator.contractData?.grossSalary || "0";
  const hourlyRate = parseFloat(grossSalaryValue) || 0;
  
  const {
    events,
    calculations,
    summaryData,
    loading,
    updateActualHours,
    updateAllowance,
    updateAttendance
  } = usePayrollData(operator, hourlyRate);
  
  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };
  
  const openHoursDialog = (event: PayrollCalculation) => {
    setSelectedEvent(event);
    setIsHoursDialogOpen(true);
  };

  const openAttendanceDialog = (event: Event) => {
    setSelectedAttendanceEvent(event);
    setIsAttendanceDialogOpen(true);
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

  const handleUpdateHours = (eventId: number, actualHours: number) => {
    updateActualHours(eventId, actualHours);
  };
  
  const handleUpdateAllowance = (eventId: number, type: 'meal' | 'travel', value: number) => {
    updateAllowance(eventId, type, value);
  };

  const handleAttendanceSubmit = (eventId: number, attendance: string | null) => {
    const success = updateAttendance(eventId, attendance);
    if (success) {
      setIsAttendanceDialogOpen(false);
      toast.success("Stato di presenza aggiornato con successo");
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
        eventCount={calculations.length}
      />
      
      {/* Charts */}
      <PayrollCharts 
        calculations={calculations} 
        totalCompensation={summaryData.totalCompensation} 
      />
      
      {/* Attendance Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Presenze</h3>
        <div className="rounded-md border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dettagli Presenza</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Caricamento dati...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Nessun evento trovato</td>
                </tr>
              ) : (
                events.map((event) => {
                  // Find the corresponding attendance status display
                  const attendanceStatus = attendanceOptions.find(
                    (option) => option.value === event.attendance
                  );
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(event.start_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{event.client}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event.attendance ? (
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${attendanceStatus?.color}`}>
                            {attendanceStatus?.label || event.attendance}
                          </span>
                        ) : (
                          <span className="text-gray-400">Non registrato</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <AttendanceAccordion event={event} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          onClick={() => openAttendanceDialog(event)}
                          className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                        >
                          Modifica
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Event Table */}
      <PayrollTable 
        calculations={calculations} 
        summaryData={summaryData} 
        loading={loading} 
        onClientClick={openHoursDialog}
        onUpdateHours={handleUpdateHours}
        onUpdateAllowance={handleUpdateAllowance}
      />
      
      {/* Hours Adjustment Dialog */}
      <HoursAdjustmentDialog
        isOpen={isHoursDialogOpen}
        onOpenChange={setIsHoursDialogOpen}
        selectedEvent={selectedEvent}
        onSubmit={handleHoursSubmit}
      />

      {/* Attendance Dialog */}
      <AttendanceDialog
        isOpen={isAttendanceDialogOpen}
        onOpenChange={setIsAttendanceDialogOpen}
        selectedEvent={selectedAttendanceEvent}
        onSubmit={handleAttendanceSubmit}
      />
    </div>
  );
};

export default PayrollTab;

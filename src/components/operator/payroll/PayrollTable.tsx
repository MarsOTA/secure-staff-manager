
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PayrollCalculation, PayrollSummary, Event } from "./types";

interface PayrollTableProps {
  calculations: PayrollCalculation[];
  summaryData: PayrollSummary;
  loading: boolean;
  onAttendanceClick: (event: Event) => void;
  attendanceOptions: { value: string; label: string; color: string }[];
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  calculations, 
  summaryData, 
  loading,
  onAttendanceClick,
  attendanceOptions
}) => {
  const formatCurrency = (value: number) => `€ ${value.toFixed(2)}`;
  
  const getAttendanceStyle = (attendance: string | null | undefined) => {
    if (!attendance) return "bg-gray-100 text-gray-700";
    const option = attendanceOptions.find(opt => opt.value === attendance);
    return option ? option.color : "bg-gray-100 text-gray-700";
  };
  
  const getAttendanceLabel = (attendance: string | null | undefined) => {
    if (!attendance) return "Non registrato";
    const option = attendanceOptions.find(opt => opt.value === attendance);
    return option ? option.label : "Non registrato";
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ore Lorde</TableHead>
            <TableHead className="text-right">Ore Nette</TableHead>
            <TableHead className="text-right">Compenso</TableHead>
            <TableHead className="text-right">Rimborsi</TableHead>
            <TableHead className="text-right">Fatturato</TableHead>
            <TableHead className="text-center">Presenza</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Caricamento dati...
              </TableCell>
            </TableRow>
          ) : calculations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                Nessun dato disponibile
              </TableCell>
            </TableRow>
          ) : (
            <>
              {calculations.map((calc) => (
                <TableRow key={calc.eventId}>
                  <TableCell className="font-medium">{calc.eventTitle}</TableCell>
                  <TableCell>{calc.client}</TableCell>
                  <TableCell>{calc.date}</TableCell>
                  <TableCell className="text-right">{calc.grossHours.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{calc.netHours.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(calc.compensation)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calc.mealAllowance + calc.travelAllowance)}
                    <div className="text-xs text-muted-foreground">
                      Pasti: {formatCurrency(calc.mealAllowance)} / Viaggio: {formatCurrency(calc.travelAllowance)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(calc.totalRevenue)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      className={`w-full ${getAttendanceStyle(calc.attendance)}`}
                      onClick={() => onAttendanceClick({
                        id: calc.eventId,
                        title: calc.eventTitle,
                        client: calc.client,
                        start_date: calc.date,
                        end_date: calc.date,
                        location: "",
                        attendance: calc.attendance as "present" | "absent" | "late" | null
                      })}
                    >
                      {getAttendanceLabel(calc.attendance)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Summary Row */}
              <TableRow className="font-medium bg-muted/50">
                <TableCell colSpan={3}>TOTALE</TableCell>
                <TableCell className="text-right">{summaryData.totalGrossHours.toFixed(2)}</TableCell>
                <TableCell className="text-right">{summaryData.totalNetHours.toFixed(2)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalCompensation)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalAllowances)}</TableCell>
                <TableCell className="text-right">{formatCurrency(summaryData.totalRevenue)}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;

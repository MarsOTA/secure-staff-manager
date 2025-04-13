
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
import { PayrollCalculation, PayrollSummary } from "./types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PayrollTableProps {
  calculations: PayrollCalculation[];
  summaryData: PayrollSummary;
  loading: boolean;
  onClientClick: (event: PayrollCalculation) => void;
  onUpdateHours: (eventId: number, hours: number) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  calculations, 
  summaryData, 
  loading,
  onClientClick,
  onUpdateHours
}) => {
  const formatCurrency = (value: number) => `€ ${value.toFixed(2)}`;
  
  const handleHoursChange = (eventId: number, value: string) => {
    const hours = parseFloat(value);
    if (!isNaN(hours) && hours >= 0) {
      onUpdateHours(eventId, hours);
    } else {
      toast.error("Le ore devono essere un numero valido maggiore di zero");
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Evento</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="text-right">Ore Stimate</TableHead>
            <TableHead className="text-right">Ore Effettive</TableHead>
            <TableHead className="text-right">Compenso Lordo</TableHead>
            <TableHead className="text-right">Rimborsi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Caricamento dati...
              </TableCell>
            </TableRow>
          ) : calculations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                Nessun dato disponibile
              </TableCell>
            </TableRow>
          ) : (
            <>
              {calculations.map((calc) => (
                <TableRow key={calc.eventId}>
                  <TableCell className="font-medium">{calc.eventTitle}</TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      onClick={() => onClientClick(calc)}
                      className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 underline"
                    >
                      {calc.client}
                    </Button>
                  </TableCell>
                  <TableCell>{calc.date}</TableCell>
                  <TableCell className="text-right">{calc.grossHours.toFixed(2)}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      value={calc.actual_hours !== undefined ? calc.actual_hours : calc.netHours}
                      onChange={(e) => handleHoursChange(calc.eventId, e.target.value)}
                      className="w-20 text-right ml-auto"
                    />
                    {calc.breakDuration > 0 && (
                      <div className="text-xs text-muted-foreground text-right">
                        (-{calc.breakDuration.toFixed(2)}h pausa x {calc.eventDays} giorni)
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(calc.compensation)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calc.mealAllowance + calc.travelAllowance)}
                    <div className="text-xs text-muted-foreground">
                      Pasti: {formatCurrency(calc.mealAllowance)} / Viaggio: {formatCurrency(calc.travelAllowance)}
                    </div>
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
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayrollTable;

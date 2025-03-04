
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PayrollCalculation, PayrollSummary } from "./types";

interface PayrollTableProps {
  calculations: PayrollCalculation[];
  summaryData: PayrollSummary;
  loading: boolean;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ calculations, summaryData, loading }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dettaglio Eventi</CardTitle>
        <CardDescription>Lista degli eventi lavorati</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-6 text-center">
            Caricamento dati...
          </div>
        ) : calculations.length > 0 ? (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((calc) => (
                <TableRow key={calc.eventId}>
                  <TableCell className="font-medium">{calc.eventTitle}</TableCell>
                  <TableCell>{calc.client}</TableCell>
                  <TableCell>{calc.date}</TableCell>
                  <TableCell className="text-right">{calc.grossHours.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{calc.netHours.toFixed(1)}</TableCell>
                  <TableCell className="text-right">€{calc.compensation.toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{(calc.mealAllowance + calc.travelAllowance).toFixed(2)}</TableCell>
                  <TableCell className="text-right">€{calc.totalRevenue.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold bg-muted/50">
                <TableCell colSpan={3}>TOTALE</TableCell>
                <TableCell className="text-right">{summaryData.totalGrossHours.toFixed(1)}</TableCell>
                <TableCell className="text-right">{summaryData.totalNetHours.toFixed(1)}</TableCell>
                <TableCell className="text-right">€{summaryData.totalCompensation.toFixed(2)}</TableCell>
                <TableCell className="text-right">€{summaryData.totalAllowances.toFixed(2)}</TableCell>
                <TableCell className="text-right">€{summaryData.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            Nessun evento trovato per questo operatore
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollTable;


import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Calendar, Clock, Euro, Car } from "lucide-react";
import { PayrollSummary as PayrollSummaryType } from "./types";

interface PayrollSummaryProps {
  summaryData: PayrollSummaryType;
  eventCount: number;
}

const PayrollSummary: React.FC<PayrollSummaryProps> = ({ summaryData, eventCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Eventi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{eventCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Ore Lorde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summaryData.totalGrossHours.toFixed(1)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Ore Nette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{summaryData.totalNetHours.toFixed(1)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Euro className="h-4 w-4 mr-1" />
            Compenso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">€{summaryData.totalCompensation.toFixed(2)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Car className="h-4 w-4 mr-1" />
            Rimborsi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">€{summaryData.totalAllowances.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollSummary;

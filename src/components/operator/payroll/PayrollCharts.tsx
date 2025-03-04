
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer 
} from "recharts";
import { PayrollCalculation } from "./types";

interface PayrollChartsProps {
  calculations: PayrollCalculation[];
  totalCompensation: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PayrollCharts: React.FC<PayrollChartsProps> = ({ calculations, totalCompensation }) => {
  
  const generateBarChartData = () => {
    return calculations.map(calc => ({
      name: calc.eventTitle.substring(0, 15) + (calc.eventTitle.length > 15 ? '...' : ''),
      "Ore Lorde": calc.grossHours,
      "Ore Nette": calc.netHours,
      "Compenso (€)": calc.compensation / 10, // Scaled down for better visualization
      "Fatturato (€)": calc.totalRevenue / 10 // Scaled down for better visualization
    }));
  };
  
  const generatePieChartData = () => {
    return [
      { name: 'Compenso', value: totalCompensation },
      { name: 'Rimborso Pasti', value: calculations.reduce((sum, calc) => sum + calc.mealAllowance, 0) },
      { name: 'Rimborso Viaggio', value: calculations.reduce((sum, calc) => sum + calc.travelAllowance, 0) }
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Riepilogo per Evento</CardTitle>
          <CardDescription>Ore e compensi per evento</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {calculations.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={generateBarChartData()}
                margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ore Lorde" fill="#8884d8" />
                <Bar dataKey="Ore Nette" fill="#82ca9d" />
                <Bar dataKey="Compenso (€)" fill="#ffc658" />
                <Bar dataKey="Fatturato (€)" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nessun dato disponibile
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Distribuzione Guadagni</CardTitle>
          <CardDescription>Compenso e rimborsi</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {calculations.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generatePieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {generatePieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `€${Number(value).toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Nessun dato disponibile
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollCharts;

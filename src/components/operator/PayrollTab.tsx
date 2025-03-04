
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
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
import { FileDown, Clock, Euro, Car, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the event type
interface Event {
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
}

// Define the payroll calculation type
interface PayrollCalculation {
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
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calculations, setCalculations] = useState<PayrollCalculation[]>([]);
  const [summaryData, setSummaryData] = useState({
    totalGrossHours: 0,
    totalNetHours: 0,
    totalCompensation: 0,
    totalAllowances: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Load events and calculate payroll from Supabase
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch events and event_operators data for this operator
        const { data: eventOperatorsData, error: eventOperatorsError } = await supabase
          .from('event_operators')
          .select(`
            id,
            event_id,
            hourly_rate,
            total_hours,
            net_hours,
            meal_allowance,
            travel_allowance,
            total_compensation,
            revenue_generated,
            events(
              id,
              title,
              start_date,
              end_date,
              location,
              status,
              clients(name)
            )
          `)
          .eq('operator_id', operator.id);
        
        if (eventOperatorsError) {
          console.error("Errore nel caricamento degli eventi:", eventOperatorsError);
          toast.error("Errore nel caricamento degli eventi");
          return;
        }
        
        if (!eventOperatorsData || eventOperatorsData.length === 0) {
          setEvents([]);
          setCalculations([]);
          setSummaryData({
            totalGrossHours: 0,
            totalNetHours: 0,
            totalCompensation: 0,
            totalAllowances: 0,
            totalRevenue: 0
          });
          setLoading(false);
          return;
        }
        
        // Process events data - with proper type casting for status
        const eventsData = eventOperatorsData.map(item => {
          // Ensure status is one of the valid enum values, or default to "upcoming"
          let validStatus: "upcoming" | "in-progress" | "completed" | "cancelled" = "upcoming";
          
          if (item.events.status === "upcoming" || 
              item.events.status === "in-progress" || 
              item.events.status === "completed" || 
              item.events.status === "cancelled") {
            validStatus = item.events.status as "upcoming" | "in-progress" | "completed" | "cancelled";
          }
          
          return {
            id: item.events.id,
            title: item.events.title,
            client: item.events.clients?.name || 'Cliente sconosciuto',
            start_date: item.events.start_date,
            end_date: item.events.end_date,
            location: item.events.location || '',
            status: validStatus,
            hourly_rate: item.hourly_rate || 15,
            hourly_rate_sell: item.revenue_generated ? (item.revenue_generated / (item.net_hours || 1)) : 25
          };
        });
        
        setEvents(eventsData);
        
        // Generate payroll calculations
        const payrollData = eventOperatorsData.map(item => {
          const event = item.events;
          
          // In case we need to calculate on our own (fallback)
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          const totalHours = item.total_hours || (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
          const netHours = item.net_hours || (totalHours > 5 ? totalHours - 1 : totalHours); // 1 hour lunch break if > 5 hours
          const hourlyRate = item.hourly_rate || 15;
          const compensation = item.total_compensation || (netHours * hourlyRate);
          const mealAllowance = item.meal_allowance || (totalHours > 5 ? 10 : 0);
          const travelAllowance = item.travel_allowance || 15;
          const totalRevenue = item.revenue_generated || (netHours * (item.hourly_rate * 1.667)); // Default margin
          
          return {
            eventId: event.id,
            eventTitle: event.title,
            client: event.clients?.name || 'Cliente sconosciuto',
            date: new Date(event.start_date).toLocaleDateString('it-IT'),
            grossHours: totalHours,
            netHours,
            compensation,
            mealAllowance,
            travelAllowance,
            totalRevenue
          };
        });
        
        setCalculations(payrollData);
        
        // Calculate summary totals
        const summary = payrollData.reduce((acc, curr) => {
          return {
            totalGrossHours: acc.totalGrossHours + curr.grossHours,
            totalNetHours: acc.totalNetHours + curr.netHours,
            totalCompensation: acc.totalCompensation + curr.compensation,
            totalAllowances: acc.totalAllowances + (curr.mealAllowance + curr.travelAllowance),
            totalRevenue: acc.totalRevenue + curr.totalRevenue
          };
        }, {
          totalGrossHours: 0,
          totalNetHours: 0,
          totalCompensation: 0,
          totalAllowances: 0,
          totalRevenue: 0
        });
        
        setSummaryData(summary);
        
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        toast.error("Errore nel caricamento degli eventi");
      } finally {
        setLoading(false);
      }
    };
    
    loadEvents();
  }, [operator.id]);
  
  // Generate chart data
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
      { name: 'Compenso', value: summaryData.totalCompensation },
      { name: 'Rimborso Pasti', value: calculations.reduce((sum, calc) => sum + calc.mealAllowance, 0) },
      { name: 'Rimborso Viaggio', value: calculations.reduce((sum, calc) => sum + calc.travelAllowance, 0) }
    ];
  };
  
  // Export data to CSV
  const exportToCSV = () => {
    try {
      // Create CSV content
      let csvContent = "data:text/csv;charset=utf-8,";
      
      // Add header
      csvContent += "Evento,Cliente,Data,Ore Lorde,Ore Nette,Compenso (€),Rimborso Pasti (€),Rimborso Viaggio (€),Fatturato (€)\n";
      
      // Add rows
      calculations.forEach(calc => {
        csvContent += `"${calc.eventTitle}","${calc.client}","${calc.date}",${calc.grossHours.toFixed(2)},${calc.netHours.toFixed(2)},${calc.compensation.toFixed(2)},${calc.mealAllowance.toFixed(2)},${calc.travelAllowance.toFixed(2)},${calc.totalRevenue.toFixed(2)}\n`;
      });
      
      // Add summary row
      csvContent += `"TOTALE","","",${summaryData.totalGrossHours.toFixed(2)},${summaryData.totalNetHours.toFixed(2)},${summaryData.totalCompensation.toFixed(2)},${calculations.reduce((sum, calc) => sum + calc.mealAllowance, 0).toFixed(2)},${calculations.reduce((sum, calc) => sum + calc.travelAllowance, 0).toFixed(2)},${summaryData.totalRevenue.toFixed(2)}\n`;
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `payroll_${operator.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      toast.success("Dati esportati con successo");
    } catch (error) {
      console.error("Errore nell'esportazione dei dati:", error);
      toast.error("Errore nell'esportazione dei dati");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll {operator.name}</h2>
        <Button onClick={exportToCSV} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Esporta CSV
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Eventi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{events.length}</p>
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
      
      {/* Charts */}
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
      
      {/* Event Table */}
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
    </div>
  );
};

export default PayrollTab;

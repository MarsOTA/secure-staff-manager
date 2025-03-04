
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExtendedOperator } from "@/types/operator";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Event, PayrollCalculation, PayrollSummary as PayrollSummaryType } from "./payroll/types";
import PayrollSummary from "./payroll/PayrollSummary";
import PayrollCharts from "./payroll/PayrollCharts";
import PayrollTable from "./payroll/PayrollTable";
import { exportToCSV } from "./payroll/payrollUtils";

const PayrollTab: React.FC<{ operator: ExtendedOperator }> = ({ operator }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [calculations, setCalculations] = useState<PayrollCalculation[]>([]);
  const [summaryData, setSummaryData] = useState<PayrollSummaryType>({
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
  
  const handleExportCSV = () => {
    exportToCSV(calculations, summaryData, operator.name);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Payroll {operator.name}</h2>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          Esporta CSV
        </Button>
      </div>
      
      {/* Summary Cards */}
      <PayrollSummary 
        summaryData={summaryData} 
        eventCount={events.length} 
      />
      
      {/* Charts */}
      <PayrollCharts 
        calculations={calculations} 
        totalCompensation={summaryData.totalCompensation} 
      />
      
      {/* Event Table */}
      <PayrollTable 
        calculations={calculations} 
        summaryData={summaryData} 
        loading={loading} 
      />
    </div>
  );
};

export default PayrollTab;

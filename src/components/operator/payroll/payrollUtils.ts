
import { toast } from "sonner";
import { PayrollCalculation, PayrollSummary } from "./types";

export const exportToCSV = (
  calculations: PayrollCalculation[], 
  summaryData: PayrollSummary,
  operatorName: string
) => {
  try {
    // Filter calculations to include only the events where the operator was present or late
    const filteredCalculations = calculations.filter(
      calc => calc.attendance === "present" || calc.attendance === "late"
    );
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add header
    csvContent += "Evento,Cliente,Data,Ore Lorde,Ore Nette,Compenso (€),Rimborso Pasti (€),Rimborso Viaggio (€),Fatturato (€),Presenza\n";
    
    // Add rows
    filteredCalculations.forEach(calc => {
      const presenceStatus = calc.attendance === "present" ? "Presente" : 
                           calc.attendance === "late" ? "In ritardo" : 
                           calc.attendance === "absent" ? "Assente" : "Non registrato";
      
      csvContent += `"${calc.eventTitle}","${calc.client}","${calc.date}",${calc.grossHours.toFixed(2)},${calc.netHours.toFixed(2)},${calc.compensation.toFixed(2)},${calc.mealAllowance.toFixed(2)},${calc.travelAllowance.toFixed(2)},${calc.totalRevenue.toFixed(2)},"${presenceStatus}"\n`;
    });
    
    // Add summary row
    csvContent += `"TOTALE","","",${summaryData.totalGrossHours.toFixed(2)},${summaryData.totalNetHours.toFixed(2)},${summaryData.totalCompensation.toFixed(2)},${filteredCalculations.reduce((sum, calc) => sum + calc.mealAllowance, 0).toFixed(2)},${filteredCalculations.reduce((sum, calc) => sum + calc.travelAllowance, 0).toFixed(2)},${summaryData.totalRevenue.toFixed(2)},""\n`;
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payroll_${operatorName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
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

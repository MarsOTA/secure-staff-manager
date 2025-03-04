
import React from "react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface PayrollHeaderProps {
  operatorName: string;
  onExportCSV: () => void;
}

const PayrollHeader: React.FC<PayrollHeaderProps> = ({ operatorName, onExportCSV }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Payroll {operatorName}</h2>
      <Button onClick={onExportCSV} className="flex items-center gap-2">
        <FileDown className="h-4 w-4" />
        Esporta CSV
      </Button>
    </div>
  );
};

export default PayrollHeader;


import React from "react";
import { ExtendedOperator, CONTRACT_TYPES } from "@/types/operator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";

interface ContractTabProps {
  operator: ExtendedOperator;
  contractType: string;
  onContractTypeChange: (value: string) => void;
  onGenerateContract: () => void;
}

const ContractTab: React.FC<ContractTabProps> = ({
  operator,
  contractType,
  onContractTypeChange,
  onGenerateContract
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestione Contratto</CardTitle>
          <CardDescription>
            Seleziona il tipo di contratto e genera il documento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="contractType">Tipo di contratto</Label>
            <Select
              value={contractType}
              onValueChange={onContractTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona tipo di contratto" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="pt-4">
              <Button onClick={onGenerateContract} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Genera Contratto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractTab;

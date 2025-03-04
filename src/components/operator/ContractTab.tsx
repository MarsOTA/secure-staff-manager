
import React from "react";
import { ExtendedOperator, CONTRACT_TYPES } from "@/types/operator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ContractTabProps {
  operator: ExtendedOperator;
  contractType: string;
  onContractTypeChange: (value: string) => void;
  onGenerateContract: () => void;
  ccnl: string;
  setCcnl: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
  employmentType: string;
  setEmploymentType: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  grossSalary: string;
  setGrossSalary: (value: string) => void;
  netSalary: string;
  setNetSalary: (value: string) => void;
  onSave: () => void;
}

const ContractTab: React.FC<ContractTabProps> = ({
  operator,
  contractType,
  onContractTypeChange,
  onGenerateContract,
  ccnl,
  setCcnl,
  level,
  setLevel,
  employmentType,
  setEmploymentType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  grossSalary,
  setGrossSalary,
  netSalary,
  setNetSalary,
  onSave
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

            {/* CCNL applicato */}
            <div className="pt-4">
              <Label htmlFor="ccnl">CCNL applicato</Label>
              <Select
                value={ccnl}
                onValueChange={setCcnl}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona CCNL" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pulizia-multiservizi">Pulizia multiservizi - Conflavoro PMI</SelectItem>
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Livello inquadramento */}
            <div>
              <Label htmlFor="level">Livello inquadramento</Label>
              <Input
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="Es. 3° Livello"
              />
            </div>

            {/* Decorrenza rapporto di lavoro */}
            <div>
              <Label htmlFor="employmentType">Decorrenza rapporto di lavoro</Label>
              <Select
                value={employmentType}
                onValueChange={setEmploymentType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indeterminato">Indeterminato</SelectItem>
                  <SelectItem value="determinato">Determinato</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date picker fields for determinato */}
            {employmentType === "determinato" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data inizio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data fine</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "d MMMM yyyy", { locale: it }) : "Seleziona data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => 
                          date < new Date() || (startDate ? date < startDate : false)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            {/* Importo retribuzione lorda e netta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grossSalary">Importo retribuzione lorda (€)</Label>
                <Input
                  id="grossSalary"
                  type="number"
                  min="0"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="netSalary">Importo retribuzione netta (€)</Label>
                <Input
                  id="netSalary"
                  type="number"
                  min="0"
                  value={netSalary}
                  onChange={(e) => setNetSalary(e.target.value)}
                  placeholder="€ 0.00"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onSave} variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Salva Dati
          </Button>
          
          <Button onClick={onGenerateContract}>
            <Download className="mr-2 h-4 w-4" />
            Genera Contratto
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContractTab;

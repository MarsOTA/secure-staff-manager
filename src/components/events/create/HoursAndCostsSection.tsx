
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Clock, Euro } from "lucide-react";

interface HoursAndCostsSectionProps {
  grossHours: string;
  netHours: string;
  breakStartTime: string;
  breakEndTime: string;
  hourlyRateCost: string;
  hourlyRateSell: string;
  setGrossHours: React.Dispatch<React.SetStateAction<string>>;
  setNetHours: React.Dispatch<React.SetStateAction<string>>;
  setBreakStartTime: React.Dispatch<React.SetStateAction<string>>;
  setBreakEndTime: React.Dispatch<React.SetStateAction<string>>;
  setHourlyRateCost: React.Dispatch<React.SetStateAction<string>>;
  setHourlyRateSell: React.Dispatch<React.SetStateAction<string>>;
}

const HoursAndCostsSection: React.FC<HoursAndCostsSectionProps> = ({
  grossHours,
  netHours,
  breakStartTime,
  breakEndTime,
  hourlyRateCost,
  hourlyRateSell,
  setGrossHours,
  setNetHours,
  setBreakStartTime,
  setBreakEndTime,
  setHourlyRateCost,
  setHourlyRateSell
}) => {
  return (
    <div className="pt-4 border-t border-gray-200">
      <h3 className="text-lg font-medium mb-4">Informazioni su ore e costi</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="grossHours">Ore lorde previste</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <Input 
              id="grossHours" 
              type="number"
              step="0.5"
              min="0"
              placeholder="Inserisci ore lorde" 
              value={grossHours}
              onChange={(e) => setGrossHours(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="netHours">Ore nette previste</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <Input 
              id="netHours" 
              type="number"
              step="0.01"
              min="0"
              placeholder="Calcolato automaticamente" 
              value={netHours}
              readOnly
              className="pl-10 bg-gray-50"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Calcolato automaticamente (ore lorde - pausa)
          </p>
        </div>
      </div>
      
      <div className="space-y-2 mt-4">
        <Label>Pausa prevista</Label>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor="breakStartTime" className="text-sm">Da</Label>
            <Input 
              id="breakStartTime" 
              type="time" 
              value={breakStartTime}
              onChange={(e) => setBreakStartTime(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="breakEndTime" className="text-sm">A</Label>
            <Input 
              id="breakEndTime" 
              type="time" 
              value={breakEndTime}
              onChange={(e) => setBreakEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-4">
        <div className="space-y-2">
          <Label htmlFor="hourlyRateCost">€/h operatore (costo)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Euro className="w-4 h-4 text-gray-400" />
            </div>
            <Input 
              id="hourlyRateCost" 
              type="number"
              step="0.01"
              min="0"
              placeholder="Es. 15.00" 
              value={hourlyRateCost}
              onChange={(e) => setHourlyRateCost(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="hourlyRateSell">€/h operatore (prezzo di vendita)</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Euro className="w-4 h-4 text-gray-400" />
            </div>
            <Input 
              id="hourlyRateSell" 
              type="number"
              step="0.01"
              min="0"
              placeholder="Es. 25.00" 
              value={hourlyRateSell}
              onChange={(e) => setHourlyRateSell(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoursAndCostsSection;

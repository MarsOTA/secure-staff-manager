
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Clock } from "lucide-react";
import { WorkShift } from "@/types/events";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface WorkShiftsSectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  workShifts: WorkShift[];
  setWorkShifts: React.Dispatch<React.SetStateAction<WorkShift[]>>;
  showWorkShifts: boolean;
}

const dayOptions = [
  { value: "lunedi", label: "Lunedì" },
  { value: "martedi", label: "Martedì" },
  { value: "mercoledi", label: "Mercoledì" },
  { value: "giovedi", label: "Giovedì" },
  { value: "venerdi", label: "Venerdì" },
  { value: "sabato", label: "Sabato" },
  { value: "domenica", label: "Domenica" },
  { value: "lunedi-venerdi", label: "Lunedì - Venerdì" },
  { value: "sabato-domenica", label: "Sabato - Domenica" }
];

const WorkShiftsSection: React.FC<WorkShiftsSectionProps> = ({
  startDate,
  endDate,
  workShifts,
  setWorkShifts,
  showWorkShifts
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  const handleAddShift = () => {
    setWorkShifts([...workShifts, {
      dayOfWeek: "lunedi",
      startTime: "09:00",
      endTime: "18:00"
    }]);
    setIsEditing(true);
  };
  
  const handleRemoveShift = (index: number) => {
    const updatedShifts = [...workShifts];
    updatedShifts.splice(index, 1);
    setWorkShifts(updatedShifts);
  };
  
  const handleShiftChange = (index: number, field: keyof WorkShift, value: string) => {
    const updatedShifts = [...workShifts];
    updatedShifts[index] = { ...updatedShifts[index], [field]: value };
    setWorkShifts(updatedShifts);
  };

  if (!showWorkShifts) return null;
  
  return (
    <div className="pt-4 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Turni di lavoro</h3>
        {!isEditing && workShifts.length === 0 && (
          <Button 
            variant="outline" 
            onClick={handleAddShift}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Aggiungi turno
          </Button>
        )}
      </div>
      
      {workShifts.length > 0 && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            {workShifts.map((shift, index) => (
              <div key={index} className="flex flex-col space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Turno {index + 1}</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRemoveShift(index)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-6">
                    <Label htmlFor={`day-${index}`} className="text-sm">Giorno</Label>
                    <Select 
                      value={shift.dayOfWeek} 
                      onValueChange={(value) => handleShiftChange(index, "dayOfWeek", value)}
                    >
                      <SelectTrigger id={`day-${index}`}>
                        <SelectValue placeholder="Seleziona giorno" />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Label htmlFor={`start-${index}`} className="text-sm">Ora inizio</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input 
                        id={`start-${index}`} 
                        type="time" 
                        value={shift.startTime}
                        onChange={(e) => handleShiftChange(index, "startTime", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <Label htmlFor={`end-${index}`} className="text-sm">Ora fine</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <Input 
                        id={`end-${index}`} 
                        type="time" 
                        value={shift.endTime}
                        onChange={(e) => handleShiftChange(index, "endTime", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                {index < workShifts.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleAddShift}
              className="mt-4 w-full gap-2"
            >
              <Plus className="h-4 w-4" /> Aggiungi altro turno
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-7 gap-1 mt-4">
        {["D", "L", "M", "M", "G", "V", "S"].map((day, i) => (
          <div key={i} className="flex justify-center border-t border-gray-200 pt-2 font-medium text-sm">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 7 }).map((_, dayIndex) => {
          const relevantShifts = workShifts.filter(shift => {
            if (shift.dayOfWeek === "lunedi-venerdi" && dayIndex >= 1 && dayIndex <= 5) return true;
            if (shift.dayOfWeek === "sabato-domenica" && (dayIndex === 0 || dayIndex === 6)) return true;
            
            const dayMap: Record<string, number> = {
              domenica: 0,
              lunedi: 1,
              martedi: 2,
              mercoledi: 3,
              giovedi: 4,
              venerdi: 5,
              sabato: 6
            };
            
            return dayMap[shift.dayOfWeek] === dayIndex;
          });
          
          return (
            <div 
              key={dayIndex} 
              className="h-20 border rounded-md bg-gray-50 relative"
            >
              {relevantShifts.map((shift, i) => {
                // Calculate position and width based on start and end times
                const [startHour, startMinute] = shift.startTime.split(':').map(Number);
                const [endHour, endMinute] = shift.endTime.split(':').map(Number);
                
                const startPercent = ((startHour + startMinute / 60) / 24) * 100;
                const endPercent = ((endHour + endMinute / 60) / 24) * 100;
                const width = endPercent - startPercent;
                
                return (
                  <div 
                    key={i}
                    className="absolute h-4 bg-blue-500 rounded-sm"
                    style={{
                      left: `${startPercent}%`,
                      width: `${width}%`,
                      top: `${10 + i * 20}px`,
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkShiftsSection;

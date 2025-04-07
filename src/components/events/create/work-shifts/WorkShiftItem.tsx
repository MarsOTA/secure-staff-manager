
import React from "react";
import { WorkShift } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { X, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { dayOptions } from "./workShiftConstants";

interface WorkShiftItemProps {
  shift: WorkShift;
  index: number;
  onChange: (index: number, field: keyof WorkShift, value: string) => void;
  onRemove: (index: number) => void;
  isLast: boolean;
}

const WorkShiftItem: React.FC<WorkShiftItemProps> = ({ 
  shift, 
  index, 
  onChange, 
  onRemove, 
  isLast 
}) => {
  return (
    <div className="flex flex-col space-y-2 mb-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Turno {index + 1}</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onRemove(index)}
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
            onValueChange={(value) => onChange(index, "dayOfWeek", value)}
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
              onChange={(e) => onChange(index, "startTime", e.target.value)}
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
              onChange={(e) => onChange(index, "endTime", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
      {!isLast && <Separator className="my-2" />}
    </div>
  );
};

export default WorkShiftItem;

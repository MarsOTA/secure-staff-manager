
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { WorkShift } from "@/types/events";
import { Card, CardContent } from "@/components/ui/card";
import WorkShiftItem from "./work-shifts/WorkShiftItem";
import WeeklyShiftView from "./work-shifts/WeeklyShiftView";

interface WorkShiftsSectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  workShifts: WorkShift[];
  setWorkShifts: React.Dispatch<React.SetStateAction<WorkShift[]>>;
  showWorkShifts: boolean;
}

const WorkShiftsSection: React.FC<WorkShiftsSectionProps> = ({
  startDate,
  endDate,
  workShifts,
  setWorkShifts,
  showWorkShifts
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Imposta lo stato di editing in base alla presenza di turni
  useEffect(() => {
    setIsEditing(workShifts.length > 0);
  }, [workShifts.length]);
  
  const handleAddShift = () => {
    setWorkShifts([...workShifts, {
      dayOfWeek: "tutti", // Default: "tutti" per applicare a tutti i giorni
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
              <WorkShiftItem
                key={index}
                shift={shift}
                index={index}
                onChange={handleShiftChange}
                onRemove={handleRemoveShift}
                isLast={index === workShifts.length - 1}
              />
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
      
      {workShifts.length > 0 && <WeeklyShiftView workShifts={workShifts} />}
    </div>
  );
};

export default WorkShiftsSection;


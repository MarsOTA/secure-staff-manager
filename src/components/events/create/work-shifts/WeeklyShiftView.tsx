
import React from "react";
import { WorkShift } from "@/types/events";
import { dayMap } from "./workShiftConstants";

interface WeeklyShiftViewProps {
  workShifts: WorkShift[];
}

const WeeklyShiftView: React.FC<WeeklyShiftViewProps> = ({ workShifts }) => {
  return (
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
  );
};

export default WeeklyShiftView;

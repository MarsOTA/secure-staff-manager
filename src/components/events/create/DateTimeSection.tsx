
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { it } from "date-fns/locale";

interface DateTimeSectionProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string;
  endTime: string;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
}

const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  setStartDate,
  setEndDate,
  setStartTime,
  setEndTime
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label>Data inizio *</Label>
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={setStartDate}
            locale={it}
            className="mx-auto"
          />
          <div className="mt-4">
            <Label htmlFor="start-time">Ora inizio *</Label>
            <Input 
              id="start-time" 
              type="time" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Data fine *</Label>
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={setEndDate}
            locale={it}
            className="mx-auto"
          />
          <div className="mt-4">
            <Label htmlFor="end-time">Ora fine *</Label>
            <Input 
              id="end-time" 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeSection;

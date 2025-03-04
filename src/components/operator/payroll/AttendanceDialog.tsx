
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Event, attendanceOptions } from "./types";

interface AttendanceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Event | null;
  onSubmit: (eventId: number, attendance: string | null) => void;
}

const AttendanceDialog: React.FC<AttendanceDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedEvent,
  onSubmit
}) => {
  const [selectedAttendance, setSelectedAttendance] = useState<string | null>(
    selectedEvent?.attendance || null
  );

  const handleSubmit = () => {
    if (!selectedEvent) return;
    onSubmit(selectedEvent.id, selectedAttendance);
    onOpenChange(false);
  };

  // Update the selected attendance when the selected event changes
  React.useEffect(() => {
    if (selectedEvent) {
      setSelectedAttendance(selectedEvent.attendance || null);
    }
  }, [selectedEvent]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registra presenza</DialogTitle>
        </DialogHeader>
        
        {selectedEvent && (
          <div className="py-4">
            <div className="mb-4">
              <h3 className="font-medium">{selectedEvent.title}</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(selectedEvent.start_date).toLocaleDateString('it-IT')} - {selectedEvent.client}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="attendance">Stato di presenza</Label>
                <Select 
                  value={selectedAttendance || ''} 
                  onValueChange={setSelectedAttendance}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    {attendanceOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${option.color}`}>
                          {option.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSubmit}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;

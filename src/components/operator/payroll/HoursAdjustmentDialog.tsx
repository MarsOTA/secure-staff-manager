
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PayrollCalculation } from "./types";

interface HoursAdjustmentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: PayrollCalculation | null;
  onSubmit: (eventId: number, actualHours: number) => void;
}

const HoursAdjustmentDialog: React.FC<HoursAdjustmentDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedEvent,
  onSubmit,
}) => {
  const [actualHours, setActualHours] = useState<string>("");

  React.useEffect(() => {
    if (selectedEvent && selectedEvent.actual_hours) {
      setActualHours(selectedEvent.actual_hours.toString());
    } else if (selectedEvent && selectedEvent.estimated_hours) {
      setActualHours(selectedEvent.estimated_hours.toString());
    } else {
      setActualHours("");
    }
  }, [selectedEvent]);

  const handleSubmit = () => {
    if (selectedEvent && actualHours) {
      onSubmit(selectedEvent.eventId, parseFloat(actualHours));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifica Ore di Lavoro</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {selectedEvent && (
            <>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="eventName">Evento:</Label>
                <div id="eventName" className="font-medium">{selectedEvent.eventTitle}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="client">Cliente:</Label>
                <div id="client" className="font-medium">{selectedEvent.client}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="date">Data:</Label>
                <div id="date" className="font-medium">{selectedEvent.date}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="estimatedHours">Ore Stimate:</Label>
                <div id="estimatedHours" className="font-medium">
                  {selectedEvent.estimated_hours?.toFixed(2) || "Non disponibile"}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="actualHours">Ore Effettive:</Label>
                <Input
                  id="actualHours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={actualHours}
                  onChange={(e) => setActualHours(e.target.value)}
                  className="col-span-1"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Salva</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HoursAdjustmentDialog;

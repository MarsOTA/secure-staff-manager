
import React from 'react';
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/pages/Events";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EventDetailDialogProps {
  event: Event | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEventClose: (eventId: number) => void;
  isClosingEvent: boolean;
}

const EventDetailDialog = ({ 
  event, 
  isOpen, 
  onOpenChange, 
  onEventClose,
  isClosingEvent 
}: EventDetailDialogProps) => {
  const navigate = useNavigate();
  
  // Helper function to format date range
  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.getDate() === end.getDate() && 
                    start.getMonth() === end.getMonth() && 
                    start.getFullYear() === end.getFullYear();
    
    const startDateStr = format(start, "d MMMM yyyy", { locale: it });
    const endDateStr = format(end, "d MMMM yyyy", { locale: it });
    const startTimeStr = format(start, "HH:mm");
    const endTimeStr = format(end, "HH:mm");
    
    if (sameDay) {
      return `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      return `Dal ${startDateStr}, ${startTimeStr} al ${endDateStr}, ${endTimeStr}`;
    }
  };

  if (!event) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
              <p className="text-base">{event.client}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Località</h4>
              <p className="text-base">{event.location || "Non specificata"}</p>
            </div>
          </div>
          
          {event.address && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Indirizzo</h4>
              <p className="text-base">{event.address}</p>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Data e Ora</h4>
            <p className="text-base">{formatDateRange(event.startDate, event.endDate)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Stato</h4>
            <p className="text-base capitalize">{event.status || "upcoming"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Personale Richiesto</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {event.personnelTypes.map((type) => (
                <span 
                  key={type}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          
          {(event.grossHours || event.netHours) && (
            <div className="grid grid-cols-2 gap-4">
              {event.grossHours && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Ore lorde</h4>
                  <p className="text-base">{event.grossHours}</p>
                </div>
              )}
              {event.netHours && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Ore nette</h4>
                  <p className="text-base">{event.netHours}</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Chiudi
            </Button>
          </div>
          <div className="flex gap-2">
            {event.status !== 'completed' && (
              <Button 
                variant="outline" 
                className="bg-green-50 border-green-200 text-green-600 hover:bg-green-100 hover:text-green-700"
                onClick={() => onEventClose(event.id)}
                disabled={isClosingEvent}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {isClosingEvent ? "Chiusura in corso..." : "Chiudi Evento"}
              </Button>
            )}
            <Button onClick={() => {
              onOpenChange(false);
              navigate(`/events/create?id=${event.id}`);
            }}>
              <Edit className="mr-2 h-4 w-4" />
              Modifica
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;

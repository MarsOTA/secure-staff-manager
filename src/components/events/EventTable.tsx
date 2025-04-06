import React from 'react';
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Event } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface EventTableProps {
  events: Event[];
  onShowDetails: (event: Event) => void;
  onEditEvent: (e: React.MouseEvent, eventId: number) => void;
  onDeleteEvent: (e: React.MouseEvent, eventId: number) => void;
}

const EventTable = ({ events, onShowDetails, onEditEvent, onDeleteEvent }: EventTableProps) => {
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

  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const calculateTotalPersonnel = (event: Event): number => {
    if (typeof event.personnelCount === 'number') {
      return event.personnelCount;
    } else if (event.personnelCount && typeof event.personnelCount === 'object') {
      return Object.values(event.personnelCount).reduce((sum, count) => sum + Number(count), 0);
    } else {
      return event.personnelTypes.length;
    }
  };

  const getAssignedPersonnelCount = (event: Event): number => {
    return event.assignedPersonnel || 0;
  };

  const getStaffRatioColor = (assigned: number, total: number): string => {
    if (assigned < total) {
      return 'text-orange-500 font-medium';
    } else if (assigned === total) {
      return 'text-green-600 font-medium';
    } else {
      return 'text-gray-900 font-medium';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titolo Evento</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Data e Ora</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead>Personale Richiesto</TableHead>
          <TableHead>Staff Richiesto</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow 
            key={event.id} 
            className="cursor-pointer hover:bg-muted/50" 
            onClick={() => onShowDetails(event)}
          >
            <TableCell className="font-medium">{event.title}</TableCell>
            <TableCell>{event.client}</TableCell>
            <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(event.status)}`}>
                {event.status ? (
                  event.status === 'completed' ? 'Completato' :
                  event.status === 'cancelled' ? 'Annullato' :
                  event.status === 'in-progress' ? 'In corso' : 'Programmato'
                ) : 'Programmato'}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {event.personnelTypes.map((type) => (
                  <span 
                    key={type}
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </TableCell>
            <TableCell>
              {(() => {
                const assigned = getAssignedPersonnelCount(event);
                const total = calculateTotalPersonnel(event);
                const ratioClass = getStaffRatioColor(assigned, total);
                
                return (
                  <span className={ratioClass}>
                    {assigned}/{total}
                  </span>
                );
              })()}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => onEditEvent(e, event.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600" 
                  onClick={(e) => onDeleteEvent(e, event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EventTable;

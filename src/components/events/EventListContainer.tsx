
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EventTable from "@/components/events/EventTable";
import EmptyEventCard from "@/components/events/EmptyEventCard";
import { Event } from "@/types/events";

interface EventListContainerProps {
  events: Event[];
  onShowDetails: (event: Event) => void;
  onEditEvent: (e: React.MouseEvent, eventId: number) => void;
  onDeleteEvent: (e: React.MouseEvent, eventId: number) => void;
  onCreateEvent: () => void;
}

const EventListContainer: React.FC<EventListContainerProps> = ({
  events,
  onShowDetails,
  onEditEvent,
  onDeleteEvent,
  onCreateEvent
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lista Eventi</CardTitle>
        <Button onClick={onCreateEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Crea nuovo evento
        </Button>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <EventTable
            events={events}
            onShowDetails={onShowDetails}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        ) : (
          <EmptyEventCard onCreateEvent={onCreateEvent} />
        )}
      </CardContent>
    </Card>
  );
};

export default EventListContainer;

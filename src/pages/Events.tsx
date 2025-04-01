
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import EventListContainer from "@/components/events/EventListContainer";
import EventDetailDialog from "@/components/events/EventDetailDialog";
import { useEvents } from "@/hooks/useEvents";
import { useEventDetail } from "@/components/events/useEventDetail";

const Events = () => {
  const navigate = useNavigate();
  const { events, setEvents, handleDeleteEvent } = useEvents();
  const { 
    selectedEvent, 
    isDetailsOpen, 
    isClosingEvent, 
    setIsDetailsOpen, 
    handleShowDetails, 
    handleCloseEvent 
  } = useEventDetail(events, setEvents);

  const handleCreateEvent = () => {
    navigate("/events/create");
  };
  
  const handleEditEvent = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    navigate(`/events/create?id=${eventId}`);
  };
  
  const handleDeleteEventClick = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    handleDeleteEvent(eventId);
  };

  return (
    <Layout>
      <EventListContainer
        events={events}
        onShowDetails={handleShowDetails}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEventClick}
        onCreateEvent={handleCreateEvent}
      />
      
      <EventDetailDialog
        event={selectedEvent}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEventClose={handleCloseEvent}
        isClosingEvent={isClosingEvent}
      />
    </Layout>
  );
};

export default Events;

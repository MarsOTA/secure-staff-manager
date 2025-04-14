
// Update status automatically for past events
export const updateEventStatus = (eventOperatorsData: any[]) => {
  const now = new Date();
  return eventOperatorsData.map(item => {
    if (item.events) {
      const endDate = new Date(item.events.end_date);
      if (endDate < now && item.events.status !== "completed" && item.events.status !== "cancelled") {
        // If the event is past and not already completed or cancelled, consider it as completed
        item.events.status = "completed";
      }
    }
    return item;
  });
};

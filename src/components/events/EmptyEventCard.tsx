
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon } from "lucide-react";

interface EmptyEventCardProps {
  onCreateEvent: () => void;
}

const EmptyEventCard = ({ onCreateEvent }: EmptyEventCardProps) => {
  return (
    <div className="text-center py-8">
      <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-semibold">Nessun evento</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Non ci sono eventi programmati. Inizia creando un nuovo evento.
      </p>
      <Button onClick={onCreateEvent} className="mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Crea nuovo evento
      </Button>
    </div>
  );
};

export default EmptyEventCard;

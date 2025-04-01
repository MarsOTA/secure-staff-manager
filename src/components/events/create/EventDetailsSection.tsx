
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Client } from "@/pages/Clients";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventDetailsSectionProps {
  title: string;
  client: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setClient: React.Dispatch<React.SetStateAction<string>>;
  clients: Client[];
  navigate: (path: string) => void;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  title,
  client,
  setTitle,
  setClient,
  clients,
  navigate
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Titolo evento *</Label>
        <Input 
          id="title" 
          placeholder="Inserisci titolo evento" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="client">Cliente *</Label>
        <Select 
          value={client} 
          onValueChange={setClient}
        >
          <SelectTrigger id="client">
            <SelectValue placeholder="Seleziona cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.length > 0 ? (
              clients.map((clientItem) => (
                <SelectItem key={clientItem.id} value={clientItem.id.toString()}>
                  {clientItem.companyName}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-clients" disabled>
                Nessun cliente disponibile
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {clients.length === 0 && (
          <p className="text-sm text-amber-500 mt-1">
            Non ci sono clienti disponibili. 
            <Button 
              variant="link" 
              className="px-1 py-0 h-auto text-sm" 
              onClick={() => navigate('/client-create')}
            >
              Crea un cliente
            </Button>
          </p>
        )}
      </div>
    </>
  );
};

export default EventDetailsSection;

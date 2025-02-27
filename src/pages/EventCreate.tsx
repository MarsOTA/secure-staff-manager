
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Tipo di personale con etichette
const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
];

// Clienti fittizi
const clients = [
  { id: 1, name: "Rock Productions" },
  { id: 2, name: "MediaGroup" },
  { id: 3, name: "Festival Italiano" },
  { id: 4, name: "Sport Events" },
];

const EventCreate = () => {
  const navigate = useNavigate();
  
  // Stati per il form
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  
  // Gestione personale selezionato
  const handlePersonnelChange = (personnelId: string) => {
    setSelectedPersonnel((current) => {
      if (current.includes(personnelId)) {
        return current.filter((id) => id !== personnelId);
      } else {
        return [...current, personnelId];
      }
    });
  };
  
  // Gestione invio form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione base
    if (!title || !client || selectedPersonnel.length === 0 || !startDate || !endDate) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }
    
    // Creazione oggetto evento completo (qui potresti salvarlo in un DB)
    const fullStartDate = combineDateTime(startDate, startTime);
    const fullEndDate = combineDateTime(endDate, endTime);
    
    // Validazione date
    if (fullEndDate <= fullStartDate) {
      toast.error("La data di fine deve essere successiva alla data di inizio");
      return;
    }
    
    // Qui andrebbe integrata la logica per salvare l'evento
    toast.success("Evento creato con successo!");
    navigate("/events");
  };
  
  // Funzione per combinare data e ora
  const combineDateTime = (date: Date | undefined, timeString: string): Date => {
    if (!date) return new Date();
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };
  
  return (
    <Layout>
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/events')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna agli eventi
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Crea nuovo evento</CardTitle>
          <CardDescription>
            Compila il form per creare un nuovo evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titolo evento */}
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
            
            {/* Cliente */}
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
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Tipo di personale */}
            <div className="space-y-2">
              <Label>Tipologia di personale richiesto *</Label>
              <div className="space-y-2">
                {personnelTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`personnel-${type.id}`} 
                      checked={selectedPersonnel.includes(type.id)}
                      onCheckedChange={() => handlePersonnelChange(type.id)}
                    />
                    <Label htmlFor={`personnel-${type.id}`} className="cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Date e orari */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Data e ora inizio */}
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
              
              {/* Data e ora fine */}
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
            
            <div className="pt-4">
              <Button type="submit" className="w-full md:w-auto">
                Crea Evento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default EventCreate;

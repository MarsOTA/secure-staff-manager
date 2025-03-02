import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, UserCheck, UserX, CalendarClock } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Event } from "./Events";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Operator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  assignedEvents?: number[]; // IDs degli eventi assegnati
}

const EVENTS_STORAGE_KEY = "app_events_data";
const OPERATORS_STORAGE_KEY = "app_operators_data";

const Operators = () => {
  const [operators, setOperators] = useState<Operator[]>([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      phone: "+39 123 456 7890",
      status: "active",
      assignedEvents: [],
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@example.com",
      phone: "+39 098 765 4321",
      status: "inactive",
      assignedEvents: [],
    },
  ]);

  const [events, setEvents] = useState<Event[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | null>(null);
  const [assigningOperator, setAssigningOperator] = useState<Operator | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
    if (storedOperators) {
      try {
        setOperators(JSON.parse(storedOperators));
      } catch (error) {
        console.error("Errore nel caricamento degli operatori:", error);
      }
    } else {
      localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
    }
    
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (storedEvents) {
      try {
        const parsedEvents = JSON.parse(storedEvents);
        const eventsWithDates = parsedEvents.map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate)
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(operators));
  }, [operators]);

  const handleStatusToggle = (id: number) => {
    setOperators((prev) =>
      prev.map((op) =>
        op.id === id
          ? { ...op, status: op.status === "active" ? "inactive" : "active" }
          : op
      )
    );
    toast.success("Stato operatore aggiornato con successo");
  };

  const handleDelete = (id: number) => {
    setOperators((prev) => prev.filter((op) => op.id !== id));
    toast.success("Operatore eliminato con successo");
  };

  const openEditDialog = (operator: Operator) => {
    setEditingOperator(operator);
    setFormData({
      name: operator.name,
      email: operator.email,
      phone: operator.phone,
      status: operator.status,
    });
    setIsDialogOpen(true);
  };

  const handleNewOperator = () => {
    setEditingOperator(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingOperator) {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === editingOperator.id
            ? { ...op, ...formData }
            : op
        )
      );
      toast.success("Operatore aggiornato con successo");
    } else {
      const newId = Math.max(0, ...operators.map((op) => op.id)) + 1;
      setOperators((prev) => [
        ...prev,
        { id: newId, ...formData, assignedEvents: [] },
      ]);
      toast.success("Nuovo operatore aggiunto con successo");
    }
    
    setIsDialogOpen(false);
  };

  const openAssignDialog = (operator: Operator) => {
    setAssigningOperator(operator);
    setSelectedEventId("");
    setIsAssignDialogOpen(true);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!assigningOperator || !selectedEventId) {
      toast.error("Seleziona un evento");
      return;
    }
    
    const eventId = parseInt(selectedEventId);
    
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id === assigningOperator.id) {
          const currentAssignedEvents = op.assignedEvents || [];
          if (currentAssignedEvents.includes(eventId)) {
            toast.info("Operatore già assegnato a questo evento");
            return op;
          }
          
          return {
            ...op,
            assignedEvents: [...currentAssignedEvents, eventId]
          };
        }
        return op;
      })
    );
    
    const eventName = events.find(e => e.id === eventId)?.title || "Evento selezionato";
    
    toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
    setIsAssignDialogOpen(false);
  };

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

  const getAssignedEvents = (operatorId: number) => {
    const operator = operators.find(op => op.id === operatorId);
    if (!operator || !operator.assignedEvents || operator.assignedEvents.length === 0) {
      return [];
    }
    
    return events.filter(event => operator.assignedEvents?.includes(event.id));
  };

  const handleEdit = (operator: Operator) => {
    navigate(`/operator-profile/${operator.id}`);
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Operatori</CardTitle>
          <Button onClick={handleNewOperator}>
            <Plus className="mr-2 h-4 w-4" />
            Nuovo Operatore
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefono</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Eventi Assegnati</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {operators.map((operator) => (
                <TableRow key={operator.id}>
                  <TableCell>{operator.name}</TableCell>
                  <TableCell>{operator.email}</TableCell>
                  <TableCell>{operator.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        operator.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {operator.status === "active" ? "Attivo" : "Inattivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getAssignedEvents(operator.id).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {getAssignedEvents(operator.id).map((event) => (
                          <span 
                            key={event.id}
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                            title={formatDateRange(event.startDate, event.endDate)}
                          >
                            {event.title}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Nessun evento</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleStatusToggle(operator.id)}
                        title={operator.status === "active" ? "Disattiva operatore" : "Attiva operatore"}
                      >
                        {operator.status === "active" ? (
                          <UserX className="h-4 w-4" />
                        ) : (
                          <UserCheck className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(operator)}
                        title="Modifica operatore"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openAssignDialog(operator)}
                        title="Assegna a evento"
                      >
                        <CalendarClock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(operator.id)}
                        title="Elimina operatore"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOperator ? "Modifica Operatore" : "Nuovo Operatore"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telefono
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Stato
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => 
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Attivo</SelectItem>
                    <SelectItem value="inactive">Inattivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {editingOperator ? "Aggiorna" : "Aggiungi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assegna {assigningOperator?.name} a un evento
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="grid gap-4 py-4">
              <Label htmlFor="event" className="font-medium">
                Seleziona evento
              </Label>
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un evento" />
                </SelectTrigger>
                <SelectContent>
                  {events.length > 0 ? (
                    events.map((event) => (
                      <SelectItem key={event.id} value={event.id.toString()}>
                        {event.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-events" disabled>
                      Nessun evento disponibile
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              
              {selectedEventId && events.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  {(() => {
                    const event = events.find(e => e.id.toString() === selectedEventId);
                    if (!event) return null;
                    
                    return (
                      <div className="space-y-2">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Cliente: {event.client}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Data e ora: </span>
                          {formatDateRange(event.startDate, event.endDate)}
                        </div>
                        {event.location && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Località: </span>
                            {event.location}
                          </div>
                        )}
                        {event.address && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Indirizzo: </span>
                            {event.address}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsAssignDialogOpen(false)}>
                Annulla
              </Button>
              <Button type="submit" disabled={!selectedEventId || events.length === 0}>
                Assegna
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Operators;

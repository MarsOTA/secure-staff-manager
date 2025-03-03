
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Edit,
  Building,
  Mail,
  Phone,
  MapPin,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { toast } from "sonner";
import { Client } from "./Clients";
import { Event } from "./Events";

const CLIENTS_STORAGE_KEY = "app_clients_data";
const EVENTS_STORAGE_KEY = "app_events_data";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState<Client | null>(null);
  const [clientEvents, setClientEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carica i dati del cliente
  useEffect(() => {
    const loadClient = () => {
      try {
        const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
        if (!storedClients) {
          toast.error("Nessun cliente trovato");
          navigate("/clients");
          return;
        }
        
        const clients = JSON.parse(storedClients);
        const foundClient = clients.find((c: Client) => c.id.toString() === id);
        
        if (!foundClient) {
          toast.error("Cliente non trovato");
          navigate("/clients");
          return;
        }
        
        setClient(foundClient);
        
        // Carica gli eventi associati al cliente
        const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
        if (storedEvents) {
          const events = JSON.parse(storedEvents);
          
          // Converti le stringhe di date in oggetti Date
          const parsedEvents = events.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate)
          }));
          
          // Filtra gli eventi per il cliente corrente
          const filteredEvents = parsedEvents.filter(
            (event: Event) => event.client === foundClient.companyName
          );
          
          setClientEvents(filteredEvents);
        }
      } catch (error) {
        console.error("Errore nel caricamento del cliente:", error);
        toast.error("Errore nel caricamento dei dati del cliente");
        navigate("/clients");
      } finally {
        setLoading(false);
      }
    };
    
    loadClient();
  }, [id, navigate]);
  
  // Funzione per formattare data e ora
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
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Caricamento...</div>
        </div>
      </Layout>
    );
  }
  
  if (!client) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Cliente non trovato</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/clients")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna alla lista
          </Button>
          <Button 
            onClick={() => navigate(`/client-create?id=${client.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifica
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Building className="h-6 w-6 mr-2 text-primary" />
              <CardTitle>{client.companyName}</CardTitle>
            </div>
            <CardDescription>
              P.IVA/C.F.: {client.taxId}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p>{client.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Telefono</h4>
                    <p>{client.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Indirizzo</h4>
                    <p>
                      {client.address && `${client.address}, `}
                      {client.zipCode && `${client.zipCode} `}
                      {client.city && `${client.city} `}
                      {client.province && `(${client.province})`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Persona di contatto</h4>
                    <p>
                      {client.contactPerson || "Non specificato"}
                      {client.contactRole && ` - ${client.contactRole}`}
                    </p>
                  </div>
                </div>
                
                {client.notes && (
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Note</h4>
                      <p className="whitespace-pre-line">{client.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Eventi del cliente
              </h3>
              
              {clientEvents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titolo Evento</TableHead>
                      <TableHead>Data e Ora</TableHead>
                      <TableHead>Personale Richiesto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientEvents.map((event) => (
                      <TableRow 
                        key={event.id} 
                        className="cursor-pointer hover:bg-muted/50" 
                        onClick={() => navigate(`/events/create?id=${event.id}`)}
                      >
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>{formatDateRange(event.startDate, event.endDate)}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 bg-muted/20 rounded-md">
                  <p className="text-muted-foreground">Nessun evento registrato per questo cliente</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              variant="outline"
              onClick={() => navigate("/events/create", { 
                state: { preselectedClient: client.companyName } 
              })}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Crea nuovo evento
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientDetail;

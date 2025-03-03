
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Users, Edit, Trash2, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Definizione dell'interfaccia Client
export interface Client {
  id: number;
  companyName: string;
  taxId: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  province?: string;
  contactPerson?: string;
  contactRole?: string;
  notes?: string;
}

// Chiave per il localStorage
const CLIENTS_STORAGE_KEY = "app_clients_data";
const EVENTS_STORAGE_KEY = "app_events_data";

const Clients = () => {
  const navigate = useNavigate();
  
  // Stato per i clienti e la ricerca
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clientsWithEvents, setClientsWithEvents] = useState<{id: number, eventCount: number}[]>([]);
  
  // Carica i clienti dal localStorage all'avvio
  useEffect(() => {
    const loadClients = () => {
      const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
      
      if (storedClients) {
        try {
          const parsedClients = JSON.parse(storedClients);
          setClients(parsedClients);
        } catch (error) {
          console.error("Errore nel caricamento dei clienti:", error);
          
          // Dati di esempio come fallback
          const defaultClients = [
            {
              id: 1,
              companyName: "EventiTop Srl",
              taxId: "IT12345678901",
              email: "info@eventitop.it",
              phone: "+39 02 1234567",
              address: "Via Roma 123",
              city: "Milano",
              zipCode: "20100",
              province: "MI",
              contactPerson: "Mario Rossi",
              contactRole: "Direttore Eventi",
            },
            {
              id: 2,
              companyName: "Congressi Italia SpA",
              taxId: "IT98765432109",
              email: "contatti@congressiitalia.com",
              phone: "+39 06 9876543",
              address: "Viale Europa 45",
              city: "Roma",
              zipCode: "00144",
              province: "RM",
              contactPerson: "Giulia Bianchi",
              contactRole: "Responsabile Vendite",
            },
          ];
          
          setClients(defaultClients);
          localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(defaultClients));
        }
      } else {
        // Nessun cliente nel localStorage, utilizziamo i dati di esempio
        const defaultClients = [
          {
            id: 1,
            companyName: "EventiTop Srl",
            taxId: "IT12345678901",
            email: "info@eventitop.it",
            phone: "+39 02 1234567",
            address: "Via Roma 123",
            city: "Milano",
            zipCode: "20100",
            province: "MI",
            contactPerson: "Mario Rossi",
            contactRole: "Direttore Eventi",
          },
          {
            id: 2,
            companyName: "Congressi Italia SpA",
            taxId: "IT98765432109",
            email: "contatti@congressiitalia.com",
            phone: "+39 06 9876543",
            address: "Viale Europa 45",
            city: "Roma",
            zipCode: "00144",
            province: "RM",
            contactPerson: "Giulia Bianchi",
            contactRole: "Responsabile Vendite",
          },
        ];
        
        setClients(defaultClients);
        localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(defaultClients));
      }
    };
    
    loadClients();
  }, []);
  
  // Carica il conteggio degli eventi per cliente
  useEffect(() => {
    const loadEventCounts = () => {
      const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
      
      if (storedEvents) {
        try {
          const events = JSON.parse(storedEvents);
          
          // Calcola il numero di eventi per cliente
          const clientEventCounts = clients.map(client => {
            const count = events.filter((event: any) => event.client === client.companyName).length;
            return { id: client.id, eventCount: count };
          });
          
          setClientsWithEvents(clientEventCounts);
        } catch (error) {
          console.error("Errore nel calcolo degli eventi per cliente:", error);
          // In caso di errore, inizializza con conteggio zero
          const emptyCount = clients.map(client => ({ id: client.id, eventCount: 0 }));
          setClientsWithEvents(emptyCount);
        }
      } else {
        // Nessun evento trovato, inizializza con conteggio zero
        const emptyCount = clients.map(client => ({ id: client.id, eventCount: 0 }));
        setClientsWithEvents(emptyCount);
      }
    };
    
    if (clients.length > 0) {
      loadEventCounts();
    }
  }, [clients]);
  
  // Filtra i clienti in base al termine di ricerca
  const filteredClients = clients.filter(client => 
    client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Funzione per navigare alla pagina di creazione cliente
  const handleCreateClient = () => {
    navigate("/client-create");
  };
  
  // Funzione per modificare un cliente
  const handleEditClient = (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    navigate(`/client-create?id=${clientId}`);
  };
  
  // Funzione per visualizzare i dettagli di un cliente
  const handleViewClient = (clientId: number) => {
    navigate(`/client-detail/${clientId}`);
  };
  
  // Funzione per eliminare un cliente
  const handleDeleteClient = (e: React.MouseEvent, clientId: number) => {
    e.stopPropagation();
    
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
    
    toast.success("Cliente eliminato con successo");
  };
  
  // Funzione per ottenere il conteggio degli eventi per un cliente specifico
  const getEventCount = (clientId: number) => {
    const client = clientsWithEvents.find(c => c.id === clientId);
    return client ? client.eventCount : 0;
  };

  return (
    <Layout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Clienti</CardTitle>
          <Button onClick={handleCreateClient}>
            <Plus className="mr-2 h-4 w-4" />
            Crea nuovo cliente
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca per ragione sociale, P.IVA/C.F., email o telefono..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {filteredClients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ragione Sociale</TableHead>
                  <TableHead>P.IVA/C.F.</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead>Numero Eventi</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="cursor-pointer hover:bg-muted/50" 
                    onClick={() => handleViewClient(client.id)}
                  >
                    <TableCell className="font-medium">{client.companyName}</TableCell>
                    <TableCell>{client.taxId}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>{getEventCount(client.id)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => handleEditClient(e, client.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600" 
                          onClick={(e) => handleDeleteClient(e, client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">Nessun cliente</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm ? "Nessun cliente trovato per la ricerca effettuata." : "Non ci sono clienti registrati. Inizia creando un nuovo cliente."}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateClient} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Crea nuovo cliente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Clients;

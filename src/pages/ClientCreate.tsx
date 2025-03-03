
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Client } from "./Clients";

const CLIENTS_STORAGE_KEY = "app_clients_data";

const ClientCreate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("id");
  
  const [formData, setFormData] = useState<Omit<Client, "id">>({
    companyName: "",
    taxId: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    province: "",
    contactPerson: "",
    contactRole: "",
    notes: "",
  });
  
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(clientId ? true : false);
  
  // Carica i dati del cliente se in modalità modifica
  useEffect(() => {
    if (clientId) {
      setIsEdit(true);
      
      try {
        const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
        if (!storedClients) {
          toast.error("Errore nel caricamento dei dati del cliente");
          navigate("/clients");
          return;
        }
        
        const clients = JSON.parse(storedClients);
        const client = clients.find((c: Client) => c.id.toString() === clientId);
        
        if (!client) {
          toast.error("Cliente non trovato");
          navigate("/clients");
          return;
        }
        
        // Rimuovi l'ID dal formData
        const { id, ...clientData } = client;
        setFormData(clientData);
      } catch (error) {
        console.error("Errore nel caricamento del cliente:", error);
        toast.error("Errore nel caricamento dei dati del cliente");
      } finally {
        setLoading(false);
      }
    }
  }, [clientId, navigate]);
  
  // Gestione del cambio dei valori nei campi del form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Funzione per salvare il cliente
  const handleSave = () => {
    // Validazione base
    if (!formData.companyName.trim()) {
      toast.error("La ragione sociale è obbligatoria");
      return;
    }
    
    if (!formData.taxId.trim()) {
      toast.error("La P.IVA/C.F. è obbligatoria");
      return;
    }
    
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast.error("Inserire una email valida");
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error("Il numero di telefono è obbligatorio");
      return;
    }
    
    try {
      const storedClients = localStorage.getItem(CLIENTS_STORAGE_KEY);
      let clients = [];
      
      if (storedClients) {
        clients = JSON.parse(storedClients);
      }
      
      if (isEdit && clientId) {
        // Modalità modifica
        clients = clients.map((client: Client) => {
          if (client.id.toString() === clientId) {
            return { ...formData, id: client.id };
          }
          return client;
        });
        
        toast.success("Cliente aggiornato con successo");
      } else {
        // Modalità creazione
        const newId = clients.length > 0 
          ? Math.max(...clients.map((c: Client) => c.id)) + 1 
          : 1;
          
        clients.push({ ...formData, id: newId });
        toast.success("Nuovo cliente creato con successo");
      }
      
      localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients));
      navigate("/clients");
    } catch (error) {
      console.error("Errore nel salvataggio del cliente:", error);
      toast.error("Errore nel salvataggio dei dati");
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
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {isEdit ? "Aggiorna cliente" : "Crea cliente"}
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? "Modifica Cliente" : "Nuovo Cliente"}</CardTitle>
            <CardDescription>
              {isEdit 
                ? "Modifica i dati del cliente esistente" 
                : "Inserisci i dati per creare un nuovo cliente"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Ragione Sociale *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxId">P.IVA/C.F. *</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Città</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CAP</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    maxLength={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="province">Provincia</Label>
                  <Input
                    id="province"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    maxLength={2}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Persona di Contatto</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactRole">Ruolo</Label>
                  <Input
                    id="contactRole"
                    name="contactRole"
                    value={formData.contactRole}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Note</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => navigate("/clients")}>
              Annulla
            </Button>
            <Button onClick={handleSave}>
              {isEdit ? "Aggiorna" : "Crea"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ClientCreate;

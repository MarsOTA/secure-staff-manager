
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Importing our new components and hooks
import { useNavigate } from "react-router-dom";
import { useOperators, Operator } from "@/hooks/useOperators";
import OperatorsTable from "@/components/operators/OperatorsTable";
import OperatorForm from "@/components/operators/OperatorForm";
import AssignEventForm from "@/components/operators/AssignEventForm";

const Operators = () => {
  const { 
    operators, 
    setOperators, 
    events, 
    handleStatusToggle, 
    handleDelete, 
    assignOperatorToEvent,
    getAssignedEvents 
  } = useOperators();
  
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
    const success = assignOperatorToEvent(assigningOperator.id, eventId);
    
    if (success) {
      const eventName = events.find(e => e.id === eventId)?.title || "Evento selezionato";
      toast.success(`${assigningOperator.name} assegnato a "${eventName}"`);
    }
    
    setIsAssignDialogOpen(false);
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
          <OperatorsTable 
            operators={operators}
            getAssignedEvents={getAssignedEvents}
            onStatusToggle={handleStatusToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAssign={openAssignDialog}
          />
        </CardContent>
      </Card>

      {/* Operator Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingOperator ? "Modifica Operatore" : "Nuovo Operatore"}
            </DialogTitle>
          </DialogHeader>
          <OperatorForm 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isEditing={!!editingOperator}
          />
        </DialogContent>
      </Dialog>

      {/* Assign Event Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assegna {assigningOperator?.name} a un evento
            </DialogTitle>
          </DialogHeader>
          <AssignEventForm 
            events={events}
            selectedEventId={selectedEventId}
            setSelectedEventId={setSelectedEventId}
            onSubmit={handleAssignSubmit}
            onCancel={() => setIsAssignDialogOpen(false)}
            operatorName={assigningOperator?.name}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Operators;


import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const personnelTypes = [
  { id: "security", label: "Security" },
  { id: "doorman", label: "Doorman" },
  { id: "hostess", label: "Hostess/Steward" },
];

interface PersonnelSectionProps {
  selectedPersonnel: string[];
  personnelCounts: Record<string, number>;
  setSelectedPersonnel: React.Dispatch<React.SetStateAction<string[]>>;
  setPersonnelCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const PersonnelSection: React.FC<PersonnelSectionProps> = ({
  selectedPersonnel,
  personnelCounts,
  setSelectedPersonnel,
  setPersonnelCounts
}) => {
  const handlePersonnelChange = (personnelId: string) => {
    setSelectedPersonnel((current) => {
      if (current.includes(personnelId)) {
        setPersonnelCounts(prev => {
          const newCounts = { ...prev };
          delete newCounts[personnelId];
          return newCounts;
        });
        return current.filter((id) => id !== personnelId);
      } else {
        setPersonnelCounts(prev => ({
          ...prev,
          [personnelId]: 1
        }));
        return [...current, personnelId];
      }
    });
  };
  
  const handlePersonnelCountChange = (personnelId: string, count: number) => {
    setPersonnelCounts(prev => ({
      ...prev,
      [personnelId]: Math.max(1, count)
    }));
  };

  return (
    <div className="space-y-2">
      <Label>Tipologia di personale richiesto *</Label>
      <div className="space-y-3">
        {personnelTypes.map((type) => (
          <div key={type.id} className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`personnel-${type.id}`} 
                checked={selectedPersonnel.includes(type.id)}
                onCheckedChange={() => handlePersonnelChange(type.id)}
              />
              <Label htmlFor={`personnel-${type.id}`} className="cursor-pointer">
                {type.label}
              </Label>
            </div>
            
            {selectedPersonnel.includes(type.id) && (
              <div className="flex items-center space-x-2">
                <Label htmlFor={`count-${type.id}`} className="text-sm whitespace-nowrap">
                  Numero:
                </Label>
                <Input
                  id={`count-${type.id}`}
                  type="number"
                  min="1"
                  value={personnelCounts[type.id] || 1}
                  onChange={(e) => handlePersonnelCountChange(type.id, parseInt(e.target.value) || 1)}
                  className="w-20"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonnelSection;

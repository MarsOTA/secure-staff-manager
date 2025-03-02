
import React from "react";
import { useNavigate } from "react-router-dom";
import { ExtendedOperator } from "@/types/operator";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, Star } from "lucide-react";

interface OperatorHeaderProps {
  operator: ExtendedOperator;
  onRatingChange: (rating: number) => void;
  onSave: () => void;
}

const OperatorHeader: React.FC<OperatorHeaderProps> = ({ 
  operator, 
  onRatingChange,
  onSave
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate("/operators")}
          className="mb-4"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Torna alla lista
        </Button>
        <Button onClick={onSave}>Salva modifiche</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Profilo di {operator.name}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-2">
              <span className="mr-2">Valutazione globale:</span>
              <div className="flex items-center">
                <Slider
                  value={[operator.rating]}
                  min={1}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => onRatingChange(value[0])}
                  className="w-48"
                />
                <span className="ml-2 flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {operator.rating}
                </span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  );
};

export default OperatorHeader;

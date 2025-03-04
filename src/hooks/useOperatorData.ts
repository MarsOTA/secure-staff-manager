
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ExtendedOperator, OPERATORS_STORAGE_KEY } from "@/types/operator";

export const useOperatorData = (operatorId: string | undefined) => {
  const navigate = useNavigate();
  const [operator, setOperator] = useState<ExtendedOperator | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Record<string, string>>({});
  
  // Contract state
  const [contractType, setContractType] = useState("full-time");
  const [ccnl, setCcnl] = useState("pulizia-multiservizi");
  const [level, setLevel] = useState("");
  const [employmentType, setEmploymentType] = useState("indeterminato");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [grossSalary, setGrossSalary] = useState("");
  const [netSalary, setNetSalary] = useState("");

  useEffect(() => {
    const loadOperator = () => {
      try {
        const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
        if (!storedOperators) {
          toast.error("Nessun operatore trovato");
          navigate("/operators");
          return;
        }
        
        const operators = JSON.parse(storedOperators);
        const foundOperator = operators.find((op: any) => op.id.toString() === operatorId);
        
        if (!foundOperator) {
          toast.error("Operatore non trovato");
          navigate("/operators");
          return;
        }
        
        const extendedOperator: ExtendedOperator = {
          ...foundOperator,
          rating: foundOperator.rating || 3,
          birthDate: foundOperator.birthDate || "",
          birthCountry: foundOperator.birthCountry || "Italia",
          nationality: foundOperator.nationality || "italiana",
          gender: foundOperator.gender || "uomo",
          city: foundOperator.city || "",
          fiscalCode: foundOperator.fiscalCode || "",
          vatNumber: foundOperator.vatNumber || "",
          address: foundOperator.address || "",
          zipCode: foundOperator.zipCode || "",
          province: foundOperator.province || "",
          residenceCity: foundOperator.residenceCity || "",
          service: foundOperator.service || [],
          occupation: foundOperator.occupation || "disoccupato",
          availability: foundOperator.availability || [],
          drivingLicense: foundOperator.drivingLicense || false,
          hasVehicle: foundOperator.hasVehicle || false,
          fluentLanguages: foundOperator.fluentLanguages || [],
          basicLanguages: foundOperator.basicLanguages || [],
          height: foundOperator.height || 170,
          weight: foundOperator.weight || 70,
          bodyType: foundOperator.bodyType || "atletica",
          eyeColor: foundOperator.eyeColor || "",
          hairColor: foundOperator.hairColor || "castani",
          hairLength: foundOperator.hairLength || "",
          sizes: foundOperator.sizes || [],
          shoeSize: foundOperator.shoeSize || 42,
          chestSize: foundOperator.chestSize || 90,
          waistSize: foundOperator.waistSize || 80,
          hipsSize: foundOperator.hipsSize || 90,
          visibleTattoos: foundOperator.visibleTattoos || false,
          idCardNumber: foundOperator.idCardNumber || "",
          residencePermitNumber: foundOperator.residencePermitNumber || "",
          iban: foundOperator.iban || "",
          bic: foundOperator.bic || "",
          accountHolder: foundOperator.accountHolder || "",
          bankName: foundOperator.bankName || "",
          swiftCode: foundOperator.swiftCode || "",
          accountNumber: foundOperator.accountNumber || "",
          instagram: foundOperator.instagram || "",
          facebook: foundOperator.facebook || "",
          tiktok: foundOperator.tiktok || "",
          linkedin: foundOperator.linkedin || "",
          resumeFile: foundOperator.resumeFile || null,
          resumeFileName: foundOperator.resumeFileName || "",
          idCardFrontImage: foundOperator.idCardFrontImage || null,
          idCardFrontFileName: foundOperator.idCardFrontFileName || "",
          idCardBackImage: foundOperator.idCardBackImage || null,
          idCardBackFileName: foundOperator.idCardBackFileName || "",
          healthCardFrontImage: foundOperator.healthCardFrontImage || null,
          healthCardFrontFileName: foundOperator.healthCardFrontFileName || "",
          healthCardBackImage: foundOperator.healthCardBackImage || null,
          healthCardBackFileName: foundOperator.healthCardBackFileName || "",
          bustPhotoFile: foundOperator.bustPhotoFile || null,
          bustPhotoFileName: foundOperator.bustPhotoFileName || "",
          facePhotoFile: foundOperator.facePhotoFile || null,
          facePhotoFileName: foundOperator.facePhotoFileName || "",
          fullBodyPhotoFile: foundOperator.fullBodyPhotoFile || null,
          fullBodyPhotoFileName: foundOperator.fullBodyPhotoFileName || "",
        };
        
        setOperator(extendedOperator);
        
        const previews: Record<string, string> = {};
        if (extendedOperator.resumeFile) previews.resumeFile = extendedOperator.resumeFile;
        if (extendedOperator.idCardFrontImage) previews.idCardFrontImage = extendedOperator.idCardFrontImage;
        if (extendedOperator.idCardBackImage) previews.idCardBackImage = extendedOperator.idCardBackImage;
        if (extendedOperator.healthCardFrontImage) previews.healthCardFrontImage = extendedOperator.healthCardFrontImage;
        if (extendedOperator.healthCardBackImage) previews.healthCardBackImage = extendedOperator.healthCardBackImage;
        if (extendedOperator.bustPhotoFile) previews.bustPhotoFile = extendedOperator.bustPhotoFile;
        if (extendedOperator.facePhotoFile) previews.facePhotoFile = extendedOperator.facePhotoFile;
        if (extendedOperator.fullBodyPhotoFile) previews.fullBodyPhotoFile = extendedOperator.fullBodyPhotoFile;
        
        setImagePreviewUrls(previews);
        
        if (extendedOperator.contractData) {
          setContractType(extendedOperator.contractData.contractType || "full-time");
          setCcnl(extendedOperator.contractData.ccnl || "pulizia-multiservizi");
          setLevel(extendedOperator.contractData.level || "");
          setEmploymentType(extendedOperator.contractData.employmentType || "indeterminato");
          
          if (extendedOperator.contractData.startDate) {
            setStartDate(new Date(extendedOperator.contractData.startDate));
          }
          
          if (extendedOperator.contractData.endDate) {
            setEndDate(new Date(extendedOperator.contractData.endDate));
          }
          
          setGrossSalary(extendedOperator.contractData.grossSalary || "");
          setNetSalary(extendedOperator.contractData.netSalary || "");
        }
      } catch (error) {
        console.error("Errore nel caricamento dell'operatore:", error);
        toast.error("Errore nel caricamento dell'operatore");
      } finally {
        setLoading(false);
      }
    };
    
    loadOperator();
  }, [operatorId, navigate]);

  return {
    operator,
    setOperator,
    loading,
    imagePreviewUrls,
    setImagePreviewUrls,
    contractType,
    setContractType,
    ccnl,
    setCcnl,
    level,
    setLevel,
    employmentType,
    setEmploymentType,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    grossSalary,
    setGrossSalary,
    netSalary,
    setNetSalary
  };
};


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, DollarSign } from "lucide-react";
import { ExtendedOperator, OPERATORS_STORAGE_KEY } from "@/types/operator";
import { fileToBase64 } from "@/utils/fileUtils";
import OperatorHeader from "@/components/operator/OperatorHeader";
import PersonalInfoTab from "@/components/operator/PersonalInfoTab";
import ContractTab from "@/components/operator/ContractTab";
import PayrollTab from "@/components/operator/PayrollTab";

const OperatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [operator, setOperator] = useState<ExtendedOperator | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("info");
  const [contractType, setContractType] = useState("full-time");
  
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
        const foundOperator = operators.find((op: any) => op.id.toString() === id);
        
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
      } catch (error) {
        console.error("Errore nel caricamento dell'operatore:", error);
        toast.error("Errore nel caricamento dell'operatore");
      } finally {
        setLoading(false);
      }
    };
    
    loadOperator();
  }, [id, navigate]);
  
  const handleChange = (field: keyof ExtendedOperator, value: any) => {
    if (!operator) return;
    
    setOperator({
      ...operator,
      [field]: value,
    });
  };
  
  const handleServiceToggle = (service: string) => {
    if (!operator) return;
    
    const updatedServices = [...(operator.service || [])];
    const index = updatedServices.indexOf(service as any);
    
    if (index >= 0) {
      updatedServices.splice(index, 1);
    } else {
      updatedServices.push(service as any);
    }
    
    handleChange("service", updatedServices);
  };
  
  const handleAvailabilityToggle = (availability: string) => {
    if (!operator) return;
    
    const updatedAvailability = [...(operator.availability || [])];
    const index = updatedAvailability.indexOf(availability as any);
    
    if (index >= 0) {
      updatedAvailability.splice(index, 1);
    } else {
      updatedAvailability.push(availability as any);
    }
    
    handleChange("availability", updatedAvailability);
  };
  
  const handleLanguageToggle = (language: string, type: 'fluent' | 'basic') => {
    if (!operator) return;
    
    const field = type === 'fluent' ? 'fluentLanguages' : 'basicLanguages';
    const currentLanguages = [...(operator[field] || [])];
    const index = currentLanguages.indexOf(language);
    
    if (index >= 0) {
      currentLanguages.splice(index, 1);
    } else {
      currentLanguages.push(language);
    }
    
    handleChange(field, currentLanguages);
  };
  
  const handleSizeToggle = (size: string) => {
    if (!operator) return;
    
    const updatedSizes = [...(operator.sizes || [])];
    const index = updatedSizes.indexOf(size);
    
    if (index >= 0) {
      updatedSizes.splice(index, 1);
    } else {
      updatedSizes.push(size);
    }
    
    handleChange("sizes", updatedSizes);
  };
  
  const handleFileUpload = async (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => {
    if (!operator) return;
    
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        
        setOperator({
          ...operator,
          [field]: base64,
          [fileNameField]: file.name,
        });
        
        setImagePreviewUrls(prev => ({
          ...prev,
          [field]: base64
        }));
        
        console.log(`File ${file.name} convertito in base64 e memorizzato`);
      } catch (error) {
        console.error(`Errore nella conversione del file ${file.name}:`, error);
        toast.error(`Errore nel caricamento del file ${file.name}`);
      }
    } else {
      setOperator({
        ...operator,
        [field]: null,
        [fileNameField]: "",
      });
      
      setImagePreviewUrls(prev => {
        const newPreviews = { ...prev };
        delete newPreviews[field as string];
        return newPreviews;
      });
    }
  };
  
  const handleSave = () => {
    if (!operator) return;
    
    try {
      const storedOperators = localStorage.getItem(OPERATORS_STORAGE_KEY);
      if (!storedOperators) {
        toast.error("Errore nel salvataggio dell'operatore");
        return;
      }
      
      const operators = JSON.parse(storedOperators);
      const updatedOperators = operators.map((op: any) => 
        op.id === operator.id ? operator : op
      );
      
      localStorage.setItem(OPERATORS_STORAGE_KEY, JSON.stringify(updatedOperators));
      toast.success("Profilo operatore aggiornato con successo");
      navigate("/operators");
    } catch (error) {
      console.error("Errore nel salvataggio dell'operatore:", error);
      toast.error("Errore nel salvataggio dell'operatore");
    }
  };

  const generateContract = () => {
    if (!operator) return;

    try {
      const contractDate = new Date().toLocaleDateString('it-IT');
      
      let contractTypeText = "";
      switch (contractType) {
        case "full-time":
          contractTypeText = "CONTRATTO DI LAVORO A TEMPO PIENO";
          break;
        case "part-time":
          contractTypeText = "CONTRATTO DI LAVORO PART-TIME";
          break;
        case "a-chiamata":
          contractTypeText = "CONTRATTO DI LAVORO A CHIAMATA";
          break;
      }
      
      const contractText = `
${contractTypeText}

Data: ${contractDate}

TRA

Azienda [Nome Azienda], con sede legale in [Indirizzo Azienda], P.IVA [P.IVA Azienda], in persona del legale rappresentante pro tempore, di seguito denominata "Datore di Lavoro"

E

${operator.name}, nato/a a ${operator.birthCountry} il ${operator.birthDate}, residente in ${operator.address}, ${operator.zipCode}, ${operator.residenceCity}, ${operator.province}, Codice Fiscale: ${operator.fiscalCode}, di seguito denominato/a "Lavoratore"

SI CONVIENE E SI STIPULA QUANTO SEGUE:

1. OGGETTO DEL CONTRATTO
Il Datore di Lavoro assume il Lavoratore con la qualifica di Operatore di Eventi.

2. MANSIONI
Le mansioni affidate al Lavoratore sono le seguenti: ${operator.service?.join(", ")}

3. DURATA DEL CONTRATTO
Il presente contratto ha durata [determinata/indeterminata] con decorrenza dal [Data Inizio].

4. LUOGO DI LAVORO
La sede di lavoro è presso [Sede di Lavoro], fatta salva la possibilità per il Datore di Lavoro di inviare il Lavoratore presso altre sedi.

5. ORARIO DI LAVORO
${contractType === "full-time" ? 
  "L'orario di lavoro è fissato in 40 ore settimanali, articolate su 5 giorni lavorativi." : 
  contractType === "part-time" ? 
  "L'orario di lavoro è fissato in 20 ore settimanali, articolate secondo il seguente schema: [Dettagli Orario]." :
  "Il lavoratore si impegna a prestare la propria attività lavorativa quando richiesto dal Datore di Lavoro, con preavviso minimo di 24 ore."}

6. RETRIBUZIONE
La retribuzione lorda mensile è stabilita in Euro [Importo] e sarà corrisposta in rate mensili posticipate.
Coordinate bancarie per l'accredito: ${operator.bankName}, IBAN: ${operator.iban}

7. PERIODO DI PROVA
Le parti convengono che il periodo di prova è fissato in [Durata Periodo di Prova].

8. FERIE E PERMESSI
Il Lavoratore ha diritto a [Numero Giorni] giorni di ferie annuali retribuite.

9. RISOLUZIONE DEL CONTRATTO
Il presente contratto potrà essere risolto nei modi e nei casi previsti dalla legge e dal CCNL applicabile.

10. RINVIO
Per quanto non espressamente previsto dal presente contratto, si fa riferimento alle norme di legge e al CCNL applicabile.

Letto, confermato e sottoscritto.

[Luogo e Data]

Il Datore di Lavoro                                   Il Lavoratore
___________________                                   ___________________
`;

      const blob = new Blob([contractText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `Contratto_${operator.name.replace(/\s+/g, '_')}_${contractType}.txt`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success("Contratto generato con successo");
    } catch (error) {
      console.error("Errore nella generazione del contratto:", error);
      toast.error("Errore nella generazione del contratto");
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
  
  if (!operator) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">Operatore non trovato</div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="space-y-6">
        <OperatorHeader 
          operator={operator} 
          onRatingChange={(value) => handleChange("rating", value)}
          onSave={handleSave}
        />
        
        <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="info" className="text-base py-3">
              <User className="mr-2 h-4 w-4" />
              Info Operatore
            </TabsTrigger>
            <TabsTrigger value="contract" className="text-base py-3">
              <FileText className="mr-2 h-4 w-4" />
              Contrattualistica
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-base py-3">
              <DollarSign className="mr-2 h-4 w-4" />
              Payroll
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-6 mt-6">
            <PersonalInfoTab
              operator={operator}
              imagePreviewUrls={imagePreviewUrls}
              onFieldChange={handleChange}
              onServiceToggle={handleServiceToggle}
              onAvailabilityToggle={handleAvailabilityToggle}
              onLanguageToggle={handleLanguageToggle}
              onSizeToggle={handleSizeToggle}
              onFileUpload={handleFileUpload}
            />
          </TabsContent>
          
          <TabsContent value="contract" className="space-y-6 mt-6">
            <ContractTab
              operator={operator}
              contractType={contractType}
              onContractTypeChange={setContractType}
              onGenerateContract={generateContract}
            />
          </TabsContent>

          <TabsContent value="payroll" className="space-y-6 mt-6">
            <PayrollTab operator={operator} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default OperatorProfile;

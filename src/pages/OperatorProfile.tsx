import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Upload, 
  User, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Star, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Euro 
} from "lucide-react";

// Modifichiamo l'interfaccia per usare stringhe per le immagini invece di File
interface ExtendedOperator {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  assignedEvents?: number[];
  
  // Global evaluation
  rating: number;
  
  // Personal data
  birthDate: string;
  birthCountry: string;
  nationality: "italiana" | "straniera";
  gender: "uomo" | "donna";
  city: string;
  fiscalCode: string;
  vatNumber?: string;
  address: string;
  zipCode: string;
  province: string;
  residenceCity: string;
  
  // Info
  service: ("hostess" | "steward" | "porterage" | "security" | "driver")[];
  occupation: "part-time" | "full-time" | "studente" | "disoccupato";
  availability: ("tutto-il-giorno" | "su-chiamata" | "mattina" | "pomeriggio" | "sera" | "notte")[];
  drivingLicense: boolean;
  hasVehicle: boolean;
  resumeFile?: string | null;
  resumeFileName?: string;
  
  // Languages
  fluentLanguages: string[];
  basicLanguages: string[];
  
  // Physical characteristics
  height: number;
  weight: number;
  bodyType: "snella" | "atletica" | "robusta";
  eyeColor: string;
  hairColor: "neri" | "castani" | "biondi" | "rossi" | "grigi/bianchi" | "tinti";
  hairLength: string;
  sizes: string[];
  shoeSize: number;
  chestSize: number;
  waistSize: number;
  hipsSize: number;
  visibleTattoos: boolean;
  
  // ID documents
  idCardNumber: string;
  residencePermitNumber?: string;
  idCardFrontImage?: string | null;
  idCardFrontFileName?: string;
  idCardBackImage?: string | null;
  idCardBackFileName?: string;
  healthCardFrontImage?: string | null;
  healthCardFrontFileName?: string;
  healthCardBackImage?: string | null;
  healthCardBackFileName?: string;
  
  // Profile photos
  bustPhotoFile?: string | null;
  bustPhotoFileName?: string;
  facePhotoFile?: string | null;
  facePhotoFileName?: string;
  fullBodyPhotoFile?: string | null;
  fullBodyPhotoFileName?: string;
  
  // Banking info
  iban: string;
  bic: string;
  accountHolder: string;
  bankName: string;
  swiftCode?: string;
  accountNumber: string;
  
  // Social profiles
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
}

// Values for multi-select fields
const SERVICES = [
  { value: "hostess", label: "Hostess" },
  { value: "steward", label: "Steward" },
  { value: "porterage", label: "Porterage" },
  { value: "security", label: "Security" },
  { value: "driver", label: "Driver" },
];

const AVAILABILITY = [
  { value: "tutto-il-giorno", label: "Tutto il giorno" },
  { value: "su-chiamata", label: "Su chiamata" },
  { value: "mattina", label: "Mattina" },
  { value: "pomeriggio", label: "Pomeriggio" },
  { value: "sera", label: "Sera" },
  { value: "notte", label: "Notte" },
];

const LANGUAGES = [
  "Italiano", "Inglese", "Francese", "Tedesco", "Spagnolo", "Portoghese", 
  "Arabo", "Turco", "Russo", "Cinese", "Giapponese", "Coreano", "Hindi"
];

const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL", 
  "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", 
  "52", "54", "56", "58", "60"
];

const HAIR_COLORS = [
  { value: "neri", label: "Neri" },
  { value: "castani", label: "Castani" },
  { value: "biondi", label: "Biondi" },
  { value: "rossi", label: "Rossi" },
  { value: "grigi/bianchi", label: "Grigi/Bianchi" },
  { value: "tinti", label: "Tinti" },
];

const BODY_TYPES = [
  { value: "snella", label: "Snella" },
  { value: "atletica", label: "Atletica" },
  { value: "robusta", label: "Robusta" },
];

// Storage keys
const OPERATORS_STORAGE_KEY = "app_operators_data";

const OperatorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [operator, setOperator] = useState<ExtendedOperator | null>(null);
  const [loading, setLoading] = useState(true);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<Record<string, string>>({});
  
  // Load operator data
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
        
        // Initialize all fields with default values if they don't exist
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
        
        // Populate preview URLs from stored base64 data
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
  
  // Funzione per convertire un file in base64 URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleFileUpload = async (field: keyof ExtendedOperator, fileNameField: keyof ExtendedOperator, file: File | null) => {
    if (!operator) return;
    
    if (file) {
      try {
        // Convertire il file in base64
        const base64 = await fileToBase64(file);
        
        // Aggiornare lo stato con il base64 e il nome del file
        setOperator({
          ...operator,
          [field]: base64,
          [fileNameField]: file.name,
        });
        
        // Aggiornare anche il preview
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
      // Se file è null, rimuovere l'immagine
      setOperator({
        ...operator,
        [field]: null,
        [fileNameField]: "",
      });
      
      // Rimuovere anche il preview
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
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/operators")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Torna alla lista
          </Button>
          <Button onClick={handleSave}>Salva modifiche</Button>
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
                    onValueChange={(value) => handleChange("rating", value[0])}
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
        
        {/* DATI ANAGRAFICI */}
        <Card>
          <CardHeader>
            <CardTitle>Dati Anagrafici</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Data di nascita</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={operator.birthDate}
                  onChange={(e) => handleChange("birthDate", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthCountry">Paese di nascita</Label>
                <Input
                  id="birthCountry"
                  value={operator.birthCountry}
                  onChange={(e) => handleChange("birthCountry", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationality">Nazionalità</Label>
                <Select
                  value={operator.nationality}
                  onValueChange={(value) => handleChange("nationality", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona nazionalità" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italiana">Italiana</SelectItem>
                    <SelectItem value="straniera">Straniera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Sesso</Label>
                <Select
                  value={operator.gender}
                  onValueChange={(value) => handleChange("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona sesso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uomo">Uomo</SelectItem>
                    <SelectItem value="donna">Donna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">In che città abiti</Label>
                <Input
                  id="city"
                  value={operator.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fiscalCode">Codice Fiscale</Label>
                <Input
                  id="fiscalCode"
                  value={operator.fiscalCode}
                  onChange={(e) => handleChange("fiscalCode", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vatNumber">Numero P.IVA (se in possesso)</Label>
                <Input
                  id="vatNumber"
                  value={operator.vatNumber}
                  onChange={(e) => handleChange("vatNumber", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo di residenza</Label>
                <Input
                  id="address"
                  value={operator.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">CAP residenza</Label>
                <Input
                  id="zipCode"
                  maxLength={5}
                  value={operator.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="province">Provincia di residenza</Label>
                <Input
                  id="province"
                  value={operator.province}
                  onChange={(e) => handleChange("province", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="residenceCity">Città di residenza</Label>
                <Input
                  id="residenceCity"
                  value={operator.residenceCity}
                  onChange={(e) => handleChange("residenceCity", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* INFO */}
        <Card>
          <CardHeader>
            <CardTitle>Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Quale servizio vuoi svolgere?</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {SERVICES.map((service) => (
                  <div key={service.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`service-${service.value}`} 
                      checked={operator.service?.includes(service.value as any)}
                      onCheckedChange={() => handleServiceToggle(service.value)}
                    />
                    <Label 
                      htmlFor={`service-${service.value}`}
                      className="text-sm font-normal"
                    >
                      {service.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupazione</Label>
              <Select
                value={operator.occupation}
                onValueChange={(value) => handleChange("occupation", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona occupazione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="part-time">Lavoro part-time</SelectItem>
                  <SelectItem value="full-time">Lavoro full-time</SelectItem>
                  <SelectItem value="studente">Studente</SelectItem>
                  <SelectItem value="disoccupato">Disoccupato</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label>Disponibilità</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {AVAILABILITY.map((item) => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`availability-${item.value}`} 
                      checked={operator.availability?.includes(item.value as any)}
                      onCheckedChange={() => handleAvailabilityToggle(item.value)}
                    />
                    <Label 
                      htmlFor={`availability-${item.value}`}
                      className="text-sm font-normal"
                    >
                      {item.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="drivingLicense"
                  checked={operator.drivingLicense}
                  onCheckedChange={(checked) => 
                    handleChange("drivingLicense", checked === true)
                  }
                />
                <Label htmlFor="drivingLicense">Patente B?</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasVehicle"
                  checked={operator.hasVehicle}
                  onCheckedChange={(checked) => 
                    handleChange("hasVehicle", checked === true)
                  }
                />
                <Label htmlFor="hasVehicle">Automunito?</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resumeFile">Carica il tuo Curriculum</Label>
              <Input
                id="resumeFile"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  if (file) {
                    handleFileUpload("resumeFile", "resumeFileName", file);
                  }
                }}
              />
              {operator.resumeFileName && (
                <div className="text-sm text-muted-foreground mt-1">
                  File selezionato: {operator.resumeFileName}
                </div>
              )}
              {imagePreviewUrls.resumeFile && operator.resumeFile?.startsWith('data:application/pdf') && (
                <div className="mt-2">
                  <a 
                    href={imagePreviewUrls.resumeFile} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Visualizza PDF
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* LINGUE */}
        <Card>
          <CardHeader>
            <CardTitle>Lingue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Lingue parlate fluentemente</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {LANGUAGES.map((language) => (
                  <div key={`fluent-${language}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`fluent-${language}`} 
                      checked={operator.fluentLanguages?.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language, 'fluent')}
                    />
                    <Label 
                      htmlFor={`fluent-${language}`}
                      className="text-sm font-normal"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Lingue parlate a livello scolastico/base</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {LANGUAGES.map((language) => (
                  <div key={`basic-${language}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`basic-${language}`} 
                      checked={operator.basicLanguages?.includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language, 'basic')}
                    />
                    <Label 
                      htmlFor={`basic-${language}`}
                      className="text-sm font-normal"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* CARATTERISTICHE FISICHE */}
        <Card>
          <CardHeader>
            <CardTitle>Caratteristiche Fisiche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Altezza (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={operator.height}
                  onChange={(e) => handleChange("height", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={operator.weight}
                  onChange={(e) => handleChange("weight", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bodyType">Corporatura</Label>
                <Select
                  value={operator.bodyType}
                  onValueChange={(value) => handleChange("bodyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona corporatura" />
                  </SelectTrigger>
                  <SelectContent>
                    {BODY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eyeColor">Colore occhi</Label>
                <Input
                  id="eyeColor"
                  value={operator.eyeColor}
                  onChange={(e) => handleChange("eyeColor", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hairColor">Colore capelli</Label>
                <Select
                  value={operator.hairColor}
                  onValueChange={(value) => handleChange("hairColor", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona colore capelli" />
                  </SelectTrigger>
                  <SelectContent>
                    {HAIR_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hairLength">Lunghezza capelli</Label>
                <Input
                  id="hairLength"
                  value={operator.hairLength}
                  onChange={(e) => handleChange("hairLength", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Le tue taglie</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 gap-2">
                {SIZES.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size}`} 
                      checked={operator.sizes?.includes(size)}
                      onCheckedChange={() => handleSizeToggle(size)}
                    />
                    <Label 
                      htmlFor={`size-${size}`}
                      className="text-sm font-normal"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shoeSize">Numero di scarpe</Label>
                <Input
                  id="shoeSize"
                  type="number"
                  value={operator.shoeSize}
                  onChange={(e) => handleChange("shoeSize", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="chestSize">Misura giro torace (cm)</Label>
                <Input
                  id="chestSize"
                  type="number"
                  value={operator.chestSize}
                  onChange={(e) => handleChange("chestSize", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="waistSize">Misura giro vita (cm)</Label>
                <Input
                  id="waistSize"
                  type="number"
                  value={operator.waistSize}
                  onChange={(e) => handleChange("waistSize", parseInt(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hipsSize">Misura giro fianchi (cm)</Label>
                <Input
                  id="hipsSize"
                  type="number"
                  value={operator.hipsSize}
                  onChange={(e) => handleChange("hipsSize", parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="visibleTattoos"
                checked={operator.visibleTattoos}
                onCheckedChange={(checked) => 
                  handleChange("visibleTattoos", checked === true)
                }
              />
              <Label htmlFor="visibleTattoos">
                Presenza di tatuaggi in parti visibili (mani, viso, avambracci)
              </Label>
            </div>
          </CardContent>
        </Card>
        
        {/* DOCUMENTI D'IDENTITÀ */}
        <Card>
          <CardHeader>
            <CardTitle>Documenti d'Identità</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idCardNumber">Numero Carta d'identità</Label>
                <Input
                  id="idCardNumber"
                  value={operator.idCardNumber}
                  onChange={(e) => handleChange("idCardNumber", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="residencePermitNumber">Numero permesso di soggiorno</Label>
                <Input
                  id="residencePermitNumber"
                  value={operator.residencePermitNumber}
                  onChange={(e) => handleChange("residencePermitNumber", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idCardFrontImage">Foto carta identità fronte</Label>
                <Input
                  id="idCardFrontImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("idCardFrontImage", "idCardFrontFileName", file);
                    }
                  }}
                />
                {operator.idCardFrontFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.idCardFrontFileName}
                  </div>
                )}
                {imagePreviewUrls.idCardFrontImage && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.idCardFrontImage} 
                      alt="Anteprima carta d'identità fronte" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="idCardBackImage">Foto carta identità retro</Label>
                <Input
                  id="idCardBackImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("idCardBackImage", "idCardBackFileName", file);
                    }
                  }}
                />
                {operator.idCardBackFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.idCardBackFileName}
                  </div>
                )}
                {imagePreviewUrls.idCardBackImage && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.idCardBackImage} 
                      alt="Anteprima carta d'identità retro" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="healthCardFrontImage">Carica Tessera Sanitaria (fronte)</Label>
                <Input
                  id="healthCardFrontImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("healthCardFrontImage", "healthCardFrontFileName", file);
                    }
                  }}
                />
                {operator.healthCardFrontFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.healthCardFrontFileName}
                  </div>
                )}
                {imagePreviewUrls.healthCardFrontImage && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.healthCardFrontImage} 
                      alt="Anteprima tessera sanitaria fronte" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="healthCardBackImage">Carica Tessera Sanitaria (retro)</Label>
                <Input
                  id="healthCardBackImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("healthCardBackImage", "healthCardBackFileName", file);
                    }
                  }}
                />
                {operator.healthCardBackFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.healthCardBackFileName}
                  </div>
                )}
                {imagePreviewUrls.healthCardBackImage && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.healthCardBackImage} 
                      alt="Anteprima tessera sanitaria retro" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* FOTO PROFILO */}
        <Card>
          <CardHeader>
            <CardTitle>Foto Profilo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bustPhotoFile">Foto mezzo busto</Label>
                <Input
                  id="bustPhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("bustPhotoFile", "bustPhotoFileName", file);
                    }
                  }}
                />
                {operator.bustPhotoFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.bustPhotoFileName}
                  </div>
                )}
                {imagePreviewUrls.bustPhotoFile && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.bustPhotoFile} 
                      alt="Anteprima foto mezzo busto" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facePhotoFile">Foto primo piano</Label>
                <Input
                  id="facePhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("facePhotoFile", "facePhotoFileName", file);
                    }
                  }}
                />
                {operator.facePhotoFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.facePhotoFileName}
                  </div>
                )}
                {imagePreviewUrls.facePhotoFile && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.facePhotoFile} 
                      alt="Anteprima foto primo piano" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullBodyPhotoFile">Foto figura intera</Label>
                <Input
                  id="fullBodyPhotoFile"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      handleFileUpload("fullBodyPhotoFile", "fullBodyPhotoFileName", file);
                    }
                  }}
                />
                {operator.fullBodyPhotoFileName && (
                  <div className="text-sm text-muted-foreground mt-1">
                    File selezionato: {operator.fullBodyPhotoFileName}
                  </div>
                )}
                {imagePreviewUrls.fullBodyPhotoFile && (
                  <div className="mt-2">
                    <img 
                      src={imagePreviewUrls.fullBodyPhotoFile} 
                      alt="Anteprima foto figura intera" 
                      className="max-h-40 border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* INFO BANCARIE */}
        <Card>
          <CardHeader>
            <CardTitle>Info Bancarie</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={operator.iban}
                onChange={(e) => handleChange("iban", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                value={operator.bic}
                onChange={(e) => handleChange("bic", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Intestatario conto</Label>
              <Input
                id="accountHolder"
                value={operator.accountHolder}
                onChange={(e) => handleChange("accountHolder", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bankName">Banca</Label>
              <Input
                id="bankName"
                value={operator.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="swiftCode">Codice SWIFT (se conto straniero)</Label>
              <Input
                id="swiftCode"
                value={operator.swiftCode}
                onChange={(e) => handleChange("swiftCode", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Numero conto</Label>
              <Input
                id="accountNumber"
                value={operator.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* PROFILI SOCIAL */}
        <Card>
          <CardHeader>
            <CardTitle>I Tuoi Profili Social</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <Instagram className="h-4 w-4" />
                </span>
                <Input
                  id="instagram"
                  className="rounded-l-none"
                  value={operator.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <Facebook className="h-4 w-4" />
                </span>
                <Input
                  id="facebook"
                  className="rounded-l-none"
                  value={operator.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <span className="font-bold text-xs">TT</span>
                </span>
                <Input
                  id="tiktok"
                  className="rounded-l-none"
                  value={operator.tiktok}
                  onChange={(e) => handleChange("tiktok", e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                  <Linkedin className="h-4 w-4" />
                </span>
                <Input
                  id="linkedin"
                  className="rounded-l-none"
                  value={operator.linkedin}
                  onChange={(e) => handleChange("linkedin", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4 my-6">
          <Button variant="outline" onClick={() => navigate("/operators")}>
            Annulla
          </Button>
          <Button onClick={handleSave}>
            Salva modifiche
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OperatorProfile;

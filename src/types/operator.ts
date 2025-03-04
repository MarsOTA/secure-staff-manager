// Shared operator types
export interface ExtendedOperator {
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
  
  // Contract data
  contractData?: {
    contractType: string;
    ccnl: string;
    level: string;
    employmentType: string;
    startDate: string | null;
    endDate: string | null;
    grossSalary: string;
    netSalary: string;
  };
}

// Constants for multi-select fields
export const SERVICES = [
  { value: "hostess", label: "Hostess" },
  { value: "steward", label: "Steward" },
  { value: "porterage", label: "Porterage" },
  { value: "security", label: "Security" },
  { value: "driver", label: "Driver" },
];

export const AVAILABILITY = [
  { value: "tutto-il-giorno", label: "Tutto il giorno" },
  { value: "su-chiamata", label: "Su chiamata" },
  { value: "mattina", label: "Mattina" },
  { value: "pomeriggio", label: "Pomeriggio" },
  { value: "sera", label: "Sera" },
  { value: "notte", label: "Notte" },
];

export const LANGUAGES = [
  "Italiano", "Inglese", "Francese", "Tedesco", "Spagnolo", "Portoghese", 
  "Arabo", "Turco", "Russo", "Cinese", "Giapponese", "Coreano", "Hindi"
];

export const SIZES = [
  "XS", "S", "M", "L", "XL", "XXL", 
  "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50", 
  "52", "54", "56", "58", "60"
];

export const HAIR_COLORS = [
  { value: "neri", label: "Neri" },
  { value: "castani", label: "Castani" },
  { value: "biondi", label: "Biondi" },
  { value: "rossi", label: "Rossi" },
  { value: "grigi/bianchi", label: "Grigi/Bianchi" },
  { value: "tinti", label: "Tinti" },
];

export const BODY_TYPES = [
  { value: "snella", label: "Snella" },
  { value: "atletica", label: "Atletica" },
  { value: "robusta", label: "Robusta" },
];

export const CONTRACT_TYPES = [
  { value: "full-time", label: "Contratto Full Time" },
  { value: "part-time", label: "Contratto Part Time" },
  { value: "a-chiamata", label: "Contratto a Chiamata" },
];

// Storage key
export const OPERATORS_STORAGE_KEY = "app_operators_data";

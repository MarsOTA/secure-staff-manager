
import { Operator, OPERATORS_STORAGE_KEY } from "@/hooks/useOperators";

// Define the missing constants
export const CONTRACT_TYPES = [
  { value: "full-time", label: "Full-Time" },
  { value: "part-time", label: "Part-Time" },
  { value: "intermittente", label: "Intermittente" },
  { value: "tempo-determinato", label: "Tempo Determinato" },
  { value: "progetto", label: "A Progetto" },
  { value: "freelance", label: "Freelance" },
];

export const SERVICES = [
  "hostess/steward",
  "security",
  "doorman",
  "promoter",
  "receptionist",
  "interprete",
  "tour-guide",
  "mascot",
  "model",
  "catering",
];

export const AVAILABILITY = [
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
  "domenica",
  "festivi",
  "mattina",
  "pomeriggio",
  "sera",
  "notte",
];

export const LANGUAGES = [
  "italiano",
  "inglese",
  "francese",
  "spagnolo",
  "tedesco",
  "russo",
  "cinese",
  "arabo",
  "giapponese",
  "portoghese",
];

export const SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
];

export const HAIR_COLORS = [
  "neri",
  "castani",
  "biondi",
  "rossi",
  "grigi",
  "bianchi",
  "colorati",
];

export const BODY_TYPES = [
  "atletica",
  "normale",
  "plus-size",
];

// Extend the base Operator type for the OperatorProfile page
export interface ExtendedOperator extends Operator {
  rating?: number;
  birthDate?: string;
  birthCountry?: string;
  nationality?: string;
  gender?: string;
  city?: string;
  fiscalCode?: string;
  vatNumber?: string;
  address?: string;
  zipCode?: string;
  province?: string;
  residenceCity?: string;
  service?: string[];
  occupation?: string;
  availability?: string[];
  drivingLicense?: boolean;
  hasVehicle?: boolean;
  fluentLanguages?: string[];
  basicLanguages?: string[];
  height?: number;
  weight?: number;
  bodyType?: string;
  eyeColor?: string;
  hairColor?: string;
  hairLength?: string;
  sizes?: string[];
  shoeSize?: number;
  chestSize?: number;
  waistSize?: number;
  hipsSize?: number;
  visibleTattoos?: boolean;
  idCardNumber?: string;
  residencePermitNumber?: string;
  iban?: string;
  bic?: string;
  accountHolder?: string;
  bankName?: string;
  swiftCode?: string;
  accountNumber?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  linkedin?: string;
  resumeFile?: string | null;
  resumeFileName?: string;
  idCardFrontImage?: string | null;
  idCardFrontFileName?: string;
  idCardBackImage?: string | null;
  idCardBackFileName?: string;
  healthCardFrontImage?: string | null;
  healthCardFrontFileName?: string;
  healthCardBackImage?: string | null;
  healthCardBackFileName?: string;
  bustPhotoFile?: string | null;
  bustPhotoFileName?: string;
  facePhotoFile?: string | null;
  facePhotoFileName?: string;
  fullBodyPhotoFile?: string | null;
  fullBodyPhotoFileName?: string;
  contractData?: {
    contractType?: string;
    ccnl?: string;
    level?: string;
    employmentType?: string;
    startDate?: string | null;
    endDate?: string | null;
    grossSalary?: string;
    netSalary?: string;
  };
}

// Re-export the constant for backward compatibility
export { OPERATORS_STORAGE_KEY };

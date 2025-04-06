
import { Operator, OPERATORS_STORAGE_KEY } from "@/hooks/useOperators";

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

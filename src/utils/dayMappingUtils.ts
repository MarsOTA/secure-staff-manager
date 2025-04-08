
// Day mapping utilities

// Interface for place prediction from Google Places API
export interface PlacePrediction {
  description: string;
  place_id: string;
}

// Map of day names to their numeric representation (0-6, where 0 is Sunday)
export const dayMapping: Record<string, number> = {
  domenica: 0,
  lunedi: 1,
  martedi: 2,
  mercoledi: 3,
  giovedi: 4,
  venerdi: 5,
  sabato: 6,
  tutti: -1 // Valore speciale per "tutti i giorni"
};

// Map of day codes to display names
export const dayLabels: Record<string, string> = {
  domenica: "Domenica",
  lunedi: "Lunedì",
  martedi: "Martedì",
  mercoledi: "Mercoledì",
  giovedi: "Giovedì",
  venerdi: "Venerdì",
  sabato: "Sabato",
  "lunedi-venerdi": "Lunedì - Venerdì",
  "sabato-domenica": "Sabato - Domenica",
  tutti: "Tutti i giorni"
};

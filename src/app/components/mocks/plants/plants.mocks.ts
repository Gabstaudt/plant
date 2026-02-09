export type PlantStatus = "ONLINE" | "ATTENTION" | "OFFLINE";

export type PlantCardDto = {
  id: string;
  name: string;
  species: string;
  locationLabel: string; // "Estufa A · Setor 1"
  sensorsCount: number;
  status: PlantStatus;
  metrics: {
    humidity: number; // %
    temp: number;     // °C
    light: number;    // %
  };
  lastReading: string; // "15/01/2026, 14:39:15"
};

export const samplePlants: PlantCardDto[] = [
  {
    id: "1",
    name: "Tomates A1",
    species: "Solanum lycopersicum",
    locationLabel: "Estufa A · Setor 1",
    sensorsCount: 4,
    status: "OFFLINE",
    metrics: { humidity: 65, temp: 24, light: 78 },
    lastReading: "15/01/2026, 14:39:15",
  },
  {
    id: "2",
    name: "Tomates A1",
    species: "Solanum lycopersicum",
    locationLabel: "Estufa A · Setor 1",
    sensorsCount: 4,
    status: "ATTENTION",
    metrics: { humidity: 65, temp: 24, light: 78 },
    lastReading: "15/01/2026, 14:39:15",
  },
  {
    id: "3",
    name: "Tomates A1",
    species: "Solanum lycopersicum",
    locationLabel: "Estufa A · Setor 1",
    sensorsCount: 4,
    status: "ONLINE",
    metrics: { humidity: 65, temp: 24, light: 78 },
    lastReading: "15/01/2026, 14:39:15",
  },
  {
    id: "4",
    name: "Tomates A1",
    species: "Solanum lycopersicum",
    locationLabel: "Estufa A · Setor 1",
    sensorsCount: 4,
    status: "ATTENTION",
    metrics: { humidity: 65, temp: 24, light: 78 },
    lastReading: "15/01/2026, 14:39:15",
  },
];

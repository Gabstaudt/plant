import { api } from "@/app/lib/http";

export type PlantStatus = "ONLINE" | "OFFLINE" | "EM ALERTA";

export type PlantStatusResponse = {
  id: number;
  plantName: string;
  species: string;
  location: string;
  notes?: string;
  tempUnit?: string;
  tempMax?: number;
  tempMin?: number;
  umiUnit?: string;
  umiMax?: number;
  umiMin?: number;
  lightUnit?: string;
  lightMax?: number;
  lightMin?: number;
  phUnit?: string;
  phMax?: number;
  phMin?: number;
  notesConditions?: string;
  status: PlantStatus;
  alertMessages?: string[];
  sensorsCount?: number;
  umiCurrent?: number;
  phCurrent?: number;
  tempCurrent?: number;
  lightCurrrent?: number;
  idealRanges?: Array<{
    type: string;
    unit: string;
    min?: number;
    max?: number;
  }>;
};

export type PlantsListResponse = {
  data: PlantStatusResponse[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

export type CreatePlantPayload = {
  plantName: string;
  species: string;
  location: string;
  notes?: string;
  notesConditions?: string;
  tempUnit?: string;
  tempMax?: number;
  tempMin?: number;
  umiUnit?: string;
  umiMax?: number;
  umiMin?: number;
  lightUnit?: string;
  lightMax?: number;
  lightMin?: number;
  phUnit?: string;
  phMax?: number;
  phMin?: number;
  idealRanges?: Array<{
    type: string;
    unit: string;
    min?: number;
    max?: number;
  }>;
};

export type UpdatePlantPayload = Partial<CreatePlantPayload>;

export type PlantCardView = {
  id: string;
  name: string;
  species: string;
  locationLabel: string;
  sensorsCount: number;
  status: PlantStatus;
  metrics: {
    humidity: number | null;
    temp: number | null;
    light: number | null;
  };
  lastReading?: string;
};

export type PlantOptionsResponse = {
  species: string[];
  locations: string[];
  types: string[];
  units: string[];
};

const SPECIES_LABELS: Record<string, string> = {
  "solanum-lycopersicum": "Tomate (Solanum lycopersicum)",
  vinca: "Vinca",
  "rosa-do-deserto": "Rosa-do-deserto",
  rosas: "Rosas",
  orquidea: "Orquídea",
};

const LOCATION_LABELS: Record<string, string> = {
  "estufa-a-setor-1": "Estufa A - Setor 1",
  "estufa-a-setor-2": "Estufa A - Setor 2",
  "estufa-b-setor-1": "Estufa B - Setor 1",
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function formatSpecies(value: string) {
  const key = normalizeKey(value);
  return SPECIES_LABELS[key] ?? value;
}

export function formatLocation(value: string) {
  const key = normalizeKey(value);
  return LOCATION_LABELS[key] ?? value;
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function mapPlantToCard(plant: PlantStatusResponse): PlantCardView {
  return {
    id: String(plant.id),
    name: plant.plantName,
    species: formatSpecies(plant.species),
    locationLabel: formatLocation(plant.location),
    sensorsCount: plant.sensorsCount ?? 0,
    status: plant.status,
    metrics: {
      humidity: toNumberOrNull(plant.umiCurrent),
      temp: toNumberOrNull(plant.tempCurrent),
      light: toNumberOrNull(plant.lightCurrrent),
    },
    lastReading: undefined,
  };
}

export async function listPlants(limit = 500) {
  return api<PlantsListResponse>(
    `/plants?limit=${limit}&page=1&orderBy=asc`
  );
}

export async function listPlantOptions() {
  return api<PlantOptionsResponse>("/plants/options");
}

export async function getPlant(id: string | number) {
  return api<PlantStatusResponse>(`/plants/${id}`);
}

export async function createPlant(payload: CreatePlantPayload) {
  return api<PlantStatusResponse>("/plants/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updatePlant(
  id: string | number,
  payload: UpdatePlantPayload
) {
  return api<PlantStatusResponse>(`/plants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deletePlant(id: string | number) {
  return api<void>(`/plants/${id}`, {
    method: "DELETE",
  });
}

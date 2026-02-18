import { api } from "@/app/lib/http";

export type SensorStatus = "ONLINE" | "ATENCAO" | "OFFLINE";
export type SensorType = "TEMPERATURA" | "UMIDADE" | "LUMINOSIDADE" | "PH";

export type SensorStatusResponse = {
  id: number;
  sensorName: string;
  hardwareId: string;
  type: string;
  location: string;
  unit: string;
  status: "OFFLINE" | "EM ALERTA" | "ONLINE";
  statusReading?: string;
  alertMessages?: string[];
  lastReading?: number;
  notes?: string;
  plantName?: string;
  plantId?: number;
  updateAt?: string | Date;
};

export type SensorsListResponse = {
  data: SensorStatusResponse[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
};

export type CreateSensorPayload = {
  sensorName: string;
  hardwareId: string;
  type: string;
  location: string;
  unit: string;
  alertsEnabled: boolean;
  plantId?: number;
  readingIntervalSeconds?: number;
  notes?: string;
};

export type SensorCardView = {
  id: string;
  code: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  lastValue: number;
  unit: string;
  locationLabel: string;
  plantName?: string;
  plantId?: string;
  updatedAt: string;
};

function mapApiStatus(status: SensorStatusResponse["status"]): SensorStatus {
  if (status === "EM ALERTA") return "ATENCAO";
  return status;
}

export function mapApiType(type: string): SensorType {
  const key = type.trim().toUpperCase();
  if (key === "TEMPERATURE") return "TEMPERATURA";
  if (key === "HUMIDITY") return "UMIDADE";
  if (key === "LIGHT") return "LUMINOSIDADE";
  if (key === "PH") return "PH";
  return "TEMPERATURA";
}

export function mapUiTypeToApi(type: SensorType): string {
  if (type === "TEMPERATURA") return "TEMPERATURE";
  if (type === "UMIDADE") return "HUMIDITY";
  if (type === "LUMINOSIDADE") return "LIGHT";
  return "PH";
}

export function defaultUnitForType(type: SensorType): string {
  if (type === "TEMPERATURA") return "°C";
  if (type === "UMIDADE") return "%";
  if (type === "LUMINOSIDADE") return "%";
  return "pH";
}

function formatDateTime(value?: string | Date) {
  if (!value) return "—";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "—";
  return dt.toLocaleString("pt-BR");
}

export function mapSensorToCard(sensor: SensorStatusResponse): SensorCardView {
  return {
    id: String(sensor.id),
    code: sensor.hardwareId,
    name: sensor.sensorName,
    type: mapApiType(sensor.type),
    status: mapApiStatus(sensor.status),
    lastValue: Number.isFinite(Number(sensor.lastReading))
      ? Number(sensor.lastReading)
      : 0,
    unit: sensor.unit,
    locationLabel: sensor.location,
    plantName: sensor.plantName,
    plantId: sensor.plantId ? String(sensor.plantId) : undefined,
    updatedAt: formatDateTime(sensor.updateAt),
  };
}

export async function listSensors(limit = 500) {
  return api<SensorsListResponse>(`/sensors?limit=${limit}&page=1&orderBy=asc`);
}

export async function createSensor(payload: CreateSensorPayload) {
  return api<SensorStatusResponse>("/sensors/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

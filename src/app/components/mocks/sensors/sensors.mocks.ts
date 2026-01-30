export type SensorStatus = "ONLINE" | "ATENCAO" | "OFFLINE";

export type SensorType = "TEMPERATURA" | "UMIDADE" | "LUMINOSIDADE" | "PH";

/* ✅ ADICIONADO: DTO da listagem (cards) */
export type SensorCardDto = {
  id: string;
  code: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  lastValue: number;
  unit: string;
  locationLabel: string; // ✅
  plantName?: string;
  plantId?: string;
  updatedAt: string;
};


/* ✅ ADICIONADO: mocks da listagem */
export const sampleSensors: SensorCardDto[] = [
  {
    id: "th-001",
    code: "TH-001",
    name: "Sensor Temperatura A1",
    type: "TEMPERATURA",
    status: "ONLINE",
    lastValue: 24.6,
    unit: "°C",
    locationLabel: "Estufa A - Setor 1",
    plantName: "Tomates A1",
    plantId: "tomates-a1",
    updatedAt: "19/01/2026, 15:15:49",
  },
  {
    id: "um-014",
    code: "UM-014",
    name: "Sensor Umidade A1",
    type: "UMIDADE",
    status: "ATENCAO",
    lastValue: 45,
    unit: "%",
    locationLabel: "Estufa A - Setor 1",
    plantName: "Tomates A1",
    plantId: "tomates-a1",
    updatedAt: "19/01/2026, 15:12:10",
  },
  {
    id: "lz-003",
    code: "LZ-003",
    name: "Sensor Luz B1",
    type: "LUMINOSIDADE",
    status: "OFFLINE",
    lastValue: 0,
    unit: "%",
    locationLabel: "Estufa B - Setor 3",
    updatedAt: "—",
  },
];


export type SensorDetailsDto = {
  id: string;
  code: string;
  name: string;
  type: SensorType;
  status: SensorStatus;

  locationLabel: string;
  batteryPct: number; // 0-100
  signalPct: number; // 0-100
  installedAt: string; // "15/06/2023"

  currentValue: number;
  unit: string; // "°C", "%", "pH"
  lastUpdatedAt: string; // "30/01/2026, 19:27:10"

  alertMin: number;
  alertMax: number;
  readIntervalSeconds: number;

  linkedPlant?: { id: string; name: string; locationLabel: string };

  deviceInfo: {
    firmware: string;
    lastCalibrationAt: string; // "01/01/2024"
    typeLabel: string; // "Temperatura"
  };
};

export type SensorReadingRow = {
  at: string; // "2024-01-20 10:00"
  value: string; // "24.5°C"
  status?: "NORMAL" | "ATENCAO" | "CRITICO";
};

export type SensorAlertRow = {
  id: string;
  title: string; // "Temperatura Alta"
  at: string; // "2024-01-18 14:30"
  statusLabel: "Resolvido" | "Ativo";
};

export const sampleSensorDetails: Record<string, SensorDetailsDto> = {
  "th-001": {
    id: "th-001",
    code: "TH-001",
    name: "Sensor Temperatura A1",
    type: "TEMPERATURA",
    status: "ONLINE",

    locationLabel: "Estufa A - Setor 1",
    batteryPct: 87,
    signalPct: 85,
    installedAt: "15/06/2023",

    currentValue: 24.5,
    unit: "°C",
    lastUpdatedAt: "30/01/2026, 19:27:10",

    alertMin: 18,
    alertMax: 28,
    readIntervalSeconds: 60,

    linkedPlant: {
      id: "tomates-a1",
      name: "Tomatoes A1",
      locationLabel: "Estufa A - Setor 1",
    },

    deviceInfo: {
      firmware: "v2.1.3",
      lastCalibrationAt: "01/01/2024",
      typeLabel: "Temperatura",
    },
  },
};

export const sampleSensorReadings: SensorReadingRow[] = [
  { at: "2024-01-20 08:00", value: "22.3°C", status: "NORMAL" },
  { at: "2024-01-20 09:00", value: "23.1°C", status: "NORMAL" },
  { at: "2024-01-20 10:00", value: "24.5°C", status: "NORMAL" },
  { at: "2024-01-20 11:00", value: "25.8°C", status: "NORMAL" },
  { at: "2024-01-20 12:00", value: "26.2°C", status: "NORMAL" },
];

export const sampleSensorAlerts: SensorAlertRow[] = [
  { id: "a1", title: "Temperatura Alta", at: "2024-01-18 14:30", statusLabel: "Resolvido" },
];

export type SensorStatus = "ONLINE" | "ATENCAO" | "OFFLINE";

export type SensorCardDto = {
  id: string;
  code: string; // ex: TH-001
  name: string; // ex: Sensor Temperatura A1
  type: "TEMPERATURA" | "UMIDADE" | "LUMINOSIDADE" | "PH";
  status: SensorStatus;
  lastValue: number; // ex: 24.6
  unit: string; // ex: °C, %, pH
  plantName?: string; // se vinculado
  plantId?: string; // pra navegar pro detalhe da planta
  updatedAt: string; // texto pronto: "19/01/2026, 15:15:49"
};

export const sampleSensors: SensorCardDto[] = [
  {
    id: "1",
    code: "TH-001",
    name: "Sensor Temperatura A1",
    type: "TEMPERATURA",
    status: "ONLINE",
    lastValue: 24.6,
    unit: "°C",
    plantName: "Tomates A1",
    plantId: "tomates-a1",
    updatedAt: "19/01/2026, 15:15:49",
  },
  {
    id: "2",
    code: "UM-014",
    name: "Sensor Umidade A1",
    type: "UMIDADE",
    status: "ATENCAO",
    lastValue: 45,
    unit: "%",
    plantName: "Tomates A1",
    plantId: "tomates-a1",
    updatedAt: "19/01/2026, 15:12:10",
  },
  {
    id: "3",
    code: "LZ-003",
    name: "Sensor Luz B1",
    type: "LUMINOSIDADE",
    status: "OFFLINE",
    lastValue: 0,
    unit: "%",
    updatedAt: "—",
  },
];

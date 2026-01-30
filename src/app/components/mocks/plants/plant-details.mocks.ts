export const mockOverview = {
  observations: "Plantio iniciado em 15/01/2024. Variedade cherry orgânica.",
  metrics: {
    temperature: { value: 24, suffix: "°C", ideal: "20°C - 28°C" },
    humidity: { value: 65, suffix: "%", ideal: "60% - 80%" },
    light: { value: 78, suffix: "%", ideal: "70% - 90%" },
    ph: { value: 6.5, suffix: "", ideal: "6 - 7" },
  },
};

export const mockReadings = [
  { time: "20-01-2025 09:00", temperature: "22°C", humidity: "68%", light: "68%" },
  { time: "20-01-2025 09:00", temperature: "22°C", humidity: "68%", light: "68%" },
  { time: "20-01-2025 09:00", temperature: "22°C", humidity: "68%", light: "68%" },
  { time: "20-01-2025 09:00", temperature: "22°C", humidity: "68%", light: "68%" },
  { time: "20-01-2025 09:00", temperature: "22°C", humidity: "68%", light: "68%" },
];

export const mockSensors = [
  { name: "Sensor Temperatura A1", code: "TH-001", value: "24.6°C", status: "Online" },
  { name: "Sensor Temperatura A1", code: "TH-001", value: "24.6°C", status: "Online" },
  { name: "Sensor Temperatura A1", code: "TH-001", value: "24.6°C", status: "Online" },
  { name: "Sensor Temperatura A1", code: "TH-001", value: "24.6°C", status: "Online" },
];

export const mockAlerts = [
  {
    title: "Temperatura Crítica",
    subtitle: "Temperatura muito alta detectada no sensor TH-001",
    plantName: "Tomates A1",
    sensorCode: "TH-001",
    value: "35.2°C",
    time: "19/01/2026, 15:15:49",
  },
  {
    title: "Temperatura Crítica",
    subtitle: "Temperatura muito alta detectada no sensor TH-001",
    plantName: "Tomates A1",
    sensorCode: "TH-001",
    value: "35.2°C",
    time: "19/01/2026, 15:15:49",
  },
  {
    title: "Temperatura Crítica",
    subtitle: "Temperatura muito alta detectada no sensor TH-001",
    plantName: "Tomates A1",
    sensorCode: "TH-001",
    value: "35.2°C",
    time: "19/01/2026, 15:15:49",
  },
  {
    title: "Temperatura Crítica",
    subtitle: "Temperatura muito alta detectada no sensor TH-001",
    plantName: "Tomates A1",
    sensorCode: "TH-001",
    value: "35.2°C",
    time: "19/01/2026, 15:15:49",
  },
];

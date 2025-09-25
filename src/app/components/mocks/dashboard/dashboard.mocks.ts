import type { Role } from "@/app/lib/auth.client";

export function sampleRecentPlants(role: Role) {
  const all = [
    { id: "p1", name: "Manjericão", species: "Ocimum basilicum", createdAt: "há 2h" },
    { id: "p2", name: "Hortelã", species: "Mentha spicata", createdAt: "há 1 dia" },
    { id: "p3", name: "Tomateiro", species: "Solanum lycopersicum", createdAt: "há 3 dias" },
    { id: "p4", name: "Samambaia", species: "Nephrolepis exaltata", createdAt: "há 5 dias" },
  ];
  return role === "ADMIN" ? all : all.slice(0, 3);
}

export function sampleLatestReadings(role: Role) {
  const all = [
    { id: "r1", plant: "Manjericão", sensor: "Umidade", value: 58, unit: "%", time: "agora", ok: true },
    { id: "r2", plant: "Hortelã", sensor: "Temp.", value: 25.3, unit: "°C", time: "há 3m", ok: true },
    { id: "r3", plant: "Tomateiro", sensor: "pH", value: 6.1, unit: "", time: "há 12m", ok: true },
    { id: "r4", plant: "Samambaia", sensor: "Luminos.", value: 220, unit: "lx", time: "há 21m", ok: false },
  ];
  return role === "ADMIN" ? all : all.slice(0, 3);
}

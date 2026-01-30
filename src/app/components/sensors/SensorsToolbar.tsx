"use client";

import { Search } from "lucide-react";

export type SensorsQuickFilters = {
  query: string;
  status: "" | "ONLINE" | "ATENCAO" | "OFFLINE";
  type: "" | "TEMPERATURA" | "UMIDADE" | "LUMINOSIDADE" | "PH";
};

export default function SensorsToolbar({
  quick,
  onChangeQuick,
}: {
  quick: SensorsQuickFilters;
  onChangeQuick: (next: SensorsQuickFilters) => void;
}) {
  function set<K extends keyof SensorsQuickFilters>(key: K, value: SensorsQuickFilters[K]) {
    onChangeQuick({ ...quick, [key]: value });
  }

  return (
    <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_220px] md:items-center">
        {/* Buscar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/35" />
          <input
            value={quick.query}
            onChange={(e) => set("query", e.target.value)}
            placeholder="Buscar sensores..."
            className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          />
        </div>

        {/* Status */}
        <select
          value={quick.status}
          onChange={(e) => set("status", e.target.value as SensorsQuickFilters["status"])}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
        >
          <option value="">Todos os status</option>
          <option value="ONLINE">Online</option>
          <option value="ATENCAO">Atenção</option>
          <option value="OFFLINE">Offline</option>
        </select>

        {/* Tipo */}
        <select
          value={quick.type}
          onChange={(e) => set("type", e.target.value as SensorsQuickFilters["type"])}
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                     focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
        >
          <option value="">Todos os tipos</option>
          <option value="TEMPERATURA">Temperatura</option>
          <option value="UMIDADE">Umidade</option>
          <option value="LUMINOSIDADE">Luminosidade</option>
          <option value="PH">pH</option>
        </select>
      </div>
    </div>
  );
}

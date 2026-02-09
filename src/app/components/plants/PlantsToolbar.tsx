"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import AdvancedFiltersModal from "@/app/components/plants/AdvancedFiltersModal";

export type PlantsQuickFilters = {
  query: string;
  status: "" | "ONLINE" | "ATENCAO" | "OFFLINE";
  location: string;
};

export type AdvancedFilters = {
  status: "" | "ONLINE" | "ATENCAO" | "OFFLINE";
  location: string;
  species: string;
  minSensors: string;
  maxSensors: string;
};

export default function PlantsToolbar({
  quick,
  onChangeQuick,

  advanced,
  onChangeAdvanced,
  onApplyAdvanced,
  onClearAdvanced,

  locationOptions,
}: {
  quick: PlantsQuickFilters;
  onChangeQuick: (next: PlantsQuickFilters) => void;

  advanced: AdvancedFilters;
  onChangeAdvanced: (next: AdvancedFilters) => void;
  onApplyAdvanced: () => void;
  onClearAdvanced: () => void;

  locationOptions?: Array<{ value: string; label: string }>;
}) {
  const [openAdvanced, setOpenAdvanced] = useState(false);

  const locations = useMemo(() => {
    return (
      locationOptions ?? [
        { value: "", label: "Todas as localizações" },
        { value: "Estufa A - Setor 1", label: "Estufa A - Setor 1" },
        { value: "Estufa A - Setor 2", label: "Estufa A - Setor 2" },
        { value: "Estufa B - Setor 1", label: "Estufa B - Setor 1" },
      ]
    );
  }, [locationOptions]);

  function setQuick<K extends keyof PlantsQuickFilters>(
    key: K,
    value: PlantsQuickFilters[K]
  ) {
    onChangeQuick({ ...quick, [key]: value });
  }

  return (
    <>
      {/* Container igual ao print */}
      <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_220px_auto] md:items-center">
          {/* Buscar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/35" />
            <input
              value={quick.query}
              onChange={(e) => setQuick("query", e.target.value)}
              placeholder="Buscar plantas..."
              className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
            />
          </div>

          {/* Status */}
          <select
            value={quick.status}
            onChange={(e) =>
              setQuick("status", e.target.value as PlantsQuickFilters["status"])
            }
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          >
            <option value="">Todos os status</option>
            <option value="ONLINE">Online</option>
            <option value="ATENCAO">Atenção</option>
            <option value="OFFLINE">Offline</option>
          </select>

          {/* Localização */}
          <select
            value={quick.location}
            onChange={(e) => setQuick("location", e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          >
            {locations.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Botão Filtros Avançados */}
          <button
            type="button"
            onClick={() => setOpenAdvanced(true)}
            className="w-full md:w-auto rounded-xl px-4 py-2.5 text-sm font-semibold
                       border border-black/15 bg-white text-[var(--plant-graphite)]
                       shadow-none transition-colors hover:bg-black/5
                       inline-flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4 text-black/50" />
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* Modal */}
      <AdvancedFiltersModal
        open={openAdvanced}
        value={advanced}
        onChange={onChangeAdvanced}
        onClose={() => setOpenAdvanced(false)}
        onApply={() => {
          onApplyAdvanced();
          setOpenAdvanced(false);
        }}
        onClear={onClearAdvanced}
      />
    </>
  );
}

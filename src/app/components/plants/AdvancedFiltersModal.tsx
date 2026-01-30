"use client";

import Modal from "@/app/components/ui/Modal";

type AdvancedFilters = {
  status: "" | "ONLINE" | "ATENCAO" | "OFFLINE";
  location: string;
  species: string;
  minSensors: string; // string para input simples
  maxSensors: string;
};

type Props = {
  open: boolean;
  value: AdvancedFilters;
  onChange: (next: AdvancedFilters) => void;
  onClose: () => void;
  onApply: () => void;
  onClear: () => void;
};

export default function AdvancedFiltersModal({
  open,
  value,
  onChange,
  onClose,
  onApply,
  onClear,
}: Props) {
  function set<K extends keyof AdvancedFilters>(key: K, v: AdvancedFilters[K]) {
    onChange({ ...value, [key]: v });
  }

  return (
    <Modal
      open={open}
      title="Filtros avançados"
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl px-5 py-2 text-sm font-semibold
                       border border-black/15 bg-white text-[var(--plant-graphite)]
                       shadow-none transition-colors hover:bg-black/5"
          >
            Limpar
          </button>

          <button
            type="button"
            onClick={onApply}
            className="rounded-xl px-6 py-2 text-sm font-semibold
                       bg-[var(--plant-primary)] text-white
                       transition-opacity hover:opacity-95"
          >
            Aplicar
          </button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
            Status
          </label>
          <select
            value={value.status}
            onChange={(e) => set("status", e.target.value as AdvancedFilters["status"])}
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          >
            <option value="">Todos</option>
            <option value="ONLINE">Online</option>
            <option value="ATENCAO">Atenção</option>
            <option value="OFFLINE">Offline</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
            Localização
          </label>
          <input
            value={value.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Ex: Estufa A"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
            Espécie
          </label>
          <input
            value={value.species}
            onChange={(e) => set("species", e.target.value)}
            placeholder="Ex: Tomate"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
            Mín. sensores
          </label>
          <input
            value={value.minSensors}
            onChange={(e) => set("minSensors", e.target.value)}
            inputMode="numeric"
            placeholder="0"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
            Máx. sensores
          </label>
          <input
            value={value.maxSensors}
            onChange={(e) => set("maxSensors", e.target.value)}
            inputMode="numeric"
            placeholder="999"
            className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          />
        </div>

        <p className="md:col-span-2 text-xs text-black/45">
          Dica: esses filtros são combinados com a busca/toolbar (se houver).
        </p>
      </div>
    </Modal>
  );
}

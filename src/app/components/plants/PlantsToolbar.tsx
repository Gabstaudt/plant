import { SlidersHorizontal, Search } from "lucide-react";

export default function PlantsToolbar() {
  return (
    <div className="mt-5 rounded-2xl bg-white border border-black/5 p-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
          <input
            placeholder="Buscar plantas..."
            className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 py-2 outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:flex md:items-center md:gap-3">
          <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/70 outline-none">
            <option>Todos os status</option>
            <option>Online</option>
            <option>Atenção</option>
            <option>Offline</option>
          </select>

          <select className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/70 outline-none">
            <option>Todas as localiz...</option>
            <option>Estufa A</option>
            <option>Estufa B</option>
          </select>

          <button className="btn btn-outline rounded-xl px-4 py-2 text-sm">
            <SlidersHorizontal className="h-4 w-4" />
            Filtros Avançados
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/app/components/layout/PageHeader";
import PlantsToolbar, {
  type PlantsQuickFilters,
  type AdvancedFilters,
} from "@/app/components/plants/PlantsToolbar";
import PlantCard from "@/app/components/plants/PlantCard";
import Pagination from "@/app/components/ui/Pagination";
import { listPlants, mapPlantToCard, type PlantCardView } from "@/app/lib/plants.api";

const initialQuick: PlantsQuickFilters = {
  query: "",
  status: "",
  location: "",
};

const initialAdvanced: AdvancedFilters = {
  status: "",
  location: "",
  species: "",
  minSensors: "",
  maxSensors: "",
};

export default function PlantsPage() {
  const [quick, setQuick] = useState<PlantsQuickFilters>(initialQuick);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(initialAdvanced);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const [plants, setPlants] = useState<PlantCardView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setError(null);
        const res = await listPlants();
        if (!active) return;
        const mapped = (res?.data ?? []).map(mapPlantToCard);
        setPlants(mapped);
      } catch (err: any) {
        if (active) setError(err?.message || "Falha ao carregar plantas.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = quick.query.trim().toLowerCase();
    const minS = advanced.minSensors.trim()
      ? Number(advanced.minSensors)
      : null;
    const maxS = advanced.maxSensors.trim()
      ? Number(advanced.maxSensors)
      : null;

    return plants.filter((p) => {
      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.species.toLowerCase().includes(q) ||
          p.locationLabel.toLowerCase().includes(q);

        if (!match) return false;
      }

      if (quick.status && String(p.status) !== quick.status) return false;
      if (
        quick.location &&
        !p.locationLabel.toLowerCase().includes(quick.location.toLowerCase())
      )
        return false;

      if (advanced.status && String(p.status) !== advanced.status) return false;

      if (advanced.location.trim()) {
        if (
          !p.locationLabel
            .toLowerCase()
            .includes(advanced.location.toLowerCase())
        )
          return false;
      }

      if (advanced.species.trim()) {
        if (!p.species.toLowerCase().includes(advanced.species.toLowerCase()))
          return false;
      }

      if (minS !== null && p.sensorsCount < minS) return false;
      if (maxS !== null && p.sensorsCount > maxS) return false;

      return true;
    });
  }, [quick, advanced, plants]);

  const total = filtered.length;

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const locationOptions = useMemo(() => {
    const unique = new Map<string, string>();
    plants.forEach((p) => {
      if (p.locationLabel) unique.set(p.locationLabel, p.locationLabel);
    });
    return [
      { value: "", label: "Todas as localizações" },
      ...Array.from(unique.values()).map((label) => ({
        value: label,
        label,
      })),
    ];
  }, [plants]);

  function applyAdvancedFilters() {
    setPage(1);
  }

  function clearAdvancedFilters() {
    setAdvanced(initialAdvanced);
    setPage(1);
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Plantas"
        subtitle="Gerencie e monitore todas as plantas cadastradas"
        right={
          <Link
            href="/plants/new"
            className="btn btn-primary rounded-full px-5 py-2"
          >
            <span className="inline-flex -ml-1 mr-1 w-5 h-5 items-center justify-center">
              +
            </span>
            Nova Planta
          </Link>
        }
      />

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <PlantsToolbar
        quick={quick}
        onChangeQuick={(next) => {
          setQuick(next);
          setPage(1);
        }}
        advanced={advanced}
        onChangeAdvanced={setAdvanced}
        onApplyAdvanced={applyAdvancedFilters}
        onClearAdvanced={clearAdvancedFilters}
        locationOptions={locationOptions}
      />

      {loading ? (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
          Carregando plantas...
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {paged.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </div>

          {!paged.length ? (
            <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
              Nenhuma planta encontrada com os filtros atuais.
            </div>
          ) : null}
        </>
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}

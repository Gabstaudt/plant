"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/app/components/layout/PageHeader";
import PlantsToolbar, {
  type PlantsQuickFilters,
  type AdvancedFilters,
} from "@/app/components/plants/PlantsToolbar";
import PlantCard from "@/app/components/plants/PlantCard";
import Pagination from "@/app/components/ui/Pagination";
import { samplePlants } from "@/app/components/mocks/plants/plants.mocks";

/* -------------------------
 * Estados iniciais
 * ------------------------- */

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
  /* -------------------------
   * Estados
   * ------------------------- */

  // filtros rápidos (toolbar)
  const [quick, setQuick] = useState<PlantsQuickFilters>(initialQuick);

  // filtros avançados (modal)
  const [advanced, setAdvanced] = useState<AdvancedFilters>(initialAdvanced);

  // paginação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  /* -------------------------
   * Filtro combinado (rápidos + avançados)
   * ------------------------- */

  const filtered = useMemo(() => {
    const q = quick.query.trim().toLowerCase();
    const minS = advanced.minSensors.trim()
      ? Number(advanced.minSensors)
      : null;
    const maxS = advanced.maxSensors.trim()
      ? Number(advanced.maxSensors)
      : null;

    return samplePlants.filter((p) => {
      /* ---- filtros rápidos ---- */

      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.species.toLowerCase().includes(q) ||
          p.locationLabel.toLowerCase().includes(q);

        if (!match) return false;
      }

      if (quick.status && String(p.status) !== quick.status) return false;
      if (quick.location && p.locationLabel !== quick.location) return false;

      /* ---- filtros avançados ---- */

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
        if (
          !p.species.toLowerCase().includes(advanced.species.toLowerCase())
        )
          return false;
      }

      if (minS !== null && p.sensorsCount < minS) return false;
      if (maxS !== null && p.sensorsCount > maxS) return false;

      return true;
    });
  }, [quick, advanced]);

  /* -------------------------
   * Paginação
   * ------------------------- */

  const total = filtered.length;

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  /* -------------------------
   * Handlers
   * ------------------------- */

  function applyAdvancedFilters() {
    setPage(1);
  }

  function clearAdvancedFilters() {
    setAdvanced(initialAdvanced);
    setPage(1);
  }

  /* -------------------------
   * Render
   * ------------------------- */

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
              ＋
            </span>
            Nova Planta
          </Link>
        }
      />

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
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paged.map((p) => (
          <PlantCard key={p.id} plant={p} />
        ))}
      </div>

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

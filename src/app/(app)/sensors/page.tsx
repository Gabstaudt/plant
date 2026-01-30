"use client";

import { useMemo, useState } from "react";

import PageHeader from "@/app/components/layout/PageHeader";
import SensorsToolbar, { type SensorsQuickFilters } from "@/app/components/sensors/SensorsToolbar";
import SensorCard from "@/app/components/sensors/SensorCard";
import Pagination from "@/app/components/ui/Pagination";
import { sampleSensors } from "@/app/components/mocks/sensors/sensors.mocks";

const initialQuick: SensorsQuickFilters = {
  query: "",
  status: "",
  type: "",
};

export default function SensorsPage() {
  const [quick, setQuick] = useState<SensorsQuickFilters>(initialQuick);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const filtered = useMemo(() => {
    const q = quick.query.trim().toLowerCase();

    return sampleSensors.filter((s) => {
      if (q) {
        const match =
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          (s.plantName ? s.plantName.toLowerCase().includes(q) : false);

        if (!match) return false;
      }

      if (quick.status && s.status !== quick.status) return false;
      if (quick.type && s.type !== quick.type) return false;

      return true;
    });
  }, [quick]);

  const total = filtered.length;

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Sensores"
        subtitle="Gerencie e monitore todos os sensores cadastrados"
      />

      <SensorsToolbar
        quick={quick}
        onChangeQuick={(next) => {
          setQuick(next);
          setPage(1);
        }}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {paged.map((s) => (
          <SensorCard key={s.id} sensor={s} />
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

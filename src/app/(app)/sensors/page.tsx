"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/app/components/layout/PageHeader";
import SensorsToolbar, { type SensorsQuickFilters } from "@/app/components/sensors/SensorsToolbar";
import SensorCard from "@/app/components/sensors/SensorCard";
import Pagination from "@/app/components/ui/Pagination";
import { listSensors, mapSensorToCard, type SensorCardView } from "@/app/lib/sensors.api";

const initialQuick: SensorsQuickFilters = {
  query: "",
  status: "",
  type: "",
};

export default function SensorsPage() {
  const [quick, setQuick] = useState<SensorsQuickFilters>(initialQuick);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6); // print parece 2 colunas -> 6 fica legal
  const [sensors, setSensors] = useState<SensorCardView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await listSensors();
        if (!active) return;
        const mapped = (res?.data ?? []).map(mapSensorToCard);
        setSensors(mapped);
      } catch {
        if (active) setSensors([]);
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

    return sensors.filter((s) => {
      if (q) {
        const match =
          s.name.toLowerCase().includes(q) ||
          s.code.toLowerCase().includes(q) ||
          s.locationLabel.toLowerCase().includes(q) ||
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
        subtitle="Inventário e status de todos os sensores"
        right={
          <Link href="/sensors/new" className="btn btn-primary rounded-full px-5 py-2">
            <span className="inline-flex -ml-1 mr-1 w-5 h-5 items-center justify-center">+</span>
            Novo Sensor
          </Link>
        }
      />

      <SensorsToolbar
        quick={quick}
        onChangeQuick={(next) => {
          setQuick(next);
          setPage(1);
        }}
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {!loading &&
          paged.map((s) => (
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


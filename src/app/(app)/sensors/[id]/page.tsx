"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import SensorDetailsHeader from "@/app/components/sensors/details/SensorDetailsHeader";
import SensorCurrentReadingCard from "@/app/components/sensors/details/SensorCurrentReadingCard";
import SensorDetailsTabs from "@/app/components/sensors/details/SensorDetailsTabs";
import SensorSettingsPanel from "@/app/components/sensors/details/SensorSettingsPanel";

import SensorOverviewPanel from "@/app/components/sensors/details/SensorOverviewPanel";
import SensorReadingsPanel from "@/app/components/sensors/details/SensorReadingsPanel";
import SensorAlertsPanel from "@/app/components/sensors/details/SensorAlertsPanel";

import { sampleSensorDetails } from "@/app/components/mocks/sensors/sensors.mocks";

type Tab = "overview" | "readings" | "alerts" | "settings";

export default function SensorDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const sensor = useMemo(() => sampleSensorDetails[id], [id]);

  const [tab, setTab] = useState<Tab>("overview");

  if (!sensor) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          Sensor não encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <SensorDetailsHeader sensor={sensor} backHref="/sensors" />
      <SensorCurrentReadingCard sensor={sensor} />

      <SensorDetailsTabs tab={tab} onChange={setTab} />

      {/* Conteúdo das tabs */}
      {tab === "overview" && <SensorOverviewPanel sensor={sensor} />}
      {tab === "readings" && <SensorReadingsPanel sensor={sensor} />}
      {tab === "alerts" && <SensorAlertsPanel sensor={sensor} />}
      {tab === "settings" && <SensorSettingsPanel sensor={sensor} />}
    </div>
  );
}

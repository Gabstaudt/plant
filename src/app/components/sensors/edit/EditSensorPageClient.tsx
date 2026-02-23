"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

import NewSensorForm from "@/app/components/sensors/new/NewSensorForm";
import { sampleSensorDetails } from "@/app/components/mocks/sensors/sensors.mocks";

export default function EditSensorPageClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const sensor = useMemo(() => sampleSensorDetails[id], [id]);

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
      <NewSensorForm
        mode="edit"
        defaultValues={{
          name: sensor.name,
          code: sensor.code,
          type: sensor.type,
          location: sensor.locationLabel,
          unit: sensor.unit,
          readIntervalSeconds: String(sensor.readIntervalSeconds),
          notes: "",
          plantId: sensor.linkedPlant?.id ?? "",
          alertsEnabled: true,
          alertMin: String(sensor.alertMin),
          alertMax: String(sensor.alertMax),
        }}
        onSubmitSuccess={() => router.push(`/sensors/${sensor.id}`)}
      />
    </div>
  );
}

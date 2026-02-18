"use client";

import NewSensorForm from "@/app/components/sensors/new/NewSensorForm";
import { useRouter } from "next/navigation";

export default function NewSensorPage() {
  const router = useRouter();
  return (
    <div className="p-4 md:p-6">
      <NewSensorForm onSubmitSuccess={() => router.push("/sensors")} />
    </div>
  );
}

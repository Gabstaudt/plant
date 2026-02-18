"use client";

import NewPlantForm from "@/app/components/plants/new/NewPlantForm";
import { useRouter } from "next/navigation";

export default function NewPlantPage() {
  const router = useRouter();
  return (
    <div className="p-4 md:p-6">
      <NewPlantForm onSubmitSuccess={() => router.push("/plants")} />
    </div>
  );
}

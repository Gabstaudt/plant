import DashboardClient from "@/app/components/dashboard/DashboardClient";
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6">
      <DashboardClient />
    </div>
  );
}

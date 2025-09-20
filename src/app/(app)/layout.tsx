import Sidebar from "@/app/components/layout/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[18rem_1fr] bg-[var(--plant-ice)]">
      <Sidebar />
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}

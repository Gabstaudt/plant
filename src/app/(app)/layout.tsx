import Sidebar from "@/app/components/layout/Sidebar";
import { inter } from "@/app/styles/fonts";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} font-sans bg-[var(--plant-ice)]`}>
      <Sidebar />

      <main
        className="
          min-h-dvh
          md:ml-72
          h-dvh
          overflow-y-auto
        "
      >
        {children}
      </main>
    </div>
  );
}

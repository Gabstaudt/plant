"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole, type Role } from "@/app/lib/auth.client";
import { useState } from "react";
import {
  Home, Sprout, Gauge, AlertTriangle, BarChart3, Users, Settings,
} from "lucide-react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";

type Item = {
  href: string;
  label: string;
  Icon: (props: { className?: string }) => ReactNode;
  roles: Array<Role | "ALL">;
};

const NAV: Item[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["ALL"], Icon: (p) => <Home {...p} /> },
  { href: "/plants",    label: "Plantas",   roles: ["ALL"], Icon: (p) => <Sprout {...p} /> },
  { href: "/sensors",   label: "Sensores",  roles: ["ALL"], Icon: (p) => <Gauge {...p} /> },
  { href: "/alerts",    label: "Alertas",   roles: ["ALL"], Icon: (p) => <AlertTriangle {...p} /> },
  { href: "/reports",   label: "Relatórios",roles: ["ALL"], Icon: (p) => <BarChart3 {...p} /> },
  { href: "/users",     label: "Usuários",  roles: ["ADMIN"], Icon: (p) => <Users {...p} /> },
  { href: "/settings",  label: "Configurações", roles: ["ADMIN"], Icon: (p) => <Settings {...p} /> },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/" || pathname.startsWith("/dashboard");
  return pathname.startsWith(href);
}

export default function Sidebar({ initialRole }: { initialRole?: Role }) {
  const pathname = usePathname();
  const role = useRole(initialRole);
  const [open, setOpen] = useState(false);

  const items = NAV.filter((i) => i.roles.includes("ALL") || i.roles.includes(role));

  return (
    <>
      {/* Top bar (mobile) */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-[var(--plant-ice)] px-4 py-3 border-b border-black/5">
        <button onClick={() => setOpen((v) => !v)} className="p-2 rounded-lg hover:bg-black/5" aria-label="Abrir menu">
          <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/dashboard" className="inline-flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
          <span className="text-[var(--plant-dark)] font-extrabold">Plant Connect</span>
        </Link>
        <div className="w-6" />
      </div>

      {/* Overlay mobile */}
      {open && <div className="md:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
        <aside
          className={[
            // MOBILE: drawer (continua igual)
            "fixed z-50 inset-y-0 left-0 w-72",
            "bg-[var(--plant-ice)] border-r border-black/5",
            "transition-transform",
            open ? "translate-x-0" : "-translate-x-full",

            // DESKTOP: fixa e não rola
            "md:translate-x-0 md:top-0 md:left-0 md:h-dvh md:fixed md:z-40",
          ].join(" ")}
        >

        <div className="flex items-center gap-3 px-4 py-4">
          <img src="/logo.png" alt="Logo" className="h-9 w-auto" />
          <span className="text-[var(--plant-dark)] font-extrabold text-lg">NOME AQUI</span>
        </div>

<LayoutGroup>
  <nav className="px-3 pb-6 space-y-1">
    {items.map(({ href, label, Icon }) => {
      const active = isActive(pathname, href);
      return (
        <div key={href} className="relative">
         
          <AnimatePresence>
            {active && (
              <motion.span
                layoutId="active-pill"
                className="absolute inset-0 rounded-2xl bg-[var(--plant-primary)]/12"
                transition={{ type: "spring", stiffness: 500, damping: 38 }}
              />
            )}
          </AnimatePresence>

          <Link
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={[
              "relative group flex items-center gap-3 rounded-2xl px-3 py-2.5",
              "transition-colors duration-150",
              active
                ? "text-[var(--plant-primary)]"
                : "text-[var(--plant-graphite)]/65 hover:text-[var(--plant-primary)] hover:bg-[var(--plant-primary)]/8",
            ].join(" ")}
          >
            <span className="grid place-items-center">
              <Icon
                className={[
                  "w-5 h-5 transition-colors duration-150",
                  active
                    ? "text-[var(--plant-primary)]"
                    : "text-[var(--plant-graphite)]/60 group-hover:text-[var(--plant-primary)]",
                ].join(" ")}
              />
            </span>
            <span className="font-semibold">{label}</span>
          </Link>
        </div>
      );
    })}
  </nav>
</LayoutGroup>
      </aside>
    </>
  );
}

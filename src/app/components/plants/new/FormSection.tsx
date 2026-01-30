import type { ReactNode } from "react";

export default function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-[var(--plant-primary)]/12 grid place-items-center">
          {icon}
        </div>
        <p className="text-base font-extrabold text-[var(--plant-graphite)]">
          {title}
        </p>
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

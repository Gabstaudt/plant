import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode; // botão/ações à direita
};

export default function PageHeader({ title, subtitle, right }: Props) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--plant-graphite)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-black/55">
            {subtitle}
          </p>
        )}
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

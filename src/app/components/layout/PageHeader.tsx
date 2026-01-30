import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode; 
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

        right={
        <Link href="/plants/new" className="btn btn-primary rounded-full px-5 py-2">
          <span className="inline-flex -ml-1 mr-1 w-5 h-5 items-center justify-center">
            ＋
          </span>
          Nova Planta
        </Link>
      }

    </div>
  );
}

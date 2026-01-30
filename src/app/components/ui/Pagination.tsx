"use client";

type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 24],
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clamp(page, 1, totalPages);

  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(total, safePage * pageSize);

  function go(p: number) {
    onPageChange(clamp(p, 1, totalPages));
  }

  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-black/50">
        Mostrando <b className="text-black/70">{start}-{end}</b> de{" "}
        <b className="text-black/70">{total}</b>
      </div>

      <div className="flex items-center gap-3">
        {onPageSizeChange ? (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20"
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>
                {s}/página
              </option>
            ))}
          </select>
        ) : null}

        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(1)}
            disabled={safePage === 1}
            className="rounded-xl px-3 py-2 text-sm font-semibold border border-black/15 bg-white
                       hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            «
          </button>
          <button
            type="button"
            onClick={() => go(safePage - 1)}
            disabled={safePage === 1}
            className="rounded-xl px-3 py-2 text-sm font-semibold border border-black/15 bg-white
                       hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹
          </button>

          <div className="px-2 text-sm text-black/60">
            Página <b className="text-black/80">{safePage}</b> de{" "}
            <b className="text-black/80">{totalPages}</b>
          </div>

          <button
            type="button"
            onClick={() => go(safePage + 1)}
            disabled={safePage === totalPages}
            className="rounded-xl px-3 py-2 text-sm font-semibold border border-black/15 bg-white
                       hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ›
          </button>
          <button
            type="button"
            onClick={() => go(totalPages)}
            disabled={safePage === totalPages}
            className="rounded-xl px-3 py-2 text-sm font-semibold border border-black/15 bg-white
                       hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}

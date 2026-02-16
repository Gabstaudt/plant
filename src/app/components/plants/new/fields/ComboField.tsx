import { useMemo, useState } from "react";

type Option = { value: string; label: string };

export default function ComboField({
  label,
  placeholder,
  value,
  options,
  onChange,
  onBlur,
  error,
  className,
  listId,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  className?: string;
  listId: string;
}) {
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => {
      const v = o.value.toLowerCase();
      const l = o.label.toLowerCase();
      return v.includes(q) || l.includes(q);
    });
  }, [options, value]);

  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
        {label}
      </label>

      <div className="relative">
        <input
          list={listId}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            onBlur?.();
          }}
          className={[
            "mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none",
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-200"
              : "border-black/10 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30",
          ].join(" ")}
        />

        {open && filtered.length > 0 ? (
          <div className="absolute z-10 mt-1 w-full max-h-44 overflow-auto rounded-xl border border-black/10 bg-white shadow-sm">
            {filtered.map((o) => (
              <button
                key={o.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(o.value);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-[var(--plant-graphite)] hover:bg-black/5"
              >
                {o.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

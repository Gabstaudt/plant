export default function TextField({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--plant-graphite)]">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={[
          "mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none",
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-200"
            : "border-black/10 focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30",
        ].join(" ")}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

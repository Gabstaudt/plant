const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

type Options = RequestInit & { noBase?: boolean };

export async function api<T = any>(url: string, opts: Options = {}): Promise<T> {
  const full = opts.noBase ? url : `${API_BASE}/api${url.startsWith("/") ? "" : "/"}${url}`;
  const res = await fetch(full, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  return res.json();
}

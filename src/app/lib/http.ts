import { API_BASE } from "@/app/config/api.config";

type Options = RequestInit & { noBase?: boolean };

function buildHeaders(opts: Options): HeadersInit {
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) baseHeaders["Authorization"] = `Bearer ${token}`;
  }
  return { ...baseHeaders, ...(opts.headers || {}) };
}

export async function api<T = any>(url: string, opts: Options = {}): Promise<T> {
  const full = opts.noBase ? url : `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
  const res = await fetch(full, { ...opts, headers: buildHeaders(opts) });

  if (!res.ok) {
   
    let msg = `Erro ${res.status}`;
    try {
      const j = await res.json();
      msg = (Array.isArray(j?.message) ? j.message[0] : j?.message) || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

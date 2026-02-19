"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  UserPlus,
  User,
  Shield,
  CheckCircle2,
  Clock,
  X,
  KeyRound,
} from "lucide-react";

import PageHeader from "@/app/components/layout/PageHeader";
import {
  approveEcosystemRequest,
  getEcosystem,
  listEcosystemRequests,
  listEcosystemUsers,
  rejectEcosystemRequest,
  updateEcosystemUserRole,
  type EcosystemRequest,
  type EcosystemUser,
  type Role,
  type Status,
} from "@/app/lib/users.api";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastLogin: string;
};

type RequestRow = {
  id: number;
  name: string;
  email: string;
  requestedRole: Role;
  requestedAt: string;
};

const usersFallback: UserRow[] = [];
const requestsFallback: RequestRow[] = [];

function roleLabel(role: Role) {
  if (role === "ADMIN_MASTER") return "Administrador";
  if (role === "ADMIN") return "Administrador";
  return "Usuário";
}

function statusBadge(status: Status) {
  if (status === "ATIVO") {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
  if (status === "PENDENTE") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }
  return "bg-red-50 text-red-600 border-red-200";
}

function formatDateTime(value?: string | null) {
  if (!value) return "—";
  try {
    const d = new Date(value);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
  } catch {
    return "—";
  }
}

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | Role>("");
  const [ecosystemCode, setEcosystemCode] = useState<string>("—");
  const [users, setUsers] = useState<UserRow[]>(usersFallback);
  const [requests, setRequests] = useState<RequestRow[]>(requestsFallback);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [eco, usersRes, requestsRes] = await Promise.all([
          getEcosystem(),
          listEcosystemUsers(),
          listEcosystemRequests(),
        ]);
        if (!mounted) return;
        setEcosystemCode(eco.code);
        setUsers(
          usersRes.map((u: EcosystemUser) => ({
            id: u.id,
            name: u.fullName,
            email: u.email,
            role: u.role,
            status: u.status,
            lastLogin: formatDateTime(u.lastLoginAt),
          })),
        );
        setRequests(
          requestsRes.map((r: EcosystemRequest) => ({
            id: r.id,
            name: r.fullName,
            email: r.email,
            requestedRole: (r.requestedRole ?? r.role) as Role,
            requestedAt: formatDateTime(r.createdAt),
          })),
        );
      } catch {
        if (!mounted) return;
        setUsers(usersFallback);
        setRequests(requestsFallback);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const match = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (roleFilter && u.role !== roleFilter) return false;
      return true;
    });
  }, [query, roleFilter, users]);

  async function handleApprove(id: number) {
    try {
      await approveEcosystemRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      const usersRes = await listEcosystemUsers();
      setUsers(
        usersRes.map((u) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          role: u.role,
          status: u.status,
          lastLogin: formatDateTime(u.lastLoginAt),
        })),
      );
    } catch {
      // no-op
    }
  }

  async function handleReject(id: number) {
    try {
      await rejectEcosystemRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch {
      // no-op
    }
  }

  async function handleToggleRole(user: UserRow) {
    if (user.role === "ADMIN_MASTER") return;
    const nextRole = user.role === "ADMIN" ? "VIEWER" : "ADMIN";
    try {
      const updated = await updateEcosystemUserRole(user.id, nextRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, role: updated.role, status: updated.status }
            : u,
        ),
      );
    } catch {
      // no-op
    }
  }

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Gerenciar Usuários"
        subtitle="Administre usuários, permissões e controle de acesso"
        right={
          <Link href="/users/new" className="btn btn-primary rounded-full px-5 py-2">
            <span className="inline-flex -ml-1 mr-2 h-5 w-5 items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </span>
            Novo Usuário
          </Link>
        }
      />

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[var(--plant-primary)]/10 grid place-items-center">
              <KeyRound className="h-5 w-5 text-[var(--plant-primary)]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                Código do Ecossistema
              </div>
              <div className="text-xs text-black/45">
                Compartilhe para novos usuários solicitarem acesso.
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)]">
              {ecosystemCode}
            </div>
            <button className="rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold text-[var(--plant-graphite)] hover:bg-black/5">
              Copiar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--plant-graphite)]">
                Solicitações Pendentes
              </div>
              <div className="text-xs text-black/45">
                Usuários aguardando aprovação do administrador.
              </div>
            </div>
            <div className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {requests.length}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-black/10 bg-white px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[var(--plant-graphite)]">
                      {r.name}
                    </div>
                    <div className="text-xs text-black/45">{r.email}</div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      <Clock className="h-3.5 w-3.5" />
                      {roleLabel(r.requestedRole)}
                    </div>
                    <div className="mt-2 text-xs text-black/35">
                      {r.requestedAt}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(r.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReject(r.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!requests.length ? (
              <div className="text-sm text-black/45">Nenhuma solicitação pendente.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px] md:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar usuários..."
              className="w-full rounded-xl border border-black/10 bg-white pl-9 pr-4 py-2.5 text-sm outline-none
                         focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "" | Role)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none
                       focus:ring-2 focus:ring-[var(--plant-primary)]/20 focus:border-[var(--plant-primary)]/30"
          >
            <option value="">Todos os tipos</option>
            <option value="ADMIN_MASTER">Administrador</option>
            <option value="ADMIN">Administrador</option>
            <option value="VIEWER">Usuário</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filtered.map((u) => (
          <div key={u.id} className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 grid place-items-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-[var(--plant-graphite)]">
                    {u.name}
                  </div>
                  <div className="text-sm text-black/45">{u.email}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {roleLabel(u.role)}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                        u.status,
                      )}`}
                    >
                      {u.status === "ATIVO"
                        ? "Ativo"
                        : u.status === "PENDENTE"
                          ? "Pendente"
                          : "Bloqueado"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs text-black/45">
                  Último login
                  <div className="mt-1 text-sm font-semibold text-[var(--plant-graphite)]">
                    {u.lastLogin}
                  </div>
                </div>
                <button
                  onClick={() => handleToggleRole(u)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 hover:bg-black/5"
                >
                  <Shield className="h-4 w-4 text-black/50" />
                </button>
                <button className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {!filtered.length ? (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
            Nenhum usuário encontrado.
          </div>
        ) : null}
      </div>
    </div>
  );
}

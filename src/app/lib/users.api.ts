import { api } from "@/app/lib/http";

export type Role = "ADMIN_MASTER" | "ADMIN" | "VIEWER";
export type Status = "ATIVO" | "PENDENTE" | "BLOQUEADO";

export type EcosystemInfo = {
  id: number;
  name: string;
  code: string;
  createdAt: string;
};

export type EcosystemUser = {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  status: Status;
  lastLoginAt: string | null;
  createdAt: string;
};

export type EcosystemRequest = EcosystemUser & { requestedRole?: Role | null };

export async function getEcosystem() {
  return api<EcosystemInfo>("/ecosystems/me");
}

export async function listEcosystemUsers() {
  return api<EcosystemUser[]>("/ecosystems/users");
}

export async function listEcosystemRequests() {
  return api<EcosystemRequest[]>("/ecosystems/requests");
}

export async function approveEcosystemRequest(id: number, role?: "ADMIN" | "VIEWER") {
  return api<EcosystemUser>(`/ecosystems/requests/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify(role ? { role } : {}),
  });
}

export async function rejectEcosystemRequest(id: number) {
  return api<EcosystemUser>(`/ecosystems/requests/${id}/reject`, { method: "PATCH" });
}

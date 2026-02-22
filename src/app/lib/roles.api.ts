import { api } from "@/app/lib/http";

export type RoleProfile = {
  id: number;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export async function listRoleProfiles() {
  return api<{ data: RoleProfile[] }>("/roles");
}

export async function createRoleProfile(payload: { name: string; permissions: string[] }) {
  return api<RoleProfile>("/roles", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRoleProfile(id: number, payload: { name?: string; permissions?: string[] }) {
  return api<RoleProfile>(`/roles/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteRoleProfile(id: number) {
  return api<{ deleted: boolean }>(`/roles/${id}`, { method: "DELETE" });
}

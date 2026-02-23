"use client";

import { useEffect, useState } from "react";

export type Role = "ADMIN_MASTER" | "ADMIN" | "USER";

/** Lê o role do localStorage  */
export function useRole(initial?: Role): Role {
  const [role, setRole] = useState<Role>(initial ?? "USER");
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("role") as Role | null) ?? "USER";
      setRole(saved);
    } catch {
      setRole(initial ?? "USER");
    }
  }, [initial]);
  return role;
}

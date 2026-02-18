import { api } from "@/app/lib/http";

export type AlertCondition =
  | "ABOVE_IDEAL"
  | "BELOW_IDEAL"
  | "EQUALS"
  | "GREATER_THAN"
  | "LESS_THAN";

export type AlertSeverity = "CRITICO" | "MEDIO" | "BAIXO";

export type CreateAlertRulePayload = {
  name: string;
  measurementType: string;
  unit?: string;
  condition: AlertCondition;
  threshold?: number;
  severity: AlertSeverity;
  enabled?: boolean;
  sensorIds?: number[];
};

export async function createAlertRule(payload: CreateAlertRulePayload) {
  return api("/alerts/rules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export type AlertRuleResponse = {
  id: number;
  name: string;
  measurementType: string;
  unit?: string;
  condition: AlertCondition;
  severity: AlertSeverity;
  enabled: boolean;
  sensorIds?: number[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type AlertStatus = "ATIVO" | "RESOLVIDO";

export type AlertResponse = {
  id: number;
  title: string;
  description: string;
  status: AlertStatus;
  severity: AlertSeverity;
  value?: number;
  unit?: string;
  firedAt: string | Date;
  resolvedAt?: string | Date;
  resolvedComment?: string;
  resolvedBy?: { id: number; name: string } | null;
  plant?: { id: number; name: string; location: string } | null;
  sensor: { id: number; name: string; code: string; type: string };
  rule?: { id: number; name: string; detail?: string } | null;
  events?: Array<{
    id: number;
    title: string;
    message?: string;
    at: string | Date;
    by?: string;
  }>;
};

export async function listAlerts() {
  return api<{ data: AlertResponse[] }>("/alerts");
}

export async function listAlertRules() {
  return api<{ data: AlertRuleResponse[] }>("/alerts/rules");
}

export async function getAlert(id: string | number) {
  return api<AlertResponse>(`/alerts/${id}`);
}

export async function resolveAlert(id: string | number, comment: string) {
  return api<AlertResponse>(`/alerts/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({ comment }),
  });
}

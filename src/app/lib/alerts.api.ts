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

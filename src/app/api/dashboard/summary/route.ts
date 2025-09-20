import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = (searchParams.get("role") || "USER").toUpperCase();

  // mocks simples
  const admin = {
    counts: { plants: 142, sensorsOnline: 89, sensorsTotal: 92, alerts: 7, successRate: 94.2 },
    trend:  { plantsMonth: 12, sensorsWeek: -3, successVsMonth: 2.1 },
  };

  const user = {
    counts: { plants: 26, sensorsOnline: 5, sensorsTotal: 6, alerts: 1, successRate: 92.5 },
    trend:  { plantsMonth: 8, sensorsWeek: -2, successVsMonth: 1.4 },
  };

  return NextResponse.json(role === "ADMIN" ? admin : user);
}

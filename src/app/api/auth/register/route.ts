import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  if (typeof body?.email === "string" && body.email.includes("exists")) {
    return NextResponse.json({ ok: false, message: "E-mail já cadastrado." }, { status: 409 });
  }

  return NextResponse.json({
    ok: true,
    id: "u_" + Math.random().toString(36).slice(2, 8),
    role: "USER",
  });
}

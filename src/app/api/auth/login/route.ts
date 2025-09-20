import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const isAdmin = /@admin\.com$/i.test(email);
  const ok = password === "123456";

  if (!ok) {
    return NextResponse.json({ ok: false, message: "Credenciais inválidas." }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    token: "mock.jwt.token",
    role: isAdmin ? "ADMIN" : "USER",
  });
}

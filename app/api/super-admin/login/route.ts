import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { comparePassword } from "../../../../lib/hash";
import { signToken, setAuthCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  const admin = await prisma.superAdmin.findUnique({ where: { email } });
  if (!admin) return NextResponse.json({ ok: false, error: "Invalid" }, { status: 401 });
  const match = await comparePassword(password, admin.password);
  if (!match) return NextResponse.json({ ok: false, error: "Invalid" }, { status: 401 });

  const permissions = await prisma.permission.findMany({});
  const user = {
    id: admin.id,
    name: admin.name,
    role: "Superadmin",
    permissions,
  };
  const token = signToken(user);
  const res = NextResponse.json({ ok: true, user, message:"Welcome back "+user.name });
  res.headers.set("Set-Cookie", setAuthCookie(token));
  return res;
}

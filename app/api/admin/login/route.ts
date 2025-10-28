import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { comparePassword, hashPassword } from "../../../../lib/hash";
import { signToken, setAuthCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin)
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  const match = await comparePassword(password, admin.password);
  if (!match)
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
const role = await prisma.role.findUnique({
  where: { id: admin.role },
  include: {
    RolePermission: {
      include: {
        permission: true, 
      },
    },
  },
});


const permissions = role.RolePermission.map((rp) => rp.permission);

  const token = signToken({
    id: admin.id,
    role: role.name,
    name: admin.name,
    permissions,
  });
  const user = { id: admin.id, role: role.name, name: admin.name, permissions };
  
  const res = NextResponse.json({ ok: true, user, message: "Logged in" });
  res.headers.set("Set-Cookie", setAuthCookie(token));

  return res;
}

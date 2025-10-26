import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { verifyToken } from "../../../../lib/auth";

export async function GET() {
  const list = await prisma.role.findMany({
    include: { RolePermission: { include: { permission: true } } },
  });

  // map permissions into an array for convenience
  const roles = list.map((r) => ({
    ...r,
    permissions: r.RolePermission?.map((rp) => rp.permission) || [],
  }));

  return NextResponse.json({ ok: true, list: roles, message: "Roles loaded" });
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token as string);
  if (!payload || (payload as any).role !== "Superadmin")
    return NextResponse.json({ ok: false, message:"Not authorized" }, { status: 403 });

  const body = await req.json();
  const { name } = body;
  const role = await prisma.role.create({ data: { name } });
  return NextResponse.json({ ok: true, role, message: "Role created" });
}

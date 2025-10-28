import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireSuperadmin } from "../../../../lib/api_middleware/auth";

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
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json();
  const { name } = body;
  const role = await prisma.role.create({ data: { name } });
  return NextResponse.json({ ok: true, role, message: "Role created" });
}

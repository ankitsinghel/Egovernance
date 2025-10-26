import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  const list = await prisma.role.findMany({
    include: { RolePermission: { include: { permission: true } } },
  });

  const roles = list.map((r) => ({
    ...r,
    permissions: r.RolePermission?.map((rp) => rp.permission) || [],
  }));

  return NextResponse.json({ ok: true, list: roles, message: "Roles loaded" });
}

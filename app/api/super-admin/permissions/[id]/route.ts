import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/api_middleware/auth";

export async function PUT(
  req: Request,
  context: RouteContext<"/api/super-admin/permissions/[id]">
) {
  const params = await context.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  const body = await req.json();
  const { name, description } = body;
  const perm = await prisma.permission.update({
    where: { id },
    data: { name, description },
  });
  return NextResponse.json({ ok: true, perm, message: "Permission updated" });
}

export async function DELETE(
  req: Request,
  context: RouteContext<"/api/super-admin/permissions/[id]">
) {
  const params = await context.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  await prisma.permission.delete({ where: { id } });
  return NextResponse.json({ ok: true, message: "Permission deleted" });
}

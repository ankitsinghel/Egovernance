import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { requireSuperadmin } from "../../../../../lib/api_middleware/auth";

export async function PUT(
  req: Request,
  props: { params: Record<string, string> | Promise<Record<string, string>> }
) {
  const params = await props.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  const body = await req.json();
  const { name } = body;
  const role = await prisma.role.update({ where: { id }, data: { name } });
  return NextResponse.json({ ok: true, role, message: "Role updated" });
}

export async function DELETE(
  req: Request,
  props: { params: Record<string, string> | Promise<Record<string, string>> }
) {
  const params = await props.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  await prisma.role.delete({ where: { id } });
  return NextResponse.json({ ok: true, message: "Role deleted" });
}

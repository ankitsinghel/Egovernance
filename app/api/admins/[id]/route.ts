import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireSuperadmin } from "../../../../lib/api_middleware/auth";

export async function PUT(
  req: Request,
  props: { params: Record<string, string> | Promise<Record<string, string>> }
) {
  const params = await props.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  const body = await req.json();
  const { name, email } = body;

  const data: { name?: string; email?: string } = { name, email };
  // if (departmentId !== undefined) data.departmentId = departmentId;
  // if (password) data.password = await hashPassword(password);

  const admin = await prisma.admin.update({ where: { id }, data });
  return NextResponse.json({ ok: true, admin });
}

export async function DELETE(
  req: Request,
  props: { params: Record<string, string> | Promise<Record<string, string>> }
) {
  const params = await props.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

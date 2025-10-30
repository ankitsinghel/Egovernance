import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireSuperadmin } from "../../../../lib/api_middleware/auth";

export async function PUT(
  req: Request,
  context: RouteContext<"/api/states/[id]">
) {
  const params = await context.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  const body = await req.json();
  const { name } = body;
  const state = await prisma.state.update({ where: { id }, data: { name } });
  return NextResponse.json({ ok: true, state });
}

export async function DELETE(
  req: Request,
  context: RouteContext<"/api/states/[id]">
) {
  const params = await context.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const id = Number(params.id);
  await prisma.state.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

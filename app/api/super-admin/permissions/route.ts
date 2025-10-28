import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireSuperadmin } from "../../../../lib/api_middleware/auth";

export async function GET() {
  const list = await prisma.permission.findMany();
  return NextResponse.json({ ok: true, list, message: "Permissions loaded" });
}

export async function POST(req: Request) {
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json();
  const { name, description } = body;
  const perm = await prisma.permission.create({ data: { name, description } });
  return NextResponse.json({ ok: true, perm, message: "Permission created" });
}

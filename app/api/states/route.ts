import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/api_middleware/auth";

export async function GET() {
  const list = await prisma.state.findMany();
  return NextResponse.json({
    ok: true,
    states: list,
    message: "States loaded",
  });
}

export async function POST(req: Request) {
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json();
  const { name } = body;
  const city = await prisma.state.create({ data: { name } });
  return NextResponse.json({ ok: true, city, message: "State created" });
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { verifyToken } from "../../../../lib/auth";

export async function GET() {
  const list = await prisma.permission.findMany();
  return NextResponse.json({ ok: true, list, message: "Permissions loaded" });
}

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token as string);
  if (!payload || (payload as any).role !== "Superadmin")
    return NextResponse.json({ ok: false }, { status: 403 });

  const body = await req.json();
  const { name, description } = body;
  const perm = await prisma.permission.create({ data: { name, description } });
  return NextResponse.json({ ok: true, perm, message: "Permission created" });
}

import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { verifyToken } from "../../../../../lib/auth";

export async function PUT(req: Request, props: any) {
  const params = await props.params;
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token as string);
  if (!payload || (payload as any).role !== "SuperAdmin")
    return NextResponse.json({ ok: false }, { status: 403 });

  const id = Number(params.id);
  const body = await req.json();
  const { name, description } = body;
  const perm = await prisma.permission.update({
    where: { id },
    data: { name, description },
  });
  return NextResponse.json({ ok: true, perm, message: "Permission updated" });
}

export async function DELETE(req: Request, props: any) {
  const params = await props.params;
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token as string);
  if (!payload || (payload as any).role !== "SuperAdmin")
    return NextResponse.json({ ok: false }, { status: 403 });

  const id = Number(params.id);
  await prisma.permission.delete({ where: { id } });
  return NextResponse.json({ ok: true, message: "Permission deleted" });
}

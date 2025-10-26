import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";
import { verifyToken } from "../../../../../../lib/auth";

export async function PUT(req: Request, props: any) {
  const params = await props.params;
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  const token = match?.[1];
  const payload = verifyToken(token as string);
  if (!payload || (payload as any).role !== "SuperAdmin")
    return NextResponse.json({ ok: false }, { status: 403 });

  const roleId = Number(params.id);
  const body = await req.json();
  const { permissionIds } = body;

  // Replace role's permissions atomically
  await prisma.$transaction([
    prisma.rolePermission.deleteMany({ where: { roleId } }),
    prisma.rolePermission.createMany({
      data: (permissionIds || []).map((pid: number) => ({
        roleId,
        permissionId: pid,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true, message: "Role permissions updated" });
}

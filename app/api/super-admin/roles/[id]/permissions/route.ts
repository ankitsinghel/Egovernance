import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";
import { requireSuperadmin } from "../../../../../../lib/api_middleware/auth";

export async function PUT(req: Request, props: any) {
  const params = await props.params;
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

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

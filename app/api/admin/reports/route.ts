import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireAuth } from "../../../../lib/api_middleware/auth";
import type { TokenPayloadT } from "../../../../lib/types";

export async function GET(req: Request) {
  const maybe = requireAuth(req);
  if (maybe instanceof NextResponse) return maybe;
  const payload = maybe as unknown as TokenPayloadT;
  const role = payload.role as string | undefined;
  const adminId = payload.id;

  // Admin sees dept/city assigned reports
  if (role === "SuperAdmin") {
    const reports = await prisma.userReport.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ ok: true, reports, message: "Reports loaded" });
  }

  const admin = await prisma.admin.findUnique({
    where: { id: Number(adminId) },
  });
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });
  const reports = await prisma.userReport.findMany({
    where: { departmentId: admin.departmentId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, reports, message: "Reports loaded" });
}

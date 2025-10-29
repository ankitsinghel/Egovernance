import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { requireSuperadmin } from "../../../lib/api_middleware/auth";

export async function GET() {
  const departments = await prisma.department.findMany();
  return NextResponse.json({
    ok: true,
    departments,
    message: "Departments loaded",
  });
}

export async function POST(req: Request) {
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const body = await req.json();
  const { name } = body;
  const dept = await prisma.department.create({ data: { name } });
  return NextResponse.json({
    ok: true,
    department: dept,
    message: "Department created",
  });
}

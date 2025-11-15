import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api_middleware/auth";
import { hashPassword } from "@/lib/hash";

export async function GET(req: Request) {
 
  const guard = requireAuth(req);
  if (guard instanceof NextResponse)
    return NextResponse.json({ ok: false, message: "Unauthorized" });
  
  const role = guard.role;

  if (role === "Superadmin") {
    const admins = await prisma.admin.findMany({
      where: {
        stateId: null,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ ok: true, admins, message: "Admins loaded" });
  } else if (role === "Central Admin") {
    const admins = await prisma.admin.findMany({
      where: {
        superiorId: Number(guard.id),
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json({ ok: true, admins, message: "Admins loaded" });
  }
  else{
    return NextResponse.json({ ok: false, role, message: "Unauthorized" });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, departmentId, role, stateId, superiorId } =
      body;

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json(
        { ok: false, error: "Email already exists" },
        { status: 409 }
      );

    const hashed = await hashPassword(password);
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashed,
        departmentId: (departmentId as number) || undefined,
        role,
        stateId,
        superiorId,
      },
    });
    return NextResponse.json({ ok: true, admin, message: "Admin created" });
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : String(err ?? "Server error");
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

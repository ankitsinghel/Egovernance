import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { requireSuperadmin } from "../../../lib/api_middleware/auth";
import { hashPassword } from "../../../lib/hash";

export async function GET(req: Request) {
  const guard = requireSuperadmin(req);
  if (guard instanceof NextResponse) return guard;

  const admins = await prisma.admin.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json({ ok: true, admins, message: "Admins loaded" });
}

export async function POST(req: Request) {
  try {
    // creation allowed (no auth required) or can be restricted elsewhere

    const body = await req.json();
    const {
      name,
      email,
      password,
      departmentId,
      city = null,
      role = "Admin",
      superiorId = null,
    } = body;

    // Prevent duplicate email
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
        departmentId: (departmentId as any) || undefined,
        city,
        role,
        superiorId,
      } as any,
    });
    return NextResponse.json({ ok: true, admin, message: "Admin created" });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, message: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

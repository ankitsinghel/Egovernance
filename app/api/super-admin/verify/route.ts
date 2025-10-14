import { NextResponse } from "next/server";
import { verifyOtp } from "../../../../lib/otp";
import { prisma } from "../../../../lib/db";
import { signToken, setAuthCookie } from "../../../../lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, token } = body;
  if (!email || !token) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });

  const res = await verifyOtp(email, "super-signup", token);
  if (!res.ok) return NextResponse.json({ ok: false, error: res.reason }, { status: 400 });

  const record = res.record;
  // parse meta
  let meta: any = null;
  try { meta = record.meta ? JSON.parse(record.meta) : null; } catch(e) { /* ignore */ }
  if (!meta) return NextResponse.json({ ok: false, error: "no_meta" }, { status: 500 });

  // ensure only one superadmin
  const adminCount = await prisma.superAdmin.count();
  if (adminCount > 0) return NextResponse.json({ ok: false, error: "super_exists" }, { status: 403 });

  // Admin requires an organization. Use an existing organization if present,
  // otherwise create a root organization for the SuperAdmin.
  let organizationId: number;
  const orgCount = await prisma.organization.count();
  if (orgCount === 0) {
    const org = await prisma.organization.create({ data: { name: 'Root Organization' } });
    organizationId = org.id;
  } else {
    const org = await prisma.organization.findFirst();
    organizationId = org!.id;
  }

  const superAdmin = await prisma.superAdmin.create({ data: { name: meta.name, email: meta.email, password: meta.passwordHash } });

  const jwtToken = signToken({ id: superAdmin.id, role: 'SuperAdmin' });
  const resp = NextResponse.json({ ok: true, admin: superAdmin });
  resp.headers.set('Set-Cookie', setAuthCookie(jwtToken));
  return resp;
}

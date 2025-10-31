import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { verifyOtp } from "../../../../lib/otp";
import { hashPassword } from "../../../../lib/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, token, newPassword } = body as {
      email?: string;
      token?: string;
      newPassword?: string;
    };
    if (!email || !token || !newPassword)
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 }
      );

    const ok = await verifyOtp(email, "forgot_password", token);
    if (!ok || !ok.ok)
      return NextResponse.json(
        { ok: false, error: "invalid_otp" },
        { status: 400 }
      );

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    const hashed = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("reset-password error", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { createOtp } from "../../../../lib/otp";
import { sendVerificationEmail } from "../../../../lib/email";
import { hashPassword } from "../../../../lib/hash";
import { prisma } from "../../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    // Prevent issuing a signup OTP if a SuperAdmin already exists
    const adminCount = await prisma.superAdmin.count();
    if (adminCount > 0) return NextResponse.json({ ok: false, error: "super_exists" }, { status: 403 });
    if (!email || !password || !name) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
    const hashed = await hashPassword(password);
    const meta = { name, email, passwordHash: hashed };
    const { token } = await createOtp(email, "super-signup", 15, meta);
    console.log(token)
    const sendResult = await sendVerificationEmail(email, token);
    console.log(sendResult)
    if (sendResult && sendResult.success === false) {
      return NextResponse.json({ ok: false, error: sendResult.message || "email_failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true, sendResult });
  } catch (err) {
    console.error("/api/super-admin/signup error", err);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

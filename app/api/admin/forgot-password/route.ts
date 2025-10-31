import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { createOtp } from "../../../../lib/otp";
import { sendOtpEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body as { email?: string };
    if (!email)
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 }
      );

    // Ensure admin exists (don't reveal via response)
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      // still return ok to avoid enumeration
      return NextResponse.json({ ok: true });
    }

    const { token } = await createOtp(email, "forgot_password", 10, {
      source: "forgot_password",
    });
    // fire-and-forget email send
    try {
      await sendOtpEmail(email, token, "forgot_password");
    } catch (e) {
      console.error("sendOtpEmail error", e);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("forgot-password error", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

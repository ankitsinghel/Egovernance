import { NextResponse } from "next/server";
import { createOtp } from "../../../../lib/otp";
import { sendOtpEmail } from "../../../../lib/email";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, purpose = "verification" } = body;
  if (!email) return NextResponse.json({ ok: false, error: "missing_email" }, { status: 400 });
  const { otp, token } = await createOtp(email, purpose);
  // send email (fire and forget)
  sendOtpEmail(email, token, purpose).catch((e) => console.error("sendOtpEmail failed", e));
  return NextResponse.json({ ok: true });
}

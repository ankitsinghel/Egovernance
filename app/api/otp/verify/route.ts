import { NextResponse } from "next/server";
import { verifyOtp } from "../../../../lib/otp";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, purpose = "verification", token } = body;
  if (!email || !token) return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  const res = await verifyOtp(email, purpose, token);
  if (!res.ok) return NextResponse.json({ ok: false, error: res.reason }, { status: 400 });
  return NextResponse.json({ ok: true });
}

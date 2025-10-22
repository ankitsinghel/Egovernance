import { NextResponse } from "next/server";
import { clearAuthCookie } from "../../../lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const res = NextResponse.json({ ok: true });
    // set cookie header to clear the auth cookie
    res.headers.set("Set-Cookie", clearAuthCookie());
    return res;
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 }
    );
  }
}

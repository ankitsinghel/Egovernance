import { NextResponse } from "next/server";
import { clearAuthCookie } from "../../../lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  try {
    globalThis?.logger?.info("Logout request received");
    const res = NextResponse.json({ ok: true, message: "Logged out" });
    // set cookie header to clear the auth cookie
    res.headers.set("Set-Cookie", clearAuthCookie());
    return res;
  } catch (e) {
    globalThis?.logger?.error({message:"Error during logout", error: e});
    return NextResponse.json(
      { ok: false, message: "Server error" },
      { status: 500 }
    );
  }
}

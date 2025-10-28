import { NextResponse } from "next/server";
import { verifyToken } from "../auth";

// Extract token from Request cookies
export function getTokenFromRequest(req: Request): string | undefined {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  return match?.[1];
}

export function requireSuperadmin(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  const role = (payload as any)?.role;
  const isSuper =
    typeof role === "string" && role.toLowerCase() === "superadmin";
  if (!payload || !isSuper) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  // success: do not return payload; this is a guard-only helper
  return;
}

export function requireAuth(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
  return payload;
}

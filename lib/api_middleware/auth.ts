import { NextResponse } from "next/server";
import { verifyToken } from "../auth";
import { User } from "../types";

// Extract token from Request cookies
export function getTokenFromRequest(req: Request): string | undefined {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/egov_token=([^;]+)/);
  return match?.[1];
}

export function requireSuperadmin(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  const role = (payload as User)?.role;
  const isSuper =
    typeof role === "string" && role.toLowerCase() === "superadmin";
  if (!payload || !isSuper) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  return;
}

export function requireCentralAdmin(req: Request) {
  const payload = requireAuth(req);
  const role = (payload as User)?.role;
  const isCentral =
    typeof role === "string" && role.toLowerCase() === "central admin";
  if (!payload || !isCentral) {
    return NextResponse.json(
      { ok: false, message: "You are not authorized" },
      { status: 403 }
    );
  }
  return payload as User;
}
export function requireAuth(req: Request) {
  const token = getTokenFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 });
  return payload;
}

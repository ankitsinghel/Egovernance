import { NextResponse } from "next/server";
import { parse } from "cookie";
import {
  requireAuth,
  getTokenFromRequest,
} from "../../../../lib/api_middleware/auth";

export async function GET(req: Request) {
  // development-only debug endpoint to see cookies server receives
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader || "");
  const token = getTokenFromRequest(req);
  const maybe = token ? requireAuth(req) : null;
  const payload = maybe instanceof NextResponse ? null : maybe;
  return NextResponse.json({
    ok: true,
    cookieHeader,
    cookies,
    token: !!token,
    payload,
  });
}

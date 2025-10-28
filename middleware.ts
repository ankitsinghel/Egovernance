import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/edgeAuth";
import type { User } from "@/lib/types";

const protectedRoutes = ["/super-admin/sa-dash"];
const adminProtectedRoutes = ["/admin/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("egov_token")?.value || null;

  let user: User | null = null;
  try {
    if (token) user = (await verifyTokenEdge(token)) as User;
  } catch {
    user = null;
  }

  const hasToken = !!user;
  let res: NextResponse;

  // 🔒 Redirect unauthenticated users trying to access protected routes
  if (!hasToken) {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/super-admin/login", req.url));
    }
    if (adminProtectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    // no token but accessing public page — allow
    res = NextResponse.next();
    res.headers.set("x-egov-middleware", "ok-anon");
    return res;
  }

  // ✅ Authenticated user logic
  if (user.role === "Superadmin") {
    // redirect if already logged in
    if (
      pathname.startsWith("/super-admin/login") ||
      pathname.startsWith("/super-admin/sign-up")
    ) {
      return NextResponse.redirect(
        new URL("/super-admin/sa-dash/dashboard", req.url)
      );
    }

    // prevent superadmin from accessing admin area
    if (pathname.startsWith("/admin/")) {
      return NextResponse.redirect(
        new URL("/super-admin/sa-dash/dashboard", req.url)
      );
    }
  } else {
    // regular admin routes
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // prevent admin from accessing super-admin area
    if (pathname.startsWith("/super-admin/")) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // default case — allow through
  res = NextResponse.next();
  res.headers.set("x-egov-middleware", "ok-auth");
  try {
    res.headers.set("x-egov-user", String(user?.id || ""));
  } catch {}
  return res;
}

export const config = {
  matcher: ["/super-admin/:path*", "/admin/:path*"],
};

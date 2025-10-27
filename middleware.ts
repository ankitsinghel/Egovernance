import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "./lib/edgeAuth"; //middleware renders on edge instead of node that's why we have to use a different library for checking pass

const protectedRoutes = ["/super-admin/sa-dash"];
const adminProtectedRoutes = ["/admin/dashboard/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("egov_token")?.value || null;
  const payload = await verifyTokenEdge(token);
  const user = payload as any;
  const hasToken = !!user;
  if (
    !hasToken &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/super-admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  if (hasToken){

    if (
      user.role == "Superadmin" &&
      (pathname.startsWith("/super-admin/login") ||
        pathname.startsWith("/super-admin/sign-up"))
      ) {
      const res = NextResponse.redirect(
        new URL("/super-admin/sa-dash/dashboard", req.url)
      );
        if (user.role == "admin" && pathname.startsWith("/admin/login")) {
          const res = NextResponse.redirect(
            new URL("/admin/dashboard", req.url)
          );
          res.headers.set("x-egov-middleware", "redirected-logged-in");
          return res;
        }
      res.headers.set("x-egov-middleware", "redirected-logged-in");
      return res;
    }


  }
  // Admin route protections
  if (
    !hasToken &&
    adminProtectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }


  const res = NextResponse.next();
  res.headers.set("x-egov-middleware", hasToken ? "ok-auth" : "ok-anon");
  if (hasToken) {
    // expose limited user info for debugging (do not leak sensitive data)
    try {
      res.headers.set("x-egov-user", String(user?.id || user?.sub || ""));
    } catch (e) {}
  }
  return res;
}

export const config = {
  matcher: ["/super-admin", "/super-admin/:path*", "/admin", "/admin/:path*"],
};

import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { prisma } from "./db";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import type { TokenPayloadT } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const COOKIE_NAME = "egov_token";

export function signToken(
  payload: JwtPayload | object,
  expiresIn = "7d"
): string {
  // Use jsonwebtoken types instead of casting to any
  return jwt.sign(
    payload as JwtPayload,
    JWT_SECRET as Secret,
    { expiresIn } as SignOptions
  );
}

export function verifyToken(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload | string;
  } catch (e) {
    return null;
  }
}

export function setAuthCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie() {
  return serialize(COOKIE_NAME, "", { maxAge: -1, path: "/" });
}

export async function getAdminFromToken(token: string | undefined) {
  if (!token) return null;
  const payloadRaw = verifyToken(token) as JwtPayload | string | null;
  if (!payloadRaw || typeof payloadRaw === "string") return null;

  const payload = payloadRaw as unknown as TokenPayloadT;

  const id = payload.id ?? (payload.sub as unknown as string | undefined);
  if (!id) return null;

  if (payload.role === "Superadmin") return payload;

  return payload;
}

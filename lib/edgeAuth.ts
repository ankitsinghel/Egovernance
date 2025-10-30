import { jwtVerify } from "jose";
import type { JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export async function verifyTokenEdge(
  token: string | undefined
): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const encoder = new TextEncoder();
    const secret = encoder.encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as JWTPayload;
  } catch (e) {
    return null;
  }
}

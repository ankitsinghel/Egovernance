import { prisma } from "./db";
import crypto from "crypto";

// Create an OTP record and return the plaintext token
export async function createOtp(email: string, purpose: string, ttlMinutes = 10, meta?: any) {
  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);
  const metaStr = meta ? JSON.stringify(meta) : null;
  const otp = await prisma.otp.create({
    data: { email, tokenHash, purpose, expiresAt, meta: metaStr },
  });
  return { otp, token };
}

// Verify OTP: returns true if valid and marks as used
export async function verifyOtp(email: string, purpose: string, token: string) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const record = await prisma.otp.findFirst({ where: { email, purpose, tokenHash } });
  if (!record) return { ok: false, reason: "not_found" };
  if (record.used) return { ok: false, reason: "used" };
  if (record.expiresAt < new Date()) return { ok: false, reason: "expired" };
  // mark used
  await prisma.otp.update({ where: { id: record.id }, data: { used: true } });
  return { ok: true, record };
}

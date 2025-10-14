import jwt from 'jsonwebtoken'
import { serialize, parse } from 'cookie'
import { prisma } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret'
const COOKIE_NAME = 'egov_token'

export function signToken(payload: object, expiresIn = '7d') {
  // jwt typings can be strict about the secret type; cast to any for simplicity here
  return (jwt as any).sign(payload, JWT_SECRET as any, { expiresIn } as any)
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any
  } catch (e) {
    return null
  }
}

export function setAuthCookie(token: string) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export function clearAuthCookie() {
  return serialize(COOKIE_NAME, '', { maxAge: -1, path: '/' })
}

export async function getAdminFromToken(token: string | undefined) {
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload?.id) return null
  if ((payload as any).role === 'SuperAdmin') {
    const sa = await prisma.superAdmin.findUnique({ where: { id: Number((payload as any).id) } })
    return sa
  }
  const admin = await prisma.admin.findUnique({ where: { id: Number((payload as any).id) } })
  return admin
}

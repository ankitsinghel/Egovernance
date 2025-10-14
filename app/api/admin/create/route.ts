import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { hashPassword } from '../../../../lib/hash'
import { verifyToken, signToken, setAuthCookie } from '../../../../lib/auth'

export async function POST(req: Request) {
  // Allow creating the first SuperAdmin without auth (initial setup).
  const adminCount = await prisma.admin.count()

  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)

  // If admins exist, require SuperAdmin auth for creating admins or organizations
  if (adminCount > 0) {
    if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })
  }

  const body = await req.json()
  const { name, email, password, organizationId, city, role = 'SuperAdmin', superiorId } = body

  // For initial creation, force role to SuperAdmin; if a SuperAdmin already exists, disallow creating another SuperAdmin
  let finalRole = role
  if (adminCount === 0) {
    finalRole = 'SuperAdmin'
  } else {
    // If attempting to create another SuperAdmin, reject
    if (role === 'SuperAdmin') {
      return NextResponse.json({ ok: false, error: 'SuperAdmin already exists' }, { status: 403 })
    }
  }

  // Prevent creating a duplicate admin for the same organizationId+city
  // Normalize city: treat empty string as null
  const normalizedCity = city === '' ? null : city
  const existing = await prisma.admin.findFirst({ where: { organizationId: organizationId, city: normalizedCity } })
  if (existing) {
    return NextResponse.json({ ok: false, error: 'An admin for this organization and city already exists' }, { status: 409 })
  }

  const hashed = await hashPassword(password)
  const admin = await prisma.admin.create({ data: { name, email, password: hashed, organizationId: organizationId, city, role: finalRole, superiorId } })

  // Auto-login: sign JWT and set httpOnly cookie for the created admin
  const jwtToken = signToken({ id: admin.id, role: admin.role })
  const res = NextResponse.json({ ok: true, admin })
  res.headers.set('Set-Cookie', setAuthCookie(jwtToken))
  return res
}

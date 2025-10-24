import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { verifyToken } from '../../../lib/auth'
import { hashPassword } from '../../../lib/hash'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  console.log(payload)
  if (!payload || (payload as any).role !== 'Superadmin') return NextResponse.json({ ok: false , message:"Error"}, { status: 403 })

  const admins = await prisma.admin.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json({ ok: true, admins })
}

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/egov_token=([^;]+)/)
    const token = match?.[1]
    const payload = verifyToken(token as string)
    // if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

    const body = await req.json()
    const { name, email, password, departmentId, city = null, role = 'Admin', superiorId = null } = body

    // Prevent duplicate email
    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 409 })

  const hashed = await hashPassword(password)
  const admin = await prisma.admin.create({ data: { name, email, password: hashed, departmentId: (departmentId as any) || undefined, city, role, superiorId } as any })
    return NextResponse.json({ ok: true, admin })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}

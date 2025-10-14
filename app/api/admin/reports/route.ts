import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 })
  const role = (payload as any).role
  const adminId = (payload as any).id

  // Admin sees org/city assigned reports
  if (role === 'SuperAdmin') {
    const reports = await prisma.userReport.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ ok: true, reports })
  }

  const admin = await prisma.admin.findUnique({ where: { id: Number(adminId) } })
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 })
  const reports = await prisma.userReport.findMany({ where: { organizationId: admin.organizationId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ ok: true, reports })
}

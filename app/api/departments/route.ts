import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'
import { verifyToken } from '../../../lib/auth'

export async function GET() {
  const departments = await prisma.department.findMany()
  return NextResponse.json({ ok: true, departments })
}

export async function POST(req: Request) {
  // Only SuperAdmin allowed - token in cookie
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

  const body = await req.json()
  const { name } = body
  const dept = await prisma.department.create({ data: { name } })
  return NextResponse.json({ ok: true, department: dept })
}

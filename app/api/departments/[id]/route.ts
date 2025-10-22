import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'

export async function PUT(req: Request, { params }: any) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

  const id = Number(params.id)
  const body = await req.json()
  const { name } = body
  const dept = await prisma.department.update({ where: { id }, data: { name } })
  return NextResponse.json({ ok: true, department: dept })
}

export async function DELETE(req: Request, { params }: any) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

  const id = Number(params.id)
  await prisma.department.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

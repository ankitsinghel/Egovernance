import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'
import { hashPassword } from '../../../../lib/hash'

export async function PUT(req: Request, props: any) {
  const params = await props.params;
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

  const id = Number(params.id)
  const body = await req.json()
  const { name, email, password, departmentId, city = null, role = 'Admin', superiorId = null } = body

  const data: any = { name, email, city, role, superiorId }
  if (departmentId !== undefined) data.departmentId = departmentId
  if (password) data.password = await hashPassword(password)

  const admin = await prisma.admin.update({ where: { id }, data })
  return NextResponse.json({ ok: true, admin })
}

export async function DELETE(req: Request, props: any) {
  const params = await props.params;
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload || (payload as any).role !== 'SuperAdmin') return NextResponse.json({ ok: false }, { status: 403 })

  const id = Number(params.id)
  await prisma.admin.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

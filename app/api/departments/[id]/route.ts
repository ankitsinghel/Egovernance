import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

import { verifyToken } from '../../../../lib/auth'


export async function PUT(req: Request, { params }: any) {
  const id = Number(params.id)
  const body = await req.json()
  const { name } = body
  if (!name) return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 })
  const dept = await prisma.department.update({ where: { id }, data: { name } })
  return NextResponse.json({ ok: true, dept })
}

export async function DELETE(req: Request, { params }: any) {
  const id = Number(params.id)
  await prisma.department.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

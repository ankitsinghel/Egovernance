import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function PUT(req: Request, { params }: any) {
  const id = Number(params.id)
  const body = await req.json()
  const { name } = body
  if (!name) return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 })
  const city = await prisma.city.update({ where: { id }, data: { name } })
  return NextResponse.json({ ok: true, city })
}

export async function DELETE(req: Request, { params }: any) {
  const id = Number(params.id)
  await prisma.city.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

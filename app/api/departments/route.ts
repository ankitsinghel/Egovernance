import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET(req: Request) {
  // Query params: q (search), sort (name.asc|name.desc), limit, offset
  const url = new URL(req.url)
  const q = url.searchParams.get('q') || ''
  const sort = url.searchParams.get('sort') || 'name.asc'
  const limit = Number(url.searchParams.get('limit') || '10')
  const offset = Number(url.searchParams.get('offset') || '0')

  const where = q
    ? { name: { contains: q, mode: 'insensitive' } }
    : {}

  const [total, items] = await Promise.all([
    prisma.department.count({ where }),
    prisma.department.findMany({
      where,
      orderBy: sort === 'name.desc' ? { name: 'desc' } : { name: 'asc' },
      take: limit,
      skip: offset,
    }),
  ])

  return NextResponse.json({ ok: true, total, items })
}

export async function POST(req: Request) {
  const body = await req.json()
  console.log(body)
  const { name } = body
  if (!name) return NextResponse.json({ ok: false, error: 'name required' }, { status: 400 })
  const dept = await prisma.department.create({ data: { name } })
  return NextResponse.json({ ok: true, dept })
}

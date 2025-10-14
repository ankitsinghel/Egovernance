import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET() {
  const count = await prisma.admin.count()
  return NextResponse.json({ ok: true, count })
}

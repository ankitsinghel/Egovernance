import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'

export async function GET(req: Request, { params }: any) {
  const { trackingId } = params
  const report = await prisma.userReport.findUnique({ where: { trackingId }, include: { actions: true } })
  if (!report) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 })
  // Do not return any IP or PII; files are stored encrypted paths
  return NextResponse.json({ ok: true, report })
}

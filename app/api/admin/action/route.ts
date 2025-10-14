import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/db'
import { verifyToken } from '../../../../lib/auth'
import { parseForm, moveAndEncryptFile } from '../../../../lib/upload'

export async function POST(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.match(/egov_token=([^;]+)/)
  const token = match?.[1]
  const payload = verifyToken(token as string)
  if (!payload) return NextResponse.json({ ok: false }, { status: 401 })
  const adminId = (payload as any).id

  const { fields, files } = await parseForm(req as any)
  const reportId = Number(fields.reportId)
  const statusChange = fields.status
  const note = fields.note

  let proofPath = null
  if (files && files.proof) {
    proofPath = moveAndEncryptFile(files.proof)
  }

  // update report
  await prisma.userReport.update({ where: { id: reportId }, data: { status: statusChange } })
  const action = await prisma.actionLog.create({ data: { reportId, adminId: Number(adminId), statusChange, note, proofFile: proofPath } })
  return NextResponse.json({ ok: true, action })
}

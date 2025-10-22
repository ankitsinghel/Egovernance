import { NextResponse } from 'next/server'
import { parseForm, moveAndEncryptFile } from '../../../lib/upload'
import { prisma } from '../../../lib/db'
import { generateTrackingId } from '../../../lib/hash'
import { sendNewReportNotification } from '../../../lib/email'

export const runtime = 'edge'

export async function POST(req: Request) {
  // parse multipart form
  const { fields, files } = await parseForm(req as any)
  const dept = fields.department || 'Unknown'
  const designation = fields.designation
  const accusedName = fields.accusedName
  const city = fields.city
  const description = fields.description || ''

  const trackingId = generateTrackingId()

  // handle files
  const savedFiles: string[] = []
  if (files && Object.keys(files).length) {
    const fileEntries = Array.isArray(files.file) ? files.file : [files.file]
    for (const f of fileEntries) {
      if (!f) continue
      try {
        const dest = moveAndEncryptFile(f)
        savedFiles.push(dest)
      } catch (e) {
        console.error('file save error', e)
      }
    }
  }

  // determine priority and assignment
  let priority = 'normal'
  // simple heuristic: if description contains words like 'bribe', escalate
  const descLower = description.toLowerCase()
  if (descLower.includes('bribe') || descLower.includes('assault') || descLower.includes('fraud')) {
    priority = 'high'
  }

  // find matching admin
  let assignedAdmin = null
  if (dept) {
  // try exact city match first
  // find department by name
    const deptRec = await prisma.department.findUnique({ where: { name: dept } })
    if (deptRec) {
      assignedAdmin = await prisma.admin.findFirst({ where: { departmentId: deptRec.id, city: city || undefined } })
      if (!assignedAdmin) {
        assignedAdmin = await prisma.admin.findFirst({ where: { departmentId: deptRec.id } })
      }
    }
  }

  if (assignedAdmin && assignedAdmin.department === dept && assignedAdmin.city === city) {
    // same office reported against their own dept -> escalate
    priority = 'critical'
    // route to superior if exists
    if (assignedAdmin.superiorId) {
      assignedAdmin = await prisma.admin.findUnique({ where: { id: assignedAdmin.superiorId } })
    }
  }

  if (!assignedAdmin) {
    // fallback to SuperAdmin
    assignedAdmin = await prisma.admin.findFirst({ where: { role: 'SuperAdmin' } })
  }

  const report = await prisma.userReport.create({
    data: {
      trackingId,
  departmentId: dept ? (await prisma.department.findUnique({ where: { name: dept } }))?.id || null : null,
      designation,
      accusedName,
      city,
      description,
      files: savedFiles.length ? JSON.stringify(savedFiles) : null,
      priority,
      assignedToId: assignedAdmin?.id || null,
    },
  })

  // notify assigned admin
    if (assignedAdmin && assignedAdmin.email) {
    await sendNewReportNotification(assignedAdmin.email, trackingId, dept, city)
  }

  return NextResponse.json({ ok: true, trackingId })
}

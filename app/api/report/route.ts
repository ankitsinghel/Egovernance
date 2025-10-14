import { NextResponse } from 'next/server'
import { parseForm, moveAndEncryptFile } from '../../../lib/upload'
import { prisma } from '../../../lib/db'
import { generateTrackingId } from '../../../lib/hash'
import { sendNewReportNotification } from '../../../lib/email'

export const runtime = 'edge'

export async function POST(req: Request) {
  // parse multipart form
  const { fields, files } = await parseForm(req as any)
  const org = fields.organization || 'Unknown'
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
  if (org) {
    // try exact city match first
    // find organization by name
    const orgRec = await prisma.organization.findUnique({ where: { name: org } })
    if (orgRec) {
      assignedAdmin = await prisma.admin.findFirst({ where: { organizationId: orgRec.id, city: city || undefined } })
      if (!assignedAdmin) {
        assignedAdmin = await prisma.admin.findFirst({ where: { organizationId: orgRec.id } })
      }
    }
  }

  if (assignedAdmin && assignedAdmin.organization === org && assignedAdmin.city === city) {
    // same office reported against their own org -> escalate
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
      organizationId: org ? (await prisma.organization.findUnique({ where: { name: org } }))?.id || null : null,
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
    await sendNewReportNotification(assignedAdmin.email, trackingId, org, city)
  }

  return NextResponse.json({ ok: true, trackingId })
}

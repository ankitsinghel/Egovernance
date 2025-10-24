import { NextResponse } from "next/server";
import { parseForm, moveAndEncryptFile } from "../../../lib/upload";
import { prisma } from "../../../lib/db";
import { generateTrackingId } from "../../../lib/hash";
import { sendNewReportNotification } from "../../../lib/email";



export async function POST(req: Request) {
  try {
    
    const { fields, files } = await parseForm(req as any);


    const deptId = Number(fields.department) || null;
    const designation = fields.designation || null;
    const accusedName = fields.accusedName || null;
    const stateIdRaw = Number(fields.state);
    const description = fields.description || "";

    const trackingId = await generateTrackingId();

    const savedFiles: string[] = [];
    if (files && Object.keys(files).length) {
      const fileEntries = Array.isArray(files.file) ? files.file : [files.file];
      for (const f of fileEntries) {
        if (!f) continue;
        try {
          const dest = moveAndEncryptFile(f);
          savedFiles.push(dest);
        } catch (e) {
          console.error("file save error", e);
        }
      }
    }

    let priority = "normal";
    const descLower = String(description).toLowerCase();
    if (
      descLower.includes("bribe") ||
      descLower.includes("assault") ||
      descLower.includes("fraud")
    ) {
      priority = "high";
    }

    const dept = await prisma.department.findUnique({
      where: { id: deptId },
    });
    const stateRec = stateIdRaw
      ? await prisma.state.findUnique({ where: { id: Number(stateIdRaw) } })
      : null;

    let assignedAdmin = null;
    if (dept) {
      if (stateRec) {
        assignedAdmin = await prisma.admin.findFirst({
          where: { departmentId: dept.id, stateId: stateRec.id },
        });
      }
      if (!assignedAdmin) {
        assignedAdmin = await prisma.admin.findFirst({
          where: { departmentId: dept.id },
        });
      }
    }
    if (
      assignedAdmin &&
      dept &&
      assignedAdmin.departmentId === dept.id &&
      assignedAdmin.stateId === (stateRec ? stateRec.id : undefined)
    ) {
      if (assignedAdmin.superiorId) {
        assignedAdmin = await prisma.admin.findUnique({
          where: { id: assignedAdmin.superiorId },
        });
      }
    }

    if (!assignedAdmin) {
      assignedAdmin = await prisma.superAdmin.findFirst();
    }
  
    const report = await prisma.userReport.create({
      data: {
        trackingId,
        departmentId: dept ? dept.id : null,
        designation,
        accusedName,
        stateId: stateRec ? stateRec.id : null,
        description,
        files: savedFiles.length ? JSON.stringify(savedFiles) : null,
        assignedToId: assignedAdmin?.id || null,
      },
    });

    if (assignedAdmin && assignedAdmin.email) {
      await sendNewReportNotification(
        assignedAdmin.email,
        trackingId,
        dept.name,
        stateRec ? stateRec.name : undefined
      );
    }

    return NextResponse.json({ ok: true, trackingId });
  } catch (err) {
    console.error("report POST error", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

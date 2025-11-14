import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { generateTrackingId } from "../../../lib/hash";
import { sendNewReportNotification } from "../../../lib/email";
import { uploadFile } from "@/lib/fileHandle";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];
    const department = Number(formData.get("department"));
    const state = Number(formData.get("state"));
    const designation = String(formData.get("designation"));
    const description = String(formData.get("description"));
    const accusedName = String(formData.get("accusedName"));
    formData.forEach((i) => console.log(i));
    const trackingId = await generateTrackingId();

    for (const file of files) {
      const cleanName = file.name.replace(/\s+/g, "_");
      const renamedFile = new File([file], cleanName, { type: file.type });

      await uploadFile(renamedFile, trackingId);
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
      where: { id: department },
    });
    const stateRec = state
      ? await prisma.state.findUnique({ where: { id: state } })
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
        // files: savedFiles.length ? JSON.stringify(savedFiles) : null,
        assignedToId: assignedAdmin?.id || null,
      },
    });
    for (const file of files) {
      await prisma.reportfiles.create({
        data: {
          reportId: trackingId,
          filePath: file.name,
        },
      });
    }

    if (assignedAdmin && assignedAdmin.email) {
      await sendNewReportNotification(
        assignedAdmin.email,
        trackingId,
        dept.name,
        stateRec ? stateRec.name : undefined
      );
    }

    return NextResponse.json({
      ok: true,
      trackingId,
      message: "Report created",
    });
  } catch (err) {
    console.error("report POST error", err);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

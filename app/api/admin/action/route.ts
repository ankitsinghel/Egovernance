import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireAuth } from "../../../../lib/api_middleware/auth";
import { parseForm, moveAndEncryptFile } from "../../../../lib/upload";
import type { TokenPayloadT } from "../../../../lib/types";

export async function POST(req: Request) {
  const maybe = requireAuth(req);
  if (maybe instanceof NextResponse) return maybe;
  const payload = maybe as unknown as TokenPayloadT;
  const adminId = payload.id;

  const { fields, files } = await parseForm(req);
  const reportId = Number(fields.reportId);
  const statusChangeRaw = fields.status;
  const noteRaw = fields.note;
  const statusChange = Array.isArray(statusChangeRaw)
    ? String(statusChangeRaw[0])
    : String(statusChangeRaw ?? "");
  const note = Array.isArray(noteRaw)
    ? String(noteRaw[0])
    : String(noteRaw ?? "");

  let proofPath: string | null = null;
  if (files && files.proof) {
    const proofEntry = Array.isArray(files.proof)
      ? files.proof[0]
      : files.proof;
    if (proofEntry) proofPath = moveAndEncryptFile(proofEntry);
  }

  // update report
  await prisma.userReport.update({
    where: { id: reportId },
    data: { status: statusChange },
  });
  const action = await prisma.actionLog.create({
    data: {
      reportId,
      adminId: Number(adminId),
      statusChange,
      note,
      proofFile: proofPath,
    },
  });
  return NextResponse.json({ ok: true, action });
}

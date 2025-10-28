import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { requireAuth } from "../../../../lib/api_middleware/auth";
import { parseForm, moveAndEncryptFile } from "../../../../lib/upload";

export async function POST(req: Request) {
  const maybe = requireAuth(req);
  if (maybe instanceof NextResponse) return maybe;
  const payload = maybe;
  const adminId = (payload as any).id;

  const { fields, files } = await parseForm(req as any);
  const reportId = Number(fields.reportId);
  const statusChange = fields.status;
  const note = fields.note;

  let proofPath = null;
  if (files && files.proof) {
    proofPath = moveAndEncryptFile(files.proof);
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

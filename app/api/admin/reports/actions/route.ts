import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { requireAuth } from "../../../../../lib/api_middleware/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { User } from "@/lib/types";

export async function POST(req: Request) {
  const maybe = requireAuth(req);
  if (maybe instanceof NextResponse) return maybe;
  const payload = maybe as User;

  try {
    const formData = await req.formData();
    const trackingId = String(formData.get("trackingId") || "");
    const note = formData.get("description")?.toString() ?? null;
    const statusChangeRaw = formData.get("statusChange");
    const statusChange =
      statusChangeRaw !== null && statusChangeRaw !== undefined
        ? Number(statusChangeRaw.toString())
        : null;
    const file = formData.get("file") as File | null;

    if (!trackingId)
      return NextResponse.json(
        { ok: false, message: "trackingId required" },
        { status: 400 }
      );

    const report = await prisma.userReport.findUnique({
      where: { trackingId },
    });
    if (!report)
      return NextResponse.json(
        { ok: false, message: "report not found" },
        { status: 404 }
      );

    const action = await prisma.actionLog.create({
      data: {
        reportId: report.id,
        adminId: Number(payload.id),
        statusChange: statusChange ?? report.status,
        note: note ?? null,
      },
    });

    let proofUrl: string | null = null;

    if (file && file.size) {
      const path = `${trackingId}/actions/${action.id}/${file.name}`;
      const { data: upData, error: upError } = await supabaseAdmin.storage
        .from("Complaints")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (upError) {
        console.log("Supabase upload error", upError);
      } else {
        const { data: publicData } = supabaseAdmin.storage
          .from("Complaints")
          .getPublicUrl(path);
        proofUrl = publicData?.publicUrl ?? null;
        await prisma.actionLog.update({
          where: { id: action.id },
          data: { proofFile: proofUrl },
        });
      }
    }

    // Update report status to reflect new action's statusChange (if provided)
    if (statusChange !== null && !Number.isNaN(statusChange)) {
      await prisma.userReport.update({
        where: { id: report.id },
        data: { status: statusChange },
      });
    }

    const actionWithProof = { ...action, proofFile: proofUrl };
    return NextResponse.json({ ok: true, action: actionWithProof });
  } catch (err) {
    console.log("Add action error", err);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

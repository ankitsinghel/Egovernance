import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getFiles } from "@/lib/fileHandle";
import { totalReports } from "@/observability/prom-client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  try {
     totalReports.inc({ method: "GET", route: "/api/report/", code: "200" });
    // console.log(req);
    const { trackingId } = await context.params;
    // fetch report (without files from DB) and list files from Supabase storage
    const report = await prisma.userReport.findUnique({
      where: { trackingId },
      include: { actions: true },
    });

    if (!report)
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );

    const filesFromSupabase = await getFiles(trackingId);
    const reportWithFiles = { ...report, files: filesFromSupabase };

    return NextResponse.json({
      ok: true,
      report: reportWithFiles,
      message: "Report found",
    });
  } catch (error) {
      totalReports.inc({ method: "GET", route: "/api/report/", code: "500" });
    console.log("Get tracking id error", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  try {
    // console.log(req);
    const { trackingId } = await context.params;
    // fetch report (without files from DB) and list files from Supabase storage
    const report = await prisma.userReport.findUnique({
      where: { trackingId },
      include: { actions: true },
    });

    const { data, error } = await supabaseAdmin.storage
      .from("Complaints")
      .list(`${trackingId}`, {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) {
      console.log("Supabase list error:", error);
    }
    if (!report)
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );

    // Transform Supabase storage listing into the shape consumed by the frontend
    const filesFromSupabase = (data || []).map((f, idx) => {
      const path = `${trackingId}/${f.name}`;
      const { data: publicUrlData } = supabaseAdmin.storage
        .from("Complaints")
        .getPublicUrl(path);
      return {
        id: idx + 1,
        name: f.name,
        filePath: publicUrlData?.publicUrl ?? path,
      };
    });

    // Attach Supabase files to the returned report object so frontend can use report.files
    const reportWithFiles = { ...report, files: filesFromSupabase };

    return NextResponse.json({
      ok: true,
      report: reportWithFiles,
      message: "Report found",
    });
  } catch (error) {
    console.log("Get tracking id error", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

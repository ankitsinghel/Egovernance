import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ trackingId: string }> }
) {
  try {
    console.log(req);
    const { trackingId } = await context.params;
    console.log(trackingId);

    const report = await prisma.userReport.findUnique({
      where: { trackingId },
      include: { actions: true },
    });

    if (!report)
      return NextResponse.json(
        { ok: false, message: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({ ok: true, report, message: "Report found" });
  } catch (error) {
    console.log("Get tracking id error", error);
    return NextResponse.json(
      { ok: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    console.log(req);
    const { trackingId } = params;
    console.log(trackingId);

    const report = await prisma.userReport.findUnique({
      where: { trackingId },
      include: { actions: true },
    });

    if (!report)
      return NextResponse.json(
        { ok: false, error: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({ ok: true, report });
  } catch (error) {
    console.log("Get tracking id error", error);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

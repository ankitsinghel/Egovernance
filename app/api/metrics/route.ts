import { prisma } from "../../../../lib/db";
import { performance } from "perf_hooks";

export async function GET() {
  const start = performance.now();

  const q1Start = performance.now();
  // Representative cheap query: total reports
  const reportsCount = await prisma.userReport.count();
  const q1End = performance.now();

  const q2Start = performance.now();
  // Representative moderate query: recent actions (select limited fields)
  const recentActions = await prisma.actionLog.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      note: true,
      createdAt: true,
      statusChange: true,
      adminId: true,
    },
  });
  const q2End = performance.now();

  const q3Start = performance.now();
  // Representative aggregation: counts by status
  // groupBy requires prisma version with groupBy support
  let statusCounts: Array<{ status: number; _count: { _all: number } }> = [];
  try {
    // @ts-ignore - groupBy types may vary across prisma versions
    statusCounts = await prisma.userReport.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  } catch (e) {
    // fallback: basic grouped counts via raw query or multiple queries
    // keep statusCounts empty if groupBy not supported in runtime
    statusCounts = [];
  }
  const q3End = performance.now();

  const totalEnd = performance.now();

  const payload = {
    serverTime: new Date().toISOString(),
    timings: {
      q1_reportsCount_ms: Math.round(q1End - q1Start),
      q2_recentActions_ms: Math.round(q2End - q2Start),
      q3_statusCounts_ms: Math.round(q3End - q3Start),
      total_ms: Math.round(totalEnd - start),
    },
    summary: {
      reportsCount,
      recentActionsCount: recentActions.length,
      statusCounts,
    },
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // no caching for metrics endpoints
      "cache-control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import { register } from "@/observability/metrics";
import { totalReports } from "@/observability/prom-client";

export async function GET() {
  const metrics = await register.metrics();
  totalReports.inc({ method: "GET", route: "/api/metrics", code: "200" });
  return new NextResponse(metrics, {
    status: 200,
    headers: {
      "Content-Type": register.contentType,
    },
  });
}

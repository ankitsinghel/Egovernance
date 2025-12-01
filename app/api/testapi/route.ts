import { NextResponse } from "next/server";
import { totalReports } from "@/observability/prom-client";
export async function GET() {
  try {
    // totalReports.inc({
    //   method: "GET",
    //   route: "/api/testapi",
    //   code: "200",
    // });
    globalThis?.logger?.info({
      meta: {
        requestId: "testapi-route-get",
        extra: "this is test api route",
      },
      message: " request received in testapi route",
    });
    return NextResponse.json({ ok: true, message: "working " });
  } catch (error) {
    globalThis?.logger?.error({
      meta: {
        requestId: "testapi-route-get-error",
        error: error instanceof Error ? error.message : String(error),
      },
      message: "error in testapi route",
    });
  }
}

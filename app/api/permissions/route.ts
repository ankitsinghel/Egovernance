import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  const list = await prisma.permission.findMany();
  return NextResponse.json({ ok: true, list, message: "Permissions loaded" });
}

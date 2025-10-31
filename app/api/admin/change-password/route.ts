import { NextResponse } from "next/server";
import { getAdminFromToken } from "../../../../lib/auth";
import { prisma } from "../../../../lib/db";
import { comparePassword, hashPassword } from "../../../../lib/hash";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/egov_token=([^;]+)/);
    const token = match?.[1];
    const adminPayload = await getAdminFromToken(token || undefined);
    if (!adminPayload)
      return NextResponse.json({ ok: false, error: "unauth" }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = body as {
      currentPassword?: string;
      newPassword?: string;
    };
    if (!currentPassword || !newPassword)
      return NextResponse.json(
        { ok: false, error: "invalid_input" },
        { status: 400 }
      );

    const adminId = Number(
      (adminPayload as any).id || (adminPayload as any).sub
    );
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin)
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 }
      );

    const matchPwd = await comparePassword(currentPassword, admin.password);
    if (!matchPwd)
      return NextResponse.json(
        { ok: false, error: "wrong_password" },
        { status: 401 }
      );

    const hashed = await hashPassword(newPassword);
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("change-password error", e);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}

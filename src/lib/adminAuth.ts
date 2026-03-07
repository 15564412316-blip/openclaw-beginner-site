import { NextResponse } from "next/server";

export function getAdminTokenFromRequest(req: Request) {
  return req.headers.get("x-admin-token")?.trim() ?? "";
}

export function verifyAdminTokenOrResponse(req: Request) {
  const expected = process.env.ADMIN_REVIEW_TOKEN?.trim() ?? "";
  const provided = getAdminTokenFromRequest(req);

  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "服务端未配置 ADMIN_REVIEW_TOKEN。" },
      { status: 500 }
    );
  }

  if (!provided || provided !== expected) {
    return NextResponse.json(
      { ok: false, message: "后台口令错误或缺失。" },
      { status: 401 }
    );
  }

  return null;
}

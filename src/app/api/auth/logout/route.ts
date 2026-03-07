import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true, message: "已退出登录。" }, { status: 200 });
  res.cookies.set("oc_user_phone", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

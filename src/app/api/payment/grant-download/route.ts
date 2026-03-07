import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  orderNo?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const orderNo = (body.orderNo ?? "").trim();
    if (!orderNo) {
      return NextResponse.json({ ok: false, message: "缺少订单号。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("order_no,plan,status")
      .eq("order_no", orderNo)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json({ ok: false, message: "订单不存在。" }, { status: 404 });
    }
    if (data.plan !== "auto_49") {
      return NextResponse.json({ ok: false, message: "当前订单不支持脚本下载。" }, { status: 403 });
    }
    if (data.status !== "paid_confirmed") {
      return NextResponse.json({ ok: false, message: "订单未支付成功。" }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true, message: "下载权限已授予。" }, { status: 200 });
    res.cookies.set("oc_download_order_no", orderNo, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 2 * 60 * 60,
    });
    return res;
  } catch (error) {
    console.error("grant download failed:", error);
    return NextResponse.json({ ok: false, message: "授权下载失败。" }, { status: 500 });
  }
}

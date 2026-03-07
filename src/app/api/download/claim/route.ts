import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { cookies } from "next/headers";

type Payload = {
  platform?: "mac" | "win" | string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const platform = (body.platform ?? "").trim();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = req.headers.get("user-agent") || null;
    const cookieStore = await cookies();
    const orderNo = cookieStore.get("oc_download_order_no")?.value?.trim() ?? "";

    if (!platform) {
      return NextResponse.json(
        { ok: false, message: "缺少平台参数。" },
        { status: 400 }
      );
    }
    if (!orderNo) {
      return NextResponse.json(
        { ok: false, message: "下载权限不存在，请先在支付页完成支付并刷新状态。" },
        { status: 403 }
      );
    }
    if (!["mac", "win"].includes(platform)) {
      return NextResponse.json(
        { ok: false, message: "平台参数无效。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("order_no,plan,status")
      .eq("order_no", orderNo)
      .limit(1)
      .maybeSingle();
    if (orderErr) {
      throw orderErr;
    }
    if (!order) {
      return NextResponse.json(
        { ok: false, message: "订单不存在，请检查订单号。" },
        { status: 404 }
      );
    }
    if (order.plan !== "auto_49") {
      return NextResponse.json(
        { ok: false, message: "仅自动安装订单可下载脚本。" },
        { status: 403 }
      );
    }
    if (order.status !== "paid_confirmed") {
      return NextResponse.json(
        { ok: false, message: "订单未支付成功，暂不可下载。" },
        { status: 403 }
      );
    }

    const { error: claimErr } = await supabase.from("download_claims").insert({
      order_no: orderNo,
      plan: order.plan,
      platform,
      claimed_ip: ip,
      claimed_user_agent: userAgent,
    });

    if (claimErr) {
      if (claimErr.code === "23505") {
        return NextResponse.json(
          { ok: false, message: "该订单已下载过一次。如需再次下载，请重新购买或联系人工。", code: "ALREADY_USED" },
          { status: 409 }
        );
      }
      throw claimErr;
    }

    const fileUrl =
      platform === "mac"
        ? "/downloads/openclaw-installer.sh"
        : "/downloads/openclaw-installer.ps1";

    const res = NextResponse.json(
      { ok: true, fileUrl, orderNo, platform },
      { status: 200 }
    );
    res.cookies.set("oc_download_order_no", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    return res;
  } catch (error) {
    console.error("download claim failed:", error);
    const msg = String((error as { message?: string })?.message ?? "");
    if (msg.includes("download_claims")) {
      return NextResponse.json(
        { ok: false, message: "请先执行数据库迁移：docs/supabase-migration-download-lock-v1.sql" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { ok: false, message: "领取下载失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

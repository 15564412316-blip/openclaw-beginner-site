import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Ctx = {
  params: Promise<{ orderNo: string }>;
};

export async function GET(req: Request, ctx: Ctx) {
  try {
    const cookieStore = await cookies();
    const phone = cookieStore.get("oc_user_phone")?.value ?? "";
    if (!phone) {
      return NextResponse.json({ ok: false, message: "请先登录。" }, { status: 401 });
    }

    const { orderNo } = await ctx.params;
    const url = new URL(req.url);
    const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ ok: false, message: "缺少邮箱参数。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select(
        "id,order_no,email,wechat,plan,amount,channel,status,created_at,paid_at,reviewed_note"
      )
      .eq("order_no", orderNo)
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (orderErr) {
      throw orderErr;
    }
    if (!order) {
      return NextResponse.json({ ok: false, message: "订单不存在。" }, { status: 404 });
    }

    const { data: claim, error: claimErr } = await supabase
      .from("download_claims")
      .select("claimed_at,platform")
      .eq("order_no", orderNo)
      .limit(1)
      .maybeSingle();
    if (claimErr) {
      throw claimErr;
    }

    return NextResponse.json(
      {
        ok: true,
        order,
        downloadClaimed: Boolean(claim),
        downloadClaim: claim ?? null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("user order detail failed:", error);
    return NextResponse.json({ ok: false, message: "查询订单详情失败。" }, { status: 500 });
  }
}

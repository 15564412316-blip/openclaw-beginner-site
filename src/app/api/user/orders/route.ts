import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const phone = cookieStore.get("oc_user_phone")?.value ?? "";
    if (!phone) {
      return NextResponse.json({ ok: false, message: "请先登录。" }, { status: 401 });
    }

    const url = new URL(req.url);
    const email = (url.searchParams.get("email") ?? "").trim();
    if (!email) {
      return NextResponse.json({ ok: false, message: "请输入邮箱。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "order_no,plan,amount,channel,status,created_at,paid_at,reviewed_note"
      )
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      throw error;
    }

    const orders = data ?? [];
    const orderNos = orders.map((item) => item.order_no).filter(Boolean);
    let claimedMap = new Map<string, { claimed_at: string; platform: string }>();
    if (orderNos.length > 0) {
      const { data: claims, error: claimsErr } = await supabase
        .from("download_claims")
        .select("order_no,claimed_at,platform")
        .in("order_no", orderNos);
      if (claimsErr) {
        throw claimsErr;
      }
      claimedMap = new Map(
        (claims ?? []).map((c) => [String(c.order_no), { claimed_at: c.claimed_at, platform: c.platform }])
      );
    }

    const enhanced = orders.map((item) => {
      const claim = claimedMap.get(String(item.order_no));
      return {
        ...item,
        download_claimed: Boolean(claim),
        download_claim: claim ?? null,
      };
    });

    return NextResponse.json(
      { ok: true, orders: enhanced, phone, email },
      { status: 200 }
    );
  } catch (error) {
    console.error("user orders failed:", error);
    return NextResponse.json(
      { ok: false, message: "查询订单失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

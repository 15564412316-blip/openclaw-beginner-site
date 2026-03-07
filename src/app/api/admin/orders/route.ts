import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { verifyAdminTokenOrResponse } from "@/lib/adminAuth";

export async function GET(req: Request) {
  try {
    const denied = verifyAdminTokenOrResponse(req);
    if (denied) {
      return denied;
    }

    const url = new URL(req.url);
    const status = (url.searchParams.get("status") ?? "pending_review").trim();
    const q = (url.searchParams.get("q") ?? "").trim();

    const allowed = ["pending_review", "paid_confirmed", "rejected"];
    if (!allowed.includes(status)) {
      return NextResponse.json(
        { ok: false, message: "状态参数无效。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    let query = supabase
      .from("orders")
      .select(
        "id,order_no,email,wechat,plan,amount,channel,payer_note,status,created_at,reviewed_by,reviewed_note,reviewed_at"
      )
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(100);

    if (q) {
      query = query.or(`order_no.ilike.%${q}%,email.ilike.%${q}%,wechat.ilike.%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { ok: true, orders: data ?? [] },
      { status: 200 }
    );
  } catch (error) {
    console.error("admin list orders failed:", error);
    return NextResponse.json(
      { ok: false, message: "获取订单失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

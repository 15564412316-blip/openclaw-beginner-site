import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { verifyAdminTokenOrResponse } from "@/lib/adminAuth";

export async function GET(req: Request) {
  try {
    const denied = verifyAdminTokenOrResponse(req);
    if (denied) {
      return denied;
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id,order_no,email,wechat,plan,amount,channel,payer_note,status,created_at"
      )
      .eq("status", "pending_review")
      .order("created_at", { ascending: false })
      .limit(100);

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

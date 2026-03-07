import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderNo = (url.searchParams.get("orderNo") ?? "").trim();
    if (!orderNo) {
      return NextResponse.json(
        { ok: false, message: "缺少 orderNo 参数。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .select("order_no,status,paid_at,reviewed_note")
      .eq("order_no", orderNo)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json(
        { ok: false, message: "订单不存在。" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        orderNo: data.order_no,
        status: data.status,
        paidAt: data.paid_at,
        note: data.reviewed_note,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("payment status failed:", error);
    return NextResponse.json(
      { ok: false, message: "查询订单状态失败。" },
      { status: 500 }
    );
  }
}

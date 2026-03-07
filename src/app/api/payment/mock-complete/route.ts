import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  orderNo?: string;
};

export async function POST(req: Request) {
  try {
    const provider = (process.env.PAYMENT_PROVIDER ?? "mock").trim();
    if (provider !== "mock") {
      return NextResponse.json(
        { ok: false, message: "仅 mock 支付模式可用。" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as Payload;
    const orderNo = (body.orderNo ?? "").trim();
    if (!orderNo) {
      return NextResponse.json(
        { ok: false, message: "缺少订单号。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "paid_confirmed",
        reviewed_by: "mock_gateway",
        reviewed_note: "mock payment success",
        reviewed_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
      })
      .eq("order_no", orderNo)
      .in("status", ["pending_payment", "pending_review"])
      .select("order_no,status")
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json(
        { ok: false, message: "订单不存在或已完成。" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "模拟支付成功。", orderNo: data.order_no },
      { status: 200 }
    );
  } catch (error) {
    console.error("mock complete failed:", error);
    return NextResponse.json(
      { ok: false, message: "模拟支付失败。" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type WebhookBody = {
  orderNo?: string;
  tradeStatus?: string;
  paidAmount?: number | string;
  providerOrderId?: string;
  sign?: string;
};

function verifyWebhookSign(sign: string) {
  const expected = process.env.PAYMENT_WEBHOOK_SECRET?.trim() ?? "";
  if (!expected) {
    return false;
  }
  return sign === expected;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WebhookBody;
    const orderNo = (body.orderNo ?? "").trim();
    const tradeStatus = (body.tradeStatus ?? "").trim().toUpperCase();
    const providerOrderId = (body.providerOrderId ?? "").trim();
    const paidAmount = Number(body.paidAmount ?? 0);
    const sign = (body.sign ?? "").trim();

    if (!orderNo || !tradeStatus || !sign) {
      return NextResponse.json({ ok: false, message: "缺少必要参数。" }, { status: 400 });
    }
    if (!verifyWebhookSign(sign)) {
      return NextResponse.json({ ok: false, message: "签名校验失败。" }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: found, error: findError } = await supabase
      .from("orders")
      .select("id,amount,status")
      .eq("order_no", orderNo)
      .limit(1)
      .maybeSingle();
    if (findError) {
      throw findError;
    }
    if (!found) {
      return NextResponse.json({ ok: false, message: "订单不存在。" }, { status: 404 });
    }

    if (found.status === "paid_confirmed") {
      return NextResponse.json({ ok: true, message: "订单已是支付成功状态（幂等）。" });
    }

    if (tradeStatus !== "SUCCESS") {
      return NextResponse.json({ ok: true, message: "非成功支付状态已忽略。" });
    }
    if (Math.abs(Number(found.amount) - paidAmount) > 0.01) {
      return NextResponse.json({ ok: false, message: "金额校验失败。" }, { status: 400 });
    }

    const note = providerOrderId
      ? `webhook_success provider_order_id=${providerOrderId}`
      : "webhook_success";

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid_confirmed",
        reviewed_by: "payment_webhook",
        reviewed_note: note,
        reviewed_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
      })
      .eq("order_no", orderNo)
      .in("status", ["pending_payment", "pending_review"]);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true, message: "订单已更新为已支付。" });
  } catch (error) {
    console.error("payment webhook failed:", error);
    return NextResponse.json({ ok: false, message: "回调处理失败。" }, { status: 500 });
  }
}

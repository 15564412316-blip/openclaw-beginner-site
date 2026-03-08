import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createOrderNo } from "@/lib/orderNo";
import { PLAN_CONFIG, isPlanCode } from "@/lib/paymentPlans";
import { createHostedPayment } from "@/lib/paymentProvider";

type Payload = {
  plan?: string;
  email?: string;
  wechat?: string;
  channel?: "wechat" | "alipay" | string;
};

function resolveBaseUrl(req: Request) {
  const proto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (proto && host) {
    return `${proto}://${host}`;
  }
  if (host) {
    return `http://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const plan = (body.plan ?? "").trim();
    const email = (body.email ?? "").trim();
    const wechat = (body.wechat ?? "").trim();
    const channel = (body.channel ?? "").trim();

    if (!isPlanCode(plan)) {
      return NextResponse.json(
        { ok: false, message: "套餐无效，请刷新重试。" },
        { status: 400 }
      );
    }
    if (!email) {
      return NextResponse.json(
        { ok: false, message: "请先填写邮箱。" },
        { status: 400 }
      );
    }
    if (!["wechat", "alipay"].includes(channel)) {
      return NextResponse.json(
        { ok: false, message: "请选择支付方式（微信/支付宝）。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const baseUrl = resolveBaseUrl(req);
    let orderNo = "";
    let inserted = false;
    const amount = PLAN_CONFIG[plan].amount;
    let hosted: Awaited<ReturnType<typeof createHostedPayment>> | null = null;

    for (let i = 0; i < 3; i += 1) {
      orderNo = createOrderNo();
      hosted = await createHostedPayment({
        orderNo,
        amount,
        plan,
        email,
        channel: channel as "wechat" | "alipay",
        baseUrl,
      });
      const { error } = await supabase.from("orders").insert({
        order_no: orderNo,
        email,
        wechat: wechat || null,
        plan,
        amount,
        channel: channel,
        payer_note: null,
        status: "pending_payment",
        reviewed_note: `provider=${hosted.provider};provider_order_id=${hosted.providerOrderId}`,
      });
      if (!error) {
        inserted = true;
        break;
      }
      if (error.code !== "23505") {
        throw error;
      }
    }

    if (!inserted) {
      throw new Error("Failed to create unique order number");
    }
    if (!hosted) {
      throw new Error("Payment provider create failed");
    }

    // Rebuild pay url with actual orderNo for provider mock flow.
    const payUrl = hosted.provider === "mock"
      ? `${baseUrl}/mock-pay?orderNo=${encodeURIComponent(orderNo)}&amount=${encodeURIComponent(String(amount))}&plan=${encodeURIComponent(plan)}&email=${encodeURIComponent(email)}`
      : hosted.payUrl;

    return NextResponse.json(
      {
        ok: true,
        orderNo,
        amount,
        payUrl,
        status: "PENDING_PAYMENT",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("create payment failed:", error);
    return NextResponse.json(
      { ok: false, message: "创建支付订单失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

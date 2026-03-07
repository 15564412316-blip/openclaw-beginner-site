import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  email?: string;
  wechat?: string;
  channel?: "wechat" | "alipay" | "";
  amount?: number | string;
  plan?: "auto_49" | "vip_99" | string;
  payerNote?: string;
};

const PLAN_PRICE: Record<"auto_49" | "vip_99", number> = {
  auto_49: 99.9,
  vip_99: 199,
};

function createOrderNo() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `OC${y}${m}${d}${hh}${mm}${ss}${rand}`;
}

function normalizeAmount(value: number | string | undefined) {
  const raw = typeof value === "string" ? value.trim() : value;
  const parsed = Number(raw ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const email = (body.email ?? "").trim();
    const wechat = (body.wechat ?? "").trim();
    const payerNote = (body.payerNote ?? "").trim();
    const channel = body.channel ?? "";
    const plan = (body.plan ?? "").trim() as "auto_49" | "vip_99" | "";
    const amount = normalizeAmount(body.amount);

    if (!email || !channel || !plan || !amount) {
      return NextResponse.json(
        { ok: false, message: "请填写完整支付信息后再提交。" },
        { status: 400 }
      );
    }

    if (!["wechat", "alipay"].includes(channel)) {
      return NextResponse.json(
        { ok: false, message: "支付方式无效，请重新选择。" },
        { status: 400 }
      );
    }

    if (!["auto_49", "vip_99"].includes(plan)) {
      return NextResponse.json(
        { ok: false, message: "套餐无效，请刷新页面后重试。" },
        { status: 400 }
      );
    }

    const expectedAmount = PLAN_PRICE[plan];
    if (Math.abs(amount - expectedAmount) > 0.01) {
      return NextResponse.json(
        { ok: false, message: "金额校验失败，请勿修改支付金额。" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    let orderNo = "";
    let inserted = false;

    for (let i = 0; i < 3; i += 1) {
      orderNo = createOrderNo();
      const { error } = await supabase.from("orders").insert({
        order_no: orderNo,
        email,
        wechat: wechat || null,
        plan,
        amount: expectedAmount,
        channel,
        payer_note: payerNote || null,
        status: "pending_review",
      });

      if (!error) {
        inserted = true;
        break;
      }

      // Unique collision on order_no, retry with a new order number.
      if (error.code !== "23505") {
        throw error;
      }
    }

    if (!inserted) {
      throw new Error("Failed to create unique order number");
    }

    return NextResponse.json(
      {
        ok: true,
        orderNo,
        status: "PENDING_MANUAL_REVIEW",
        message: "提交成功。我们会人工确认收款并处理你的订单。",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("manual-order submit failed:", error);
    return NextResponse.json(
      { ok: false, message: "提交失败，请稍后重试或联系管理员。" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

type Payload = {
  email?: string;
  wechat?: string;
  channel?: "wechat" | "alipay" | "";
  amount?: number;
  plan?: string;
  payerNote?: string;
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

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const email = (body.email ?? "").trim();
    const channel = body.channel ?? "";
    const amount = Number(body.amount ?? 0);
    const plan = (body.plan ?? "").trim();

    if (!email || !channel || !plan || !amount) {
      return NextResponse.json(
        { ok: false, message: "请填写完整支付信息后再提交。" },
        { status: 400 }
      );
    }

    const orderNo = createOrderNo();
    return NextResponse.json(
      {
        ok: true,
        orderNo,
        status: "PENDING_MANUAL_REVIEW",
        message: "提交成功。我们会人工确认收款并处理你的订单。",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, message: "提交失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

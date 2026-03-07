import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  email?: string;
  orderNo?: string;
  title?: string;
  description?: string;
};

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
      .from("support_tickets")
      .select("id,title,description,status,resolution_note,created_at,updated_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, tickets: data ?? [], phone, email }, { status: 200 });
  } catch (error) {
    console.error("user tickets failed:", error);
    return NextResponse.json(
      { ok: false, message: "查询工单失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const phone = cookieStore.get("oc_user_phone")?.value ?? "";
    if (!phone) {
      return NextResponse.json({ ok: false, message: "请先登录。" }, { status: 401 });
    }

    const body = (await req.json()) as Payload;
    const email = (body.email ?? "").trim();
    const orderNo = (body.orderNo ?? "").trim();
    const title = (body.title ?? "").trim();
    const description = (body.description ?? "").trim();

    if (!email || !orderNo || !title || !description) {
      return NextResponse.json({ ok: false, message: "请填写完整信息。" }, { status: 400 });
    }
    if (title.length > 100 || description.length > 5000) {
      return NextResponse.json({ ok: false, message: "标题或描述过长，请精简后重试。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id,order_no,status")
      .eq("order_no", orderNo)
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (orderErr) {
      throw orderErr;
    }
    if (!order) {
      return NextResponse.json(
        { ok: false, message: "订单号与邮箱不匹配，请检查后重试。" },
        { status: 400 }
      );
    }
    if (order.status !== "paid_confirmed") {
      return NextResponse.json(
        { ok: false, message: "订单未支付成功，暂不可提交付费工单。" },
        { status: 403 }
      );
    }

    const { data: ticket, error: ticketErr } = await supabase
      .from("support_tickets")
      .insert({
        order_id: order.id,
        email,
        title,
        description: `[phone:${phone}]\n${description}`,
        status: "open",
      })
      .select("id,title,status,created_at")
      .limit(1)
      .maybeSingle();
    if (ticketErr) {
      throw ticketErr;
    }

    return NextResponse.json({ ok: true, message: "工单已提交。", ticket }, { status: 200 });
  } catch (error) {
    console.error("create ticket failed:", error);
    return NextResponse.json(
      { ok: false, message: "提交工单失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

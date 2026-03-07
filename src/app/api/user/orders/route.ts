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

    return NextResponse.json(
      { ok: true, orders: data ?? [], phone, email },
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

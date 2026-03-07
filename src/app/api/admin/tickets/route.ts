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
    const status = (url.searchParams.get("status") ?? "open").trim();
    const q = (url.searchParams.get("q") ?? "").trim();
    const allowed = ["open", "processing", "resolved", "closed"];
    if (!allowed.includes(status)) {
      return NextResponse.json({ ok: false, message: "状态参数无效。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    let query = supabase
      .from("support_tickets")
      .select(
        "id,title,description,status,resolution_note,email,created_at,updated_at,order:orders(order_no,plan,status)"
      )
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(100);

    if (q) {
      query = query.or(`email.ilike.%${q}%,title.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return NextResponse.json({ ok: true, tickets: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("admin list tickets failed:", error);
    return NextResponse.json({ ok: false, message: "获取工单失败。" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { verifyAdminTokenOrResponse } from "@/lib/adminAuth";

type Payload = {
  ticketId?: string;
  nextStatus?: "processing" | "resolved" | "closed" | string;
  note?: string;
};

export async function POST(req: Request) {
  try {
    const denied = verifyAdminTokenOrResponse(req);
    if (denied) {
      return denied;
    }

    const body = (await req.json()) as Payload;
    const ticketId = (body.ticketId ?? "").trim();
    const nextStatus = (body.nextStatus ?? "").trim();
    const note = (body.note ?? "").trim();
    if (!ticketId || !nextStatus) {
      return NextResponse.json({ ok: false, message: "缺少必要参数。" }, { status: 400 });
    }
    if (!["processing", "resolved", "closed"].includes(nextStatus)) {
      return NextResponse.json({ ok: false, message: "状态无效。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("support_tickets")
      .update({
        status: nextStatus,
        resolution_note: note || null,
      })
      .eq("id", ticketId)
      .select("id,status,resolution_note")
      .limit(1)
      .maybeSingle();
    if (error) {
      throw error;
    }
    if (!data) {
      return NextResponse.json({ ok: false, message: "工单不存在。" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, ticket: data, message: "工单状态已更新。" }, { status: 200 });
  } catch (error) {
    console.error("admin review ticket failed:", error);
    return NextResponse.json({ ok: false, message: "更新失败，请稍后重试。" }, { status: 500 });
  }
}

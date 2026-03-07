import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { verifyAdminTokenOrResponse } from "@/lib/adminAuth";

type ReviewBody = {
  orderNo?: string;
  nextStatus?: "paid_confirmed" | "rejected" | string;
  reviewedBy?: string;
  reviewedNote?: string;
};

export async function POST(req: Request) {
  try {
    const denied = verifyAdminTokenOrResponse(req);
    if (denied) {
      return denied;
    }

    const body = (await req.json()) as ReviewBody;
    const orderNo = (body.orderNo ?? "").trim();
    const nextStatus = (body.nextStatus ?? "").trim();
    const reviewedBy = (body.reviewedBy ?? "admin").trim();
    const reviewedNote = (body.reviewedNote ?? "").trim();

    if (!orderNo || !nextStatus) {
      return NextResponse.json(
        { ok: false, message: "缺少必要参数。" },
        { status: 400 }
      );
    }

    if (!["paid_confirmed", "rejected"].includes(nextStatus)) {
      return NextResponse.json(
        { ok: false, message: "审核状态无效。" },
        { status: 400 }
      );
    }

    const updatePayload: {
      status: "paid_confirmed" | "rejected";
      reviewed_by: string;
      reviewed_note: string | null;
      reviewed_at: string;
      paid_at?: string;
    } = {
      status: nextStatus as "paid_confirmed" | "rejected",
      reviewed_by: reviewedBy || "admin",
      reviewed_note: reviewedNote || null,
      reviewed_at: new Date().toISOString(),
    };

    if (nextStatus === "paid_confirmed") {
      updatePayload.paid_at = new Date().toISOString();
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("orders")
      .update(updatePayload)
      .eq("order_no", orderNo)
      .in("status", ["pending_review", "pending_payment"])
      .select("id,order_no,status");

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { ok: false, message: "订单不存在，或已被处理。" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "审核结果已保存。", order: data[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("admin review order failed:", error);
    return NextResponse.json(
      { ok: false, message: "审核失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

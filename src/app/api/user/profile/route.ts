import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  preferredEmail?: string;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const phone = cookieStore.get("oc_user_phone")?.value ?? "";
    if (!phone) {
      return NextResponse.json({ ok: false, message: "请先登录。" }, { status: 401 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("app_users")
      .select("id,phone,preferred_email,status,first_login_at,last_login_at,login_count")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, profile: data ?? null }, { status: 200 });
  } catch (error) {
    console.error("user profile get failed:", error);
    return NextResponse.json({ ok: false, message: "获取资料失败。" }, { status: 500 });
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
    const preferredEmail = (body.preferredEmail ?? "").trim().toLowerCase();
    if (preferredEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(preferredEmail)) {
      return NextResponse.json({ ok: false, message: "邮箱格式不正确。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from("app_users")
      .update({ preferred_email: preferredEmail || null })
      .eq("phone", phone)
      .select("id,phone,preferred_email")
      .limit(1)
      .maybeSingle();
    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true, profile: data ?? null, message: "邮箱已保存。" }, { status: 200 });
  } catch (error) {
    console.error("user profile save failed:", error);
    return NextResponse.json({ ok: false, message: "保存失败，请稍后重试。" }, { status: 500 });
  }
}

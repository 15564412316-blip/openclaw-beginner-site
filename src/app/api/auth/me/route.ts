import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function GET() {
  const cookieStore = await cookies();
  const phone = cookieStore.get("oc_user_phone")?.value ?? "";
  if (!phone) {
    return NextResponse.json({ ok: true, loggedIn: false }, { status: 200 });
  }

  try {
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

    return NextResponse.json(
      { ok: true, loggedIn: true, phone, profile: data ?? null },
      { status: 200 }
    );
  } catch (error) {
    console.error("auth me failed:", error);
    return NextResponse.json(
      { ok: true, loggedIn: true, phone, profile: null },
      { status: 200 }
    );
  }
}

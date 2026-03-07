import { NextResponse } from "next/server";
import { validatePhone, verifyCode } from "@/lib/authSmsStore";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

type Payload = {
  phone?: string;
  code?: string;
};

const SESSION_DAYS = 7;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const phone = (body.phone ?? "").trim();
    const code = (body.code ?? "").trim();

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { ok: false, message: "手机号格式不正确。" },
        { status: 400 }
      );
    }
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { ok: false, message: "验证码应为 6 位数字。" },
        { status: 400 }
      );
    }

    const checked = verifyCode(phone, code);
    if (!checked.ok) {
      return NextResponse.json(
        { ok: false, message: checked.reason },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const nowIso = new Date().toISOString();
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = req.headers.get("user-agent") || null;

    const { data: existingUser, error: findUserError } = await supabase
      .from("app_users")
      .select("id,login_count")
      .eq("phone", phone)
      .limit(1)
      .maybeSingle();

    if (findUserError) {
      throw findUserError;
    }

    let userId = existingUser?.id ?? null;
    if (!existingUser) {
      const { data: insertedUser, error: insertUserError } = await supabase
        .from("app_users")
        .insert({
          phone,
          status: "active",
          first_login_at: nowIso,
          last_login_at: nowIso,
          login_count: 1,
        })
        .select("id")
        .limit(1)
        .maybeSingle();
      if (insertUserError) {
        throw insertUserError;
      }
      userId = insertedUser?.id ?? null;
    } else {
      const { error: updateUserError } = await supabase
        .from("app_users")
        .update({
          last_login_at: nowIso,
          login_count: Number(existingUser.login_count ?? 0) + 1,
        })
        .eq("id", existingUser.id);
      if (updateUserError) {
        throw updateUserError;
      }
    }

    const { error: insertEventError } = await supabase.from("auth_login_events").insert({
      user_id: userId,
      phone,
      success: true,
      ip: clientIp,
      user_agent: userAgent,
      source: "phone_otp",
    });
    if (insertEventError) {
      throw insertEventError;
    }

    const res = NextResponse.json(
      { ok: true, message: "登录成功。", phone, userId },
      { status: 200 }
    );
    res.cookies.set("oc_user_phone", phone, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });
    return res;
  } catch (error) {
    console.error("verify-code failed:", error);
    return NextResponse.json(
      { ok: false, message: "登录失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

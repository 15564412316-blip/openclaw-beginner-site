import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";

const CODE_EXPIRE_SEC = 5 * 60;
const SEND_INTERVAL_SEC = 60;

export function validatePhone(phone: string) {
  return /^1\d{10}$/.test(phone.trim());
}

export function generateSmsCode() {
  return String(Math.floor(Math.random() * 900000) + 100000);
}

export async function canSendCode(phone: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("auth_sms_codes")
    .select("sent_at")
    .eq("phone", phone)
    .limit(1)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data?.sent_at) {
    return { ok: true, retryAfterSec: 0 };
  }

  const nowMs = Date.now();
  const sentMs = new Date(data.sent_at).getTime();
  const waitMs = SEND_INTERVAL_SEC * 1000 - (nowMs - sentMs);
  if (waitMs <= 0) {
    return { ok: true, retryAfterSec: 0 };
  }
  return { ok: false, retryAfterSec: Math.ceil(waitMs / 1000) };
}

export async function saveCode(phone: string, code: string) {
  const supabase = getSupabaseAdminClient();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CODE_EXPIRE_SEC * 1000);
  const { error } = await supabase.from("auth_sms_codes").upsert(
    {
      phone,
      code,
      sent_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    },
    { onConflict: "phone" }
  );
  if (error) {
    throw error;
  }
  return { expiresInSec: CODE_EXPIRE_SEC };
}

export async function verifyCode(phone: string, code: string) {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("auth_sms_codes")
    .select("code,expires_at,attempts")
    .eq("phone", phone)
    .limit(1)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return { ok: false, reason: "验证码不存在，请先发送验证码。" };
  }
  if (Date.now() > new Date(data.expires_at).getTime()) {
    await supabase.from("auth_sms_codes").delete().eq("phone", phone);
    return { ok: false, reason: "验证码已过期，请重新发送。" };
  }
  if (data.code !== code.trim()) {
    await supabase
      .from("auth_sms_codes")
      .update({ attempts: Number(data.attempts ?? 0) + 1 })
      .eq("phone", phone);
    return { ok: false, reason: "验证码错误，请重新输入。" };
  }

  await supabase.from("auth_sms_codes").delete().eq("phone", phone);
  return { ok: true as const };
}

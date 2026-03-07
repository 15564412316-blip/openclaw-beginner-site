type SmsCodeRecord = {
  code: string;
  expiresAt: number;
  sentAt: number;
};

const smsCodeStore = new Map<string, SmsCodeRecord>();

const CODE_EXPIRE_MS = 5 * 60 * 1000;
const SEND_INTERVAL_MS = 60 * 1000;

function normalizePhone(phone: string) {
  return phone.trim();
}

export function validatePhone(phone: string) {
  return /^1\d{10}$/.test(normalizePhone(phone));
}

export function canSendCode(phone: string) {
  const key = normalizePhone(phone);
  const record = smsCodeStore.get(key);
  if (!record) {
    return { ok: true, retryAfterSec: 0 };
  }
  const nextSendAt = record.sentAt + SEND_INTERVAL_MS;
  const now = Date.now();
  if (now >= nextSendAt) {
    return { ok: true, retryAfterSec: 0 };
  }
  return { ok: false, retryAfterSec: Math.ceil((nextSendAt - now) / 1000) };
}

export function issueCode(phone: string) {
  const key = normalizePhone(phone);
  const code = String(Math.floor(Math.random() * 900000) + 100000);
  const now = Date.now();
  smsCodeStore.set(key, {
    code,
    sentAt: now,
    expiresAt: now + CODE_EXPIRE_MS,
  });
  return { code, expiresInSec: Math.floor(CODE_EXPIRE_MS / 1000) };
}

export function verifyCode(phone: string, code: string) {
  const key = normalizePhone(phone);
  const record = smsCodeStore.get(key);
  if (!record) {
    return { ok: false, reason: "验证码不存在，请先发送验证码。" };
  }
  if (Date.now() > record.expiresAt) {
    smsCodeStore.delete(key);
    return { ok: false, reason: "验证码已过期，请重新发送。" };
  }
  if (record.code !== code.trim()) {
    return { ok: false, reason: "验证码错误，请重新输入。" };
  }
  smsCodeStore.delete(key);
  return { ok: true as const };
}

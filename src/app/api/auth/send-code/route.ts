import { NextResponse } from "next/server";
import { canSendCode, issueCode, validatePhone } from "@/lib/authSmsStore";

type Payload = {
  phone?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const phone = (body.phone ?? "").trim();

    if (!validatePhone(phone)) {
      return NextResponse.json(
        { ok: false, message: "手机号格式不正确，请输入 11 位中国大陆手机号。" },
        { status: 400 }
      );
    }

    const gate = canSendCode(phone);
    if (!gate.ok) {
      return NextResponse.json(
        { ok: false, message: `发送太频繁，请 ${gate.retryAfterSec}s 后再试。` },
        { status: 429 }
      );
    }

    const { code } = issueCode(phone);
    const smsProvider = (process.env.SMS_PROVIDER ?? "").trim();
    const isDev = process.env.NODE_ENV !== "production";

    if (!smsProvider) {
      if (!isDev) {
        return NextResponse.json(
          { ok: false, message: "短信服务未配置，请稍后重试。" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          ok: true,
          message: "验证码已发送（开发模式）。",
          debugCode: code,
        },
        { status: 200 }
      );
    }

    // TODO: replace with real SMS provider call (Tencent/Alibaba).
    // Keep the code issuance and verification logic unchanged.
    console.log(`[SMS:${smsProvider}] send code to ${phone}: ${code}`);

    return NextResponse.json(
      { ok: true, message: "验证码已发送，请注意查收短信。" },
      { status: 200 }
    );
  } catch (error) {
    console.error("send-code failed:", error);
    return NextResponse.json(
      { ok: false, message: "发送验证码失败，请稍后重试。" },
      { status: 500 }
    );
  }
}

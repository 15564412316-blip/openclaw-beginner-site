"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/guide/local";

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [debugCode, setDebugCode] = useState("");
  const [loggedInPhone, setLoggedInPhone] = useState("");
  const [loginCount, setLoginCount] = useState<number | null>(null);

  const canSend = useMemo(() => countdown <= 0 && !sending, [countdown, sending]);
  const canLogin = useMemo(() => !verifying && phone.trim() && code.trim(), [verifying, phone, code]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((v) => (v <= 1 ? 0 : v - 1));
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  const loadMe = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data?.loggedIn && data?.phone) {
        setLoggedInPhone(String(data.phone));
        setLoginCount(
          typeof data?.profile?.login_count === "number" ? data.profile.login_count : null
        );
      } else {
        setLoggedInPhone("");
        setLoginCount(null);
      }
    } catch {
      setLoggedInPhone("");
      setLoginCount(null);
    }
  };

  useEffect(() => {
    void loadMe();
  }, []);

  const sendCode = async () => {
    if (!/^1\d{10}$/.test(phone.trim())) {
      setMessage("请输入 11 位中国大陆手机号。");
      return;
    }

    setSending(true);
    setMessage("");
    setDebugCode("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "发送失败");
        return;
      }

      setCountdown(60);
      setMessage(data?.message ?? "验证码已发送");
      if (data?.debugCode) {
        setDebugCode(String(data.debugCode));
      }
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setSending(false);
    }
  };

  const verifyAndLogin = async () => {
    if (!/^1\d{10}$/.test(phone.trim())) {
      setMessage("请输入正确手机号。");
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setMessage("请输入 6 位验证码。");
      return;
    }

    setVerifying(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "登录失败");
        return;
      }

      setMessage("登录成功，正在跳转...");
      router.push(redirect);
      router.refresh();
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setVerifying(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setLoggedInPhone("");
    setLoginCount(null);
    setMessage("已退出登录。");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-2">手机号登录</h1>
            <p className="text-sm text-muted-foreground mb-5">仅支持手机号验证码登录，不提供密码登录。</p>

            {loggedInPhone ? (
              <div className="space-y-3">
                <p className="text-sm">当前已登录：{loggedInPhone}</p>
                {loginCount !== null && <p className="text-xs text-muted-foreground">累计登录：{loginCount} 次</p>}
                <div className="flex gap-2">
                  <Button onClick={() => router.push(redirect)}>进入站点</Button>
                  <Button variant="outline" onClick={logout}>
                    退出登录
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <p className="text-sm mb-1">手机号</p>
                  <Input
                    type="tel"
                    inputMode="numeric"
                    placeholder="请输入 11 位手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-sm mb-1">验证码</p>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      placeholder="请输入 6 位验证码"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                    />
                    <Button type="button" variant="outline" onClick={sendCode} disabled={!canSend}>
                      {countdown > 0 ? `${countdown}s` : "发送验证码"}
                    </Button>
                  </div>
                </div>
                <Button onClick={verifyAndLogin} disabled={!canLogin}>
                  {verifying ? "登录中..." : "登录"}
                </Button>
              </div>
            )}

            {message && <p className="text-sm mt-4">{message}</p>}
            {debugCode && (
              <p className="text-xs text-amber-500 mt-2">开发模式验证码：{debugCode}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PlanCode } from "@/lib/paymentPlans";

type HostedPaymentPanelProps = {
  plan: PlanCode;
  amount: number;
  title: string;
  description: string;
  successPath: string;
  extraNote?: string;
};

export function HostedPaymentPanel({
  plan,
  amount,
  title,
  description,
  successPath,
  extraNote,
}: HostedPaymentPanelProps) {
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [channel, setChannel] = useState<"" | "wechat" | "alipay">("");
  const [submitting, setSubmitting] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [autoChecking, setAutoChecking] = useState(false);
  const redirectedRef = useRef(false);

  const createOrder = async () => {
    if (!email.trim() || !channel) {
      setMessage("请先填写邮箱并选择支付方式。");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          email: email.trim(),
          wechat: wechat.trim(),
          channel,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "创建订单失败");
        return;
      }

      setOrderNo(data.orderNo ?? "");
      setStatus(data.status ?? "PENDING_PAYMENT");

      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        setMessage("订单已创建，请稍后刷新状态。");
      }
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  const checkStatus = async () => {
    if (!orderNo) {
      setMessage("请先创建订单。");
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch(`/api/payment/status?orderNo=${encodeURIComponent(orderNo)}`);
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "查询状态失败");
        return;
      }

      const nextStatus = String(data.status ?? "");
      setStatus(nextStatus);
      if (nextStatus === "paid_confirmed") {
        if (!redirectedRef.current) {
          redirectedRef.current = true;
          setMessage("支付成功，正在跳转...");
          await fetch("/api/payment/grant-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNo }),
          });
          const connector = successPath.includes("?") ? "&" : "?";
          window.location.href = `${successPath}${connector}orderNo=${encodeURIComponent(orderNo)}`;
        }
      } else {
        setMessage("正在等待支付回调确认...");
      }
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!orderNo || redirectedRef.current) return;
    if (status === "paid_confirmed" || status === "PAID_CONFIRMED") return;
    let alive = true;
    setAutoChecking(true);
    const timer = setInterval(async () => {
      if (!alive || redirectedRef.current) return;
      try {
        const res = await fetch(`/api/payment/status?orderNo=${encodeURIComponent(orderNo)}`);
        const data = await res.json();
        if (!res.ok || !data?.ok) return;
        const nextStatus = String(data.status ?? "");
        setStatus(nextStatus);
        if (nextStatus === "paid_confirmed" && !redirectedRef.current) {
          redirectedRef.current = true;
          await fetch("/api/payment/grant-download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNo }),
          });
          const connector = successPath.includes("?") ? "&" : "?";
          window.location.href = `${successPath}${connector}orderNo=${encodeURIComponent(orderNo)}`;
        }
      } catch {
        // Keep polling silently.
      }
    }, 2000);

    return () => {
      alive = false;
      clearInterval(timer);
      setAutoChecking(false);
    };
  }, [orderNo, status, successPath]);

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-5">{description}</p>

        <div className="space-y-3">
          <div>
            <p className="text-sm mb-1">支付金额</p>
            <Input value={`¥${amount}`} readOnly />
          </div>
          <div>
            <p className="text-sm mb-1">邮箱（必填）</p>
            <Input
              type="email"
              placeholder="用于回调后放行权限"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm mb-1">微信号（可选）</p>
            <Input
              placeholder="异常时用于联系"
              value={wechat}
              onChange={(e) => setWechat(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm mb-1">支付方式（必选）</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={channel === "wechat" ? "default" : "outline"}
                onClick={() => setChannel("wechat")}
              >
                微信
              </Button>
              <Button
                type="button"
                variant={channel === "alipay" ? "default" : "outline"}
                onClick={() => setChannel("alipay")}
              >
                支付宝
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={createOrder} disabled={submitting}>
            {submitting ? "处理中..." : "创建订单并去支付"}
          </Button>
          <Button onClick={checkStatus} variant="outline" disabled={submitting || !orderNo}>
            立即检查支付状态
          </Button>
        </div>

        {orderNo && <p className="text-xs text-muted-foreground mt-4">订单号：{orderNo}</p>}
        {status && <p className="text-xs text-muted-foreground mt-1">当前状态：{status}</p>}
        {autoChecking && <p className="text-xs text-muted-foreground mt-1">状态自动刷新中...</p>}
        {message && <p className="text-sm mt-2">{message}</p>}
        {extraNote && <p className="text-xs text-muted-foreground mt-4">{extraNote}</p>}
      </CardContent>
    </Card>
  );
}

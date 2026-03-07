"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ManualPayPanelProps = {
  plan: "auto_49" | "vip_99";
  amount: number;
  title: string;
  description: string;
  extraNote?: string;
};

export function ManualPayPanel({
  plan,
  amount,
  title,
  description,
  extraNote,
}: ManualPayPanelProps) {
  const [email, setEmail] = useState("");
  const [wechat, setWechat] = useState("");
  const [channel, setChannel] = useState<"" | "wechat" | "alipay">("");
  const [payerNote, setPayerNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; orderNo?: string } | null>(
    null
  );

  const submit = async () => {
    if (!email || !channel) {
      setResult({ ok: false, message: "请先填写邮箱并选择支付方式。" });
      return;
    }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/manual-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          wechat,
          channel,
          amount,
          plan,
          payerNote,
        }),
      });
      const data = await res.json();
      setResult({
        ok: Boolean(data?.ok),
        message: data?.message ?? "提交完成",
        orderNo: data?.orderNo,
      });
    } catch {
      setResult({ ok: false, message: "网络异常，请稍后重试。" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-5">{description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-medium mb-2">微信收款码</p>
            <div className="h-40 rounded-lg bg-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
              收款码占位（后续替换真实商户码）
            </div>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-medium mb-2">支付宝收款码</p>
            <div className="h-40 rounded-lg bg-secondary/50 flex items-center justify-center text-xs text-muted-foreground">
              收款码占位（后续替换真实商户码）
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm mb-1">付款金额</p>
            <Input value={`¥${amount}`} readOnly />
          </div>
          <div>
            <p className="text-sm mb-1">邮箱（必填）</p>
            <Input
              type="email"
              placeholder="用于接收订单确认"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm mb-1">微信号（可选）</p>
            <Input
              placeholder="用于后续联系"
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
          <div>
            <p className="text-sm mb-1">付款备注（可选）</p>
            <Input
              placeholder="可填写转账时间/后四位"
              value={payerNote}
              onChange={(e) => setPayerNote(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "提交中..." : "我已付款，提交人工确认"}
          </Button>
        </div>

        {result && (
          <p className={`text-sm mt-4 ${result.ok ? "text-green-500" : "text-red-500"}`}>
            {result.message}
            {result.orderNo ? ` 订单号：${result.orderNo}` : ""}
          </p>
        )}

        {extraNote && <p className="text-xs text-muted-foreground mt-4">{extraNote}</p>}
      </CardContent>
    </Card>
  );
}

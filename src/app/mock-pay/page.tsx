"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MockPayPage() {
  const searchParams = useSearchParams();
  const orderNo = searchParams.get("orderNo") ?? "";
  const amount = searchParams.get("amount") ?? "";
  const plan = searchParams.get("plan") ?? "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const complete = async () => {
    if (!orderNo) {
      setMessage("缺少订单号。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/payment/mock-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "支付失败");
        return;
      }
      setMessage("支付成功，正在跳转下载页...");
      window.location.href = `/payment/success?orderNo=${encodeURIComponent(orderNo)}`;
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-3">模拟托管收银台（开发模式）</h1>
            <p className="text-sm text-muted-foreground mb-4">
              这是 mock 支付页，用于先打通自动回调流程。正式版会替换为真实支付通道页面。
            </p>
            <p className="text-sm">订单号：{orderNo || "-"}</p>
            <p className="text-sm">金额：¥{amount || "-"}</p>
            <p className="text-sm mb-5">套餐：{plan || "-"}</p>

            <Button onClick={complete} disabled={loading}>
              {loading ? "处理中..." : "模拟支付成功"}
            </Button>
            {message && <p className="text-sm mt-3">{message}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

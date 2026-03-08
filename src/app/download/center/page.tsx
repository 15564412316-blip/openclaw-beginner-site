"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OneTimeDownloadPanel } from "@/components/checkout/OneTimeDownloadPanel";

export default function DownloadCenterPage() {
  const params = useSearchParams();
  const orderNo = (params.get("orderNo") ?? "").trim();
  const [grantMessage, setGrantMessage] = useState("");
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!orderNo) return;
      setGranting(true);
      setGrantMessage("");
      try {
        const res = await fetch("/api/payment/grant-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderNo }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setGrantMessage(data?.message ?? "订单授权失败，请稍后重试。");
          return;
        }
        setGrantMessage("订单已授权，可直接下载（仅一次）。");
      } catch {
        setGrantMessage("网络异常，授权失败。你也可以去“我的页面”重新进入下载。");
      } finally {
        setGranting(false);
      }
    };
    void run();
  }, [orderNo]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-2">安装文件下载</h1>
            <p className="text-sm text-muted-foreground mb-3">
              支付成功后在这里下载安装文件。每个订单只可下载一次，下载后次数即失效。
            </p>
            {orderNo && <p className="text-xs text-muted-foreground">订单号：{orderNo}</p>}
            {granting && <p className="text-xs text-muted-foreground mt-1">正在校验订单...</p>}
            {grantMessage && <p className="text-sm mt-2">{grantMessage}</p>}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">选择系统并下载</h2>
            <OneTimeDownloadPanel />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/downloads/openclaw-ops-guide.txt" download>
              下载后续使用指南
            </a>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/me">去我的页面看订单</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/guide/local?paid_auto=1">返回安装页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

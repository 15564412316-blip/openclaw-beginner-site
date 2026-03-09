"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderNo = (params.get("orderNo") ?? "").trim();
  const [message, setMessage] = useState("支付成功，正在跳转系统引导...");

  useEffect(() => {
    const run = async () => {
      try {
        if (orderNo) {
          window.location.href = `/guide?paid=1&orderNo=${encodeURIComponent(orderNo)}`;
          return;
        }
        window.location.href = "/guide?paid=1";
      } catch {
        setMessage("跳转失败，请点击下方按钮继续。");
      }
    };
    void run();
  }, [orderNo]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-3">支付成功</h1>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href={orderNo ? `/guide?paid=1&orderNo=${encodeURIComponent(orderNo)}` : "/guide?paid=1"}>
              继续去系统引导
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/me">去我的页面</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

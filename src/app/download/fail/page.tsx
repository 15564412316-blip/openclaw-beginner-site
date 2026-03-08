"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const reasonMap: Record<string, string> = {
  no_grant: "下载权限不存在，请先完成支付后从“我的订单”进入下载页。",
  already_used: "该订单下载次数已用完。如需再次下载，请重新购买或联系人工。",
  unpaid: "订单未支付成功，暂不可下载。",
  unknown: "下载失败，请稍后重试。",
};

export default function DownloadFailPage() {
  const params = useSearchParams();
  const reason = (params.get("reason") ?? "unknown").toLowerCase();
  const text = reasonMap[reason] ?? reasonMap.unknown;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-3">下载失败</h1>
        <p className="text-muted-foreground mb-6">{text}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/guide/local?paid_auto=1">返回安装页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/me">去我的页面</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  defaultOrderNo?: string;
};

export function OneTimeDownloadPanel({ defaultOrderNo = "" }: Props) {
  const [orderNo, setOrderNo] = useState(defaultOrderNo);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const claim = async (platform: "mac" | "win") => {
    if (!orderNo.trim()) {
      setMessage("请先输入支付后的订单号。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/download/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo: orderNo.trim(), platform }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "领取下载失败");
        return;
      }
      const fileUrl = String(data.fileUrl ?? "");
      if (fileUrl) {
        window.location.href = fileUrl;
      }
      setMessage("下载已发起。该订单下载次数已用完。");
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm mb-1">订单号（支付后生成）</p>
        <Input
          value={orderNo}
          onChange={(e) => setOrderNo(e.target.value)}
          placeholder="例如：OC202603071234567890"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" disabled={loading} onClick={() => claim("mac")}>
          下载 macOS 脚本（一次）
        </Button>
        <Button variant="outline" disabled={loading} onClick={() => claim("win")}>
          下载 Windows 脚本（一次）
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        说明：每个订单仅可下载一次。若已下载且需要重新获取，请重新购买或联系人工。
      </p>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}

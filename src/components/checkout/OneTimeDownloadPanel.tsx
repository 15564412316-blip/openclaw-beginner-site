"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function OneTimeDownloadPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const claim = async (platform: "mac" | "win") => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/download/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        const code = String(data?.code ?? "");
        if (code === "ALREADY_USED") {
          window.location.href = "/download/fail?reason=already_used";
          return;
        }
        if (code === "NO_GRANT") {
          window.location.href = "/download/fail?reason=no_grant";
          return;
        }
        if (code === "UNPAID") {
          window.location.href = "/download/fail?reason=unpaid";
          return;
        }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" disabled={loading} onClick={() => claim("mac")}>
          下载 macOS 一键安装器（一次）
        </Button>
        <Button variant="outline" disabled={loading} onClick={() => claim("win")}>
          下载 Windows 安装包（zip，一次）
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        说明：Windows 请先解压 zip，再双击 `openclaw-oneclick-windows.bat`。每个订单仅可下载一次。
      </p>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}

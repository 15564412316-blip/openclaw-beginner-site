"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OrderDetail = {
  order_no: string;
  plan: string;
  amount: number;
  status: string;
  channel: string;
  created_at: string;
  paid_at?: string | null;
  reviewed_note?: string | null;
};

export default function MyOrderDetailPage() {
  const params = useParams<{ orderNo: string }>();
  const searchParams = useSearchParams();
  const orderNo = params?.orderNo ?? "";
  const email = (searchParams.get("email") ?? "").trim();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [downloadClaimed, setDownloadClaimed] = useState(false);

  const nextAction = useMemo(() => {
    if (!order) return "";
    if (order.status !== "paid_confirmed") return "等待支付成功后再继续。";
    if (order.plan !== "auto_49") return "该订单为一对一代办，请等待服务处理。";
    if (downloadClaimed) return "脚本已领取过。如需再次下载，请重新购买或联系人工。";
    return "你现在可以去安装页领取一次脚本并执行安装。";
  }, [order, downloadClaimed]);

  useEffect(() => {
    const run = async () => {
      if (!orderNo || !email) {
        setMessage("缺少订单号或邮箱参数。");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/user/orders/${encodeURIComponent(orderNo)}?email=${encodeURIComponent(email)}`
        );
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          setMessage(data?.message ?? "查询失败");
          setLoading(false);
          return;
        }
        setOrder(data.order ?? null);
        setDownloadClaimed(Boolean(data.downloadClaimed));
      } catch {
        setMessage("网络异常，请稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [orderNo, email]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-2">订单详情</h1>
            {loading && <p className="text-sm text-muted-foreground">加载中...</p>}
            {!loading && message && <p className="text-sm">{message}</p>}
            {!loading && order && (
              <div className="space-y-2 text-sm">
                <p>订单号：{order.order_no}</p>
                <p>套餐：{order.plan}</p>
                <p>金额：¥{order.amount}</p>
                <p>状态：{order.status}</p>
                <p>支付方式：{order.channel}</p>
                <p>创建时间：{new Date(order.created_at).toLocaleString()}</p>
                {order.paid_at ? <p>支付时间：{new Date(order.paid_at).toLocaleString()}</p> : null}
                <p>脚本领取状态：{downloadClaimed ? "已领取（次数已用完）" : "未领取"}</p>
                <p className="text-muted-foreground">下一步：{nextAction}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild>
                    <Link href="/guide/local?paid_auto=1">去安装页</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/me">返回我的页面</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

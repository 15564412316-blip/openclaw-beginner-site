"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderItem = {
  id: string;
  order_no: string;
  email: string;
  wechat: string | null;
  plan: "auto_49" | "vip_99";
  amount: number;
  channel: "wechat" | "alipay";
  payer_note: string | null;
  status: "pending_review" | "paid_confirmed" | "rejected";
  created_at: string;
  reviewed_by?: string | null;
  reviewed_note?: string | null;
  reviewed_at?: string | null;
};

export default function AdminOrdersPage() {
  const [token, setToken] = useState("");
  const [reviewedBy, setReviewedBy] = useState("admin");
  const [viewStatus, setViewStatus] = useState<"pending_review" | "paid_confirmed" | "rejected">(
    "pending_review"
  );
  const [keyword, setKeyword] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const currentCount = useMemo(() => orders.length, [orders]);

  const loadOrders = async () => {
    if (!token.trim()) {
      setMessage("请先输入后台口令。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({
        status: viewStatus,
      });
      if (keyword.trim()) {
        params.set("q", keyword.trim());
      }

      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        headers: { "x-admin-token": token.trim() },
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "加载失败");
        return;
      }
      setOrders(data.orders ?? []);
      setMessage("已刷新订单列表。");
    } catch {
      setMessage("网络异常，加载失败。");
    } finally {
      setLoading(false);
    }
  };

  const reviewOrder = async (orderNo: string, nextStatus: "paid_confirmed" | "rejected") => {
    if (!token.trim()) {
      setMessage("请先输入后台口令。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/orders/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token.trim(),
        },
        body: JSON.stringify({
          orderNo,
          nextStatus,
          reviewedBy: reviewedBy.trim() || "admin",
          reviewedNote: notes[orderNo] ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "提交审核失败");
        return;
      }
      setOrders((prev) => prev.filter((o) => o.order_no !== orderNo));
      setMessage(`订单 ${orderNo} 已处理。`);
    } catch {
      setMessage("网络异常，提交失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">订单审核后台（MVP）</h1>
        <p className="text-sm text-muted-foreground mb-6">
          仅用于人工确认收款。请勿对外公开本页面口令。
        </p>

        <Card className="border-border/50 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <p className="text-sm mb-1">后台口令</p>
                <Input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="输入 ADMIN_REVIEW_TOKEN"
                />
              </div>
              <div>
                <p className="text-sm mb-1">审核人</p>
                <Input
                  value={reviewedBy}
                  onChange={(e) => setReviewedBy(e.target.value)}
                  placeholder="例如：caoyuchuan"
                />
              </div>
              <div>
                <p className="text-sm mb-1">搜索（可选）</p>
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="订单号 / 邮箱 / 微信号"
                />
              </div>
              <div className="flex items-end">
                <Button className="w-full" onClick={loadOrders} disabled={loading}>
                  {loading ? "处理中..." : "刷新订单列表"}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={viewStatus === "pending_review" ? "default" : "outline"}
                onClick={() => setViewStatus("pending_review")}
                disabled={loading}
              >
                待审核
              </Button>
              <Button
                variant={viewStatus === "paid_confirmed" ? "default" : "outline"}
                onClick={() => setViewStatus("paid_confirmed")}
                disabled={loading}
              >
                已确认
              </Button>
              <Button
                variant={viewStatus === "rejected" ? "default" : "outline"}
                onClick={() => setViewStatus("rejected")}
                disabled={loading}
              >
                已驳回
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">当前列表：{currentCount} 条</p>
            {message && <p className="text-sm mt-2">{message}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p>订单号：{order.order_no}</p>
                  <p>创建时间：{new Date(order.created_at).toLocaleString()}</p>
                  <p>邮箱：{order.email}</p>
                  <p>微信号：{order.wechat || "-"}</p>
                  <p>套餐：{order.plan}</p>
                  <p>金额：¥{order.amount}</p>
                  <p>支付方式：{order.channel}</p>
                  <p>付款备注：{order.payer_note || "-"}</p>
                  {order.reviewed_by ? <p>审核人：{order.reviewed_by}</p> : null}
                  {order.reviewed_at ? (
                    <p>审核时间：{new Date(order.reviewed_at).toLocaleString()}</p>
                  ) : null}
                  {order.reviewed_note ? <p>审核备注：{order.reviewed_note}</p> : null}
                </div>
                {viewStatus === "pending_review" && (
                  <>
                    <div className="mt-4">
                      <p className="text-sm mb-1">审核备注（可选）</p>
                      <Input
                        value={notes[order.order_no] ?? ""}
                        onChange={(e) =>
                          setNotes((prev) => ({ ...prev, [order.order_no]: e.target.value }))
                        }
                        placeholder="例如：已在微信账单核验到账"
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        onClick={() => reviewOrder(order.order_no, "paid_confirmed")}
                        disabled={loading}
                      >
                        确认收款
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => reviewOrder(order.order_no, "rejected")}
                        disabled={loading}
                      >
                        驳回订单
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

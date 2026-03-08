"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderItem = {
  order_no: string;
  plan: string;
  amount: number;
  channel: string;
  status: string;
  created_at: string;
  paid_at?: string | null;
  reviewed_note?: string | null;
  download_claimed?: boolean;
  download_claim?: { claimed_at: string; platform: string } | null;
};

type TicketItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  resolution_note?: string | null;
  created_at: string;
  updated_at: string;
};

export default function MePage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredEmail, setPreferredEmail] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [orderNo, setOrderNo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        setLoggedIn(Boolean(data?.loggedIn));
        setPhone(String(data?.phone ?? ""));
        const pre = String(data?.profile?.preferred_email ?? "");
        setPreferredEmail(pre);
        if (pre) {
          setEmail(pre);
        }
      } catch {
        setLoggedIn(false);
      }
    };
    void run();
  }, []);

  const loadOrders = async () => {
    if (!email.trim()) {
      setMessage("请先输入下单邮箱。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/user/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "查询订单失败");
        return;
      }
      setOrders(data.orders ?? []);
      setMessage("订单已刷新。");
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const savePreferredEmail = async () => {
    if (!email.trim()) {
      setMessage("请先输入邮箱。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferredEmail: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "保存失败");
        return;
      }
      const pre = String(data?.profile?.preferred_email ?? email.trim());
      setPreferredEmail(pre);
      setEmail(pre);
      setMessage("默认邮箱已保存。");
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    if (!email.trim()) {
      setMessage("请先输入下单邮箱。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/user/tickets?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "查询工单失败");
        return;
      }
      setTickets(data.tickets ?? []);
      setMessage("工单已刷新。");
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const submitTicket = async () => {
    if (!email.trim() || !orderNo.trim() || !title.trim() || !description.trim()) {
      setMessage("请填写完整工单信息。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          orderNo: orderNo.trim(),
          title: title.trim(),
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "提交失败");
        return;
      }
      setMessage("工单提交成功。");
      setTitle("");
      setDescription("");
      await loadTickets();
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h1 className="text-2xl font-semibold mb-2">我的页面</h1>
              <p className="text-sm text-muted-foreground mb-4">请先手机号登录后再查看订单和工单。</p>
              <Button asChild>
                <Link href="/login?redirect=/me">去登录</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-1">我的页面</h1>
            <p className="text-sm text-muted-foreground mb-4">当前登录手机号：{phone || "-"}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <p className="text-sm mb-1">下单邮箱</p>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入你支付时使用的邮箱"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button variant="outline" onClick={savePreferredEmail} disabled={loading}>
                  设为默认
                </Button>
                <Button variant="outline" onClick={loadOrders} disabled={loading}>
                  查订单
                </Button>
                <Button variant="outline" onClick={loadTickets} disabled={loading}>
                  查工单
                </Button>
              </div>
            </div>
            {preferredEmail ? (
              <p className="text-xs text-muted-foreground mt-2">当前默认邮箱：{preferredEmail}</p>
            ) : null}
            {message && <p className="text-sm mt-3">{message}</p>}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">提交安装工单</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm mb-1">订单号</p>
                <Input value={orderNo} onChange={(e) => setOrderNo(e.target.value)} placeholder="例如 OC2026..." />
              </div>
              <div>
                <p className="text-sm mb-1">问题标题</p>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：安装到 npm install 报错" />
              </div>
              <div>
                <p className="text-sm mb-1">问题描述</p>
                <textarea
                  className="w-full min-h-28 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请贴报错信息、你执行到哪一步、系统版本"
                />
              </div>
              <Button onClick={submitTicket} disabled={loading}>
                提交工单
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">我的订单</h2>
            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.order_no} className="rounded-lg border border-border p-3 text-sm">
                  <p>订单号：{o.order_no}</p>
                  <p>套餐：{o.plan} / 金额：¥{o.amount}</p>
                  <p>状态：{o.status}</p>
                  <p>创建时间：{new Date(o.created_at).toLocaleString()}</p>
                  {o.plan === "auto_49" && o.status === "paid_confirmed" ? (
                    <p className="text-muted-foreground">
                      下载状态：
                      {o.download_claimed
                        ? `已下载（${o.download_claim?.platform ?? "-"}，${o.download_claim?.claimed_at ? new Date(o.download_claim.claimed_at).toLocaleString() : "-"})`
                        : "未下载"}
                    </p>
                  ) : null}
                  <div className="mt-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/me/orders/${encodeURIComponent(o.order_no)}?email=${encodeURIComponent(email.trim())}`}>
                        查看详情
                      </Link>
                    </Button>
                    {o.plan === "auto_49" && o.status === "paid_confirmed" && !o.download_claimed ? (
                      <Button asChild size="sm" className="ml-2">
                        <Link href={`/download/center?orderNo=${encodeURIComponent(o.order_no)}`}>去下载</Link>
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="text-sm text-muted-foreground">暂无订单（先输入邮箱后点“查订单”）。</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">我的工单</h2>
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="rounded-lg border border-border p-3 text-sm">
                  <p>标题：{t.title}</p>
                  <p>状态：{t.status}</p>
                  <p>提交时间：{new Date(t.created_at).toLocaleString()}</p>
                  {t.resolution_note ? <p>处理说明：{t.resolution_note}</p> : null}
                </div>
              ))}
              {tickets.length === 0 && <p className="text-sm text-muted-foreground">暂无工单（先输入邮箱后点“查工单”）。</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

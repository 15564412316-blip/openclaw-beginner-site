"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TicketItem = {
  id: string;
  title: string;
  description: string;
  status: "open" | "processing" | "resolved" | "closed";
  resolution_note?: string | null;
  email: string;
  created_at: string;
  updated_at: string;
  order?: { order_no?: string; plan?: string; status?: string } | null;
};

export default function AdminTicketsPage() {
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"open" | "processing" | "resolved" | "closed">("open");
  const [q, setQ] = useState("");
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!token.trim()) {
      setMessage("请先输入后台口令。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const params = new URLSearchParams({ status });
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/admin/tickets?${params.toString()}`, {
        headers: { "x-admin-token": token.trim() },
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "加载失败");
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

  const updateTicket = async (ticketId: string, nextStatus: "processing" | "resolved" | "closed") => {
    if (!token.trim()) {
      setMessage("请先输入后台口令。");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/tickets/review", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token.trim() },
        body: JSON.stringify({
          ticketId,
          nextStatus,
          note: notes[ticketId] ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setMessage(data?.message ?? "更新失败");
        return;
      }
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: nextStatus, resolution_note: notes[ticketId] ?? t.resolution_note }
            : t
        )
      );
      setMessage("工单状态已更新。");
    } catch {
      setMessage("网络异常，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">工单处理后台</h1>
        <p className="text-sm text-muted-foreground mb-6">处理用户安装问题，更新工单状态与处理说明。</p>
        <div className="mb-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">去订单审核后台</Link>
          </Button>
        </div>

        <Card className="border-border/50 mb-6">
          <CardContent className="p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ADMIN_REVIEW_TOKEN"
              />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索邮箱/标题/描述" />
              <div className="flex flex-wrap gap-2">
                <Button variant={status === "open" ? "default" : "outline"} onClick={() => setStatus("open")}>
                  open
                </Button>
                <Button variant={status === "processing" ? "default" : "outline"} onClick={() => setStatus("processing")}>
                  processing
                </Button>
                <Button variant={status === "resolved" ? "default" : "outline"} onClick={() => setStatus("resolved")}>
                  resolved
                </Button>
                <Button variant={status === "closed" ? "default" : "outline"} onClick={() => setStatus("closed")}>
                  closed
                </Button>
              </div>
              <Button onClick={load} disabled={loading}>{loading ? "处理中..." : "刷新工单"}</Button>
            </div>
            {message && <p className="text-sm">{message}</p>}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {tickets.map((t) => (
            <Card key={t.id} className="border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <p>邮箱：{t.email}</p>
                  <p>状态：{t.status}</p>
                  <p>订单：{t.order?.order_no ?? "-"}</p>
                  <p>套餐：{t.order?.plan ?? "-"}</p>
                  <p>标题：{t.title}</p>
                  <p>提交时间：{new Date(t.created_at).toLocaleString()}</p>
                </div>
                <p className="text-sm mt-2 whitespace-pre-wrap">{t.description}</p>
                <div className="mt-3">
                  <Input
                    value={notes[t.id] ?? t.resolution_note ?? ""}
                    onChange={(e) => setNotes((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    placeholder="处理说明（用户可见）"
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" onClick={() => updateTicket(t.id, "processing")} disabled={loading}>
                    标记 processing
                  </Button>
                  <Button onClick={() => updateTicket(t.id, "resolved")} disabled={loading}>
                    标记 resolved
                  </Button>
                  <Button variant="destructive" onClick={() => updateTicket(t.id, "closed")} disabled={loading}>
                    标记 closed
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

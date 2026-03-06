"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const DAILY_LIMIT = 10;
const STORAGE_DATE_KEY = "ai_helper_usage_date";
const STORAGE_COUNT_KEY = "ai_helper_usage_count";

function getToday() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function getUsageCount() {
  if (typeof window === "undefined") return 0;
  const today = getToday();
  const storedDate = localStorage.getItem(STORAGE_DATE_KEY);
  const storedCount = Number(localStorage.getItem(STORAGE_COUNT_KEY) ?? "0");

  if (storedDate !== today) {
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_COUNT_KEY, "0");
    return 0;
  }

  return Number.isFinite(storedCount) ? storedCount : 0;
}

function incrementUsageCount() {
  if (typeof window === "undefined") return;
  const today = getToday();
  const count = getUsageCount() + 1;
  localStorage.setItem(STORAGE_DATE_KEY, today);
  localStorage.setItem(STORAGE_COUNT_KEY, String(count));
}

export function AIHelperWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "你好，我是安装助手。你可以直接问：安装卡住了怎么办？",
    },
  ]);

  const remaining = Math.max(0, DAILY_LIMIT - getUsageCount());

  const sendMessage = async () => {
    const question = input.trim();
    if (!question || loading) return;
    if (remaining <= 0) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "你今天的免费问答次数已用完。可以先看 FAQ，或明天继续问我。" },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      incrementUsageCount();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `${data?.answer ?? "我暂时没有理解你的问题。"} ` },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "网络有点问题，请稍后再试。你也可以先去 FAQ 页面。" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!open ? (
        <Button onClick={() => setOpen(true)}>安装助手</Button>
      ) : (
        <div className="w-[320px] rounded-xl border border-border bg-background shadow-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <p className="text-sm font-semibold">安装助手</p>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              关闭
            </Button>
          </div>

          <div className="h-[280px] overflow-y-auto p-3 space-y-2">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`text-sm rounded-lg px-3 py-2 ${
                  m.role === "assistant" ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div className="px-3 pb-2">
            <p className="text-xs text-muted-foreground mb-2">
              今日剩余问答次数：{remaining}/{DAILY_LIMIT}
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="比如：npm install 失败怎么办？"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />
              <Button onClick={sendMessage} disabled={loading}>
                发送
              </Button>
            </div>
            <div className="mt-2 text-xs">
              <Link href="/faq" className="text-primary hover:underline">
                去 FAQ 看完整答案
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INSTALL_STEPS } from "@/lib/installSteps";

const STORAGE_KEY = "oc_install_completed_steps_v1";

export default function InstallOverviewPage() {
  const [completed] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const nextStep = useMemo(
    () => INSTALL_STEPS.find((s) => !completed.includes(s.slug))?.slug ?? INSTALL_STEPS[0].slug,
    [completed]
  );
  const nextIndex = useMemo(
    () => INSTALL_STEPS.findIndex((s) => s.slug === nextStep),
    [nextStep]
  );

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">安装向导总览（Windows 稳定路线）</h1>
          <p className="text-muted-foreground">
            路径：Windows -&gt; WSL2 -&gt; Ubuntu -&gt; OpenClaw。按顺序完成，成功率最高。
          </p>
        </div>

        <p className="text-sm text-muted-foreground mb-5">
          已完成：{completed.length} / {INSTALL_STEPS.length}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {INSTALL_STEPS.map((step, idx) => (
            <Card
              key={step.slug}
              className={`border-border/50 ${completed.includes(step.slug) ? "border-green-500/40 bg-green-500/5" : ""}`}
            >
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">第 {idx + 1} 步</p>
                <h2 className="text-lg font-semibold mb-2">{step.shortTitle}</h2>
                <p className="text-sm text-muted-foreground mb-4">{step.goal}</p>
                {completed.includes(step.slug) ? (
                  <p className="text-xs text-green-600 mb-3">已完成</p>
                ) : idx === nextIndex ? (
                  <p className="text-xs text-blue-600 mb-3">当前应做</p>
                ) : idx > nextIndex ? (
                  <p className="text-xs text-amber-600 mb-3">未解锁（请先完成前一步）</p>
                ) : (
                  <p className="text-xs text-muted-foreground mb-3">未完成</p>
                )}
                {idx > nextIndex ? (
                  <Button variant="outline" size="sm" disabled>
                    先完成前一步
                  </Button>
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/install/${step.slug}`}>进入这一步</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/install/${nextStep}`}>{completed.length > 0 ? "继续下一步" : "从第 1 步开始"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/faq">先看常见问题</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

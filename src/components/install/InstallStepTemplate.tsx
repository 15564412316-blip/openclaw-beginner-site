"use client";

import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InstallStep } from "@/lib/installSteps";

type Props = {
  step: InstallStep;
  index: number;
  total: number;
};

export function InstallStepTemplate({ step, index, total }: Props) {
  const [copiedCommand, setCopiedCommand] = useState<string>("");

  const copyCmd = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(cmd);
      setTimeout(() => setCopiedCommand(""), 1500);
    } catch {
      setCopiedCommand("");
    }
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <p className="text-xs text-muted-foreground mb-2">
              当前进度：第 {index + 1} / {total} 步
            </p>
            <h1 className="text-2xl font-semibold mb-2">{step.title}</h1>
            <p className="text-sm text-muted-foreground">{step.goal}</p>
          </CardContent>
        </Card>

        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">先做这一步（最重要）</h2>
            <p className="text-sm text-muted-foreground mb-3">
              目标：{step.goal}
            </p>
            {step.terminalHint ? (
              <div className="mt-4 p-3 rounded-md bg-secondary/50 text-sm">
                终端怎么开：{step.terminalHint}
              </div>
            ) : null}
            {step.pathHint ? (
              <div className="mt-2 p-3 rounded-md bg-secondary/50 text-sm">
                打开路径：{step.pathHint}
              </div>
            ) : null}
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.actions.map((a, idx) => (
                <p key={a}>
                  <span className="text-foreground mr-1">{idx + 1}.</span>
                  {a}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {step.commands && step.commands.length > 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">命令区（点按钮复制）</h2>
              <p className="text-xs text-muted-foreground mb-3">
                不用手打，直接复制 → 粘贴到终端 → 回车执行。
              </p>
              <div className="space-y-2">
                {step.commands.map((cmd, idx) => (
                  <div key={cmd} className="rounded-md border p-3 bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">命令 {idx + 1}</p>
                    <code className="text-sm break-all block mb-2">{cmd}</code>
                    <Button size="sm" variant="outline" onClick={() => copyCmd(cmd)}>
                      {copiedCommand === cmd ? "已复制" : "复制命令"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">成功长这样</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.successSignals.map((s) => (
                <p key={s}>• {s}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">不成功常见长这样</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.failSignals.map((s) => (
                <p key={s}>• {s}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {step.taskTemplates && step.taskTemplates.length > 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">首次任务模板（直接可用）</h2>
              <p className="text-xs text-muted-foreground mb-3">
                复制任意一个模板先跑通，后续再决定是否配置 API Key。
              </p>
              <div className="space-y-3">
                {step.taskTemplates.map((tpl) => (
                  <div key={tpl.title} className="rounded-md border p-3">
                    <p className="font-medium text-sm mb-2">{tpl.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">{tpl.prompt}</p>
                    <Button size="sm" variant="outline" onClick={() => copyCmd(tpl.prompt)}>
                      {copiedCommand === tpl.prompt ? "已复制" : "复制模板"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/install">返回总览</Link>
          </Button>
          {step.nextSlug ? (
            <Button asChild>
              <Link href={`/install/${step.nextSlug}`}>下一步</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/install">完成安装流程</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

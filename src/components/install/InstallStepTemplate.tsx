"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InstallStep } from "@/lib/installSteps";

type Props = {
  step: InstallStep;
  index: number;
  total: number;
};

const STORAGE_KEY = "oc_install_completed_steps_v1";

export function InstallStepTemplate({ step, index, total }: Props) {
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});
  const [copiedCommand, setCopiedCommand] = useState<string>("");
  const [detectionPassed, setDetectionPassed] = useState(false);
  const [checkedSignals, setCheckedSignals] = useState<Record<string, boolean>>({});
  const allChecked = useMemo(
    () => step.actions.every((a) => checkedActions[a]),
    [checkedActions, step.actions]
  );
  const allSignalsChecked = useMemo(
    () => step.successSignals.every((s) => checkedSignals[s]),
    [checkedSignals, step.successSignals]
  );

  const toggleAction = (action: string) => {
    setCheckedActions((prev) => ({ ...prev, [action]: !prev[action] }));
  };
  const toggleSignal = (signal: string) => {
    setCheckedSignals((prev) => ({ ...prev, [signal]: !prev[signal] }));
  };

  const copyCmd = async (cmd: string) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedCommand(cmd);
      setTimeout(() => setCopiedCommand(""), 1500);
    } catch {
      setCopiedCommand("");
    }
  };

  const markDone = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? (JSON.parse(raw) as string[]) : [];
      const next = Array.from(new Set([...list, step.slug]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore local cache failure
    }
  };

  const terminalHint = (() => {
    if (step.slug === "windows-check") {
      return "这一步不用终端，先在 Windows 设置里看版本即可。";
    }
    if (step.slug === "wsl2") {
      return "请打开 Windows 里的 PowerShell（右键“以管理员身份运行”）。";
    }
    return "请打开 Ubuntu 终端（黑色窗口），命令都在 Ubuntu 里执行。";
  })();

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
            <p className="text-xs text-muted-foreground mt-2">你现在就在这一步，做完再去下一步。</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">先看懂这一步（30 秒）</h2>
            <p className="text-sm text-muted-foreground">{step.goal}</p>
            <h3 className="text-base font-medium mt-4 mb-2">为什么必须做</h3>
            <p className="text-sm text-muted-foreground">{step.why}</p>
            <div className="mt-4 p-3 rounded-md bg-secondary/50 text-sm">
              终端说明：{terminalHint}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">按顺序操作（照着做就行）</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.actions.map((a, idx) => (
                <label key={a} className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={Boolean(checkedActions[a])}
                    onChange={() => toggleAction(a)}
                  />
                  <span>
                    <span className="text-foreground mr-1">{idx + 1}.</span>
                    {a}
                  </span>
                </label>
              ))}
            </div>
            {step.pathHint ? (
              <div className="mt-4 p-3 rounded-md bg-secondary/50 text-sm">
                操作路径：{step.pathHint}
              </div>
            ) : null}
          </CardContent>
        </Card>

        {step.commands && step.commands.length > 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-2">命令区（点按钮复制）</h2>
              <p className="text-xs text-muted-foreground mb-3">
                不用手打代码，直接点“复制命令”，粘贴到上面提到的终端里执行。
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

        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">检测区（确认你已看到成功结果）</h2>
            <p className="text-sm text-muted-foreground mb-3">
              勾选你看到的成功标志，然后点“本步通过”。
            </p>
            <div className="space-y-2 mb-3 text-sm">
              {step.successSignals.map((s) => (
                <label key={s} className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" checked={Boolean(checkedSignals[s])} onChange={() => toggleSignal(s)} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <Button
              variant={detectionPassed ? "default" : "outline"}
              disabled={!allSignalsChecked}
              onClick={() => setDetectionPassed((v) => !v)}
            >
              {detectionPassed ? "已确认：本步通过" : "点击确认：本步通过"}
            </Button>
          </CardContent>
        </Card>

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
            <div className="space-y-3 text-sm">
              {step.commonIssues.map((i) => (
                <div key={i.title}>
                  <p className="font-medium">{i.title}</p>
                  <p className="text-muted-foreground">{i.fix}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">截图参考区（可视化）</h2>
            <p className="text-sm text-muted-foreground mb-3">
              这里可以放“成功截图/失败截图”。你发我截图后，我会直接替换到对应步骤。
            </p>
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              截图占位（待替换）
            </div>
          </CardContent>
        </Card>

        {step.failScenarios && step.failScenarios.length > 0 ? (
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">如果这一步失败，先这样处理</h2>
              <div className="space-y-3 text-sm">
                {step.failScenarios.map((i) => (
                  <div key={i.scene}>
                    <p className="font-medium">{i.scene}</p>
                    <p className="text-muted-foreground">{i.action}</p>
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
          <Button onClick={markDone} disabled={!allChecked || !detectionPassed} variant="outline">
            标记本步已完成
          </Button>
          {step.nextSlug ? (
            <Button asChild>
              <Link href={`/install/${step.nextSlug}`}>下一步</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/first-task">去首次任务模板</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InstallStep } from "@/lib/installSteps";

type Props = {
  step: InstallStep;
  index: number;
  total: number;
};

export function InstallStepTemplate({ step, index, total }: Props) {
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

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-2">这一步是做什么的</h2>
            <p className="text-sm text-muted-foreground">{step.goal}</p>
            <h3 className="text-base font-medium mt-4 mb-2">为什么必须做</h3>
            <p className="text-sm text-muted-foreground">{step.why}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">你需要做的操作</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.actions.map((a) => (
                <p key={a}>• {a}</p>
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
              <h2 className="text-lg font-semibold mb-3">命令区（可复制）</h2>
              <div className="space-y-2">
                {step.commands.map((cmd) => (
                  <div key={cmd} className="rounded-md border p-3 bg-muted/30">
                    <code className="text-sm break-all">{cmd}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">成功后你会看到什么</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              {step.successSignals.map((s) => (
                <p key={s}>• {s}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-3">常见问题与解决建议</h2>
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
              <Link href="/first-task">去首次任务模板</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { INSTALL_STEPS } from "@/lib/installSteps";

export default function InstallOverviewPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Windows 安装总览（简化版）</h1>
          <p className="text-muted-foreground">
            一共 {INSTALL_STEPS.length} 步。每一步都只有：怎么做、复制命令、成功/失败对比、下一步。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {INSTALL_STEPS.map((step, idx) => (
            <Card key={step.slug} className="border-border/50">
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-1">第 {idx + 1} 步</p>
                <h2 className="text-lg font-semibold mb-2">{step.shortTitle}</h2>
                <p className="text-sm text-muted-foreground mb-4">{step.goal}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/install/${step.slug}`}>进入这一步</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/install/${INSTALL_STEPS[0].slug}`}>从第 1 步开始</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/guide">返回系统引导</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

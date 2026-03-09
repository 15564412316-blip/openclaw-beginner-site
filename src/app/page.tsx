import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="text-center">
          <p className="text-sm text-primary mb-2">OpenClaw Windows 稳定安装引导</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            零基础也能装好 OpenClaw
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            我们不做原生 Windows 强行一键，而是用更稳定的 WSL2 + Ubuntu 路线，
            一步一步带你完成安装、配置和首次任务。
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/pricing">立即开通（49.9 元）</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/install">先看安装总览</Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">适合谁</h2>
              <p className="text-sm text-muted-foreground">
                适合想快速装好 OpenClaw、但不想在原生 Windows 环境里反复踩坑的用户。
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">为什么是 WSL2</h2>
              <p className="text-sm text-muted-foreground">
                原生 Windows 变量太多。WSL2 + Ubuntu 更接近 Linux 环境，稳定性更高，失败率更低。
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">你买到什么</h2>
              <p className="text-sm text-muted-foreground">
                49.9 元获得完整分步路径、关键检测说明、常见错误解释、API 配置和首次任务模板。
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">安装流程总览（9 步）</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <p>1. 检查 Windows 版本</p>
            <p>2. 安装 WSL2</p>
            <p>3. 安装 Ubuntu</p>
            <p>4. 初始化 Ubuntu</p>
            <p>5. 验证 Linux 环境</p>
            <p>6. 安装 OpenClaw</p>
            <p>7. 配置 Provider / API Key</p>
            <p>8. 运行首次任务</p>
            <p>9. 后续启动与常见问题</p>
          </div>
          <div className="mt-4">
            <Button asChild variant="outline">
              <Link href="/faq">查看常见问题</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ v?: string }>;
};

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const variant = params.v === "b" ? "b" : "a";
  const copy =
    variant === "b"
      ? {
          title: "花 49.9，把 OpenClaw 真正装好并跑起来",
          subtitle:
            "我们不卖“看起来很厉害的一键脚本”，我们卖的是你能完成交付的安装路径。",
          cta: "开通并开始闯关安装",
        }
      : {
          title: "零基础也能装好 OpenClaw",
          subtitle:
            "我们不做原生 Windows 强行一键，而是用更稳定的 WSL2 + Ubuntu 路线，一步一步带你完成安装、配置和首次任务。",
          cta: "立即开通（49.9 元）",
        };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <section className="text-center">
          <p className="text-sm text-primary mb-2">OpenClaw 安装引导（Windows + Mac）</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {copy.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            {copy.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/pricing">{copy.cta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/install">Windows：看安装总览</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/guide/local?system=macos">Mac：继续原安装方案</Link>
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
              <h2 className="font-semibold mb-2">Mac 用户</h2>
              <p className="text-sm text-muted-foreground">
                Mac 路线保持原方案不变，可直接按你熟悉的本地部署教程继续安装。
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
          <h2 className="text-2xl font-bold mb-4">Windows 安装流程总览（9 步）</h2>
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
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/faq">查看常见问题</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/guide/local?system=macos">Mac 用户直接进入原教程</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

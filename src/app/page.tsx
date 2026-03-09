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
          <p className="text-sm text-primary mb-2">OpenClaw 安装引导服务</p>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {copy.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            不管你是 Windows 还是 Mac，先告诉我们你的情况，再给你对应方案。
            {variant === "b" ? " " + copy.subtitle : ""}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/guide">立即安装</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">查看 49.9 服务说明</Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">适合谁</h2>
              <p className="text-sm text-muted-foreground">
                适合想把 OpenClaw 真正装好、并且愿意按步骤操作的用户。
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">支持系统</h2>
              <p className="text-sm text-muted-foreground">
                Windows 与 Mac 都支持。先在引导页选择系统，再进入对应安装路径。
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-6">
              <h2 className="font-semibold mb-2">核心目标</h2>
              <p className="text-sm text-muted-foreground">
                不是追求炫酷自动化，而是让你以更高成功率完成安装并跑通首次任务。
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
          <h2 className="text-2xl font-bold mb-4">你会得到什么</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
            <p>1. 先做系统与难度选择</p>
            <p>2. Windows 路径已压缩为 6 步</p>
            <p>3. 每一步有实操步骤</p>
            <p>4. 每一步有复制命令按钮</p>
            <p>5. 每一步有成功/失败对比</p>
            <p>6. API Key 配置说明</p>
            <p>7. 首次任务模板</p>
            <p>8. 后续启动方式</p>
            <p>9. 目标是让你真正跑通</p>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/guide">现在开始引导</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/faq">查看常见问题</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  searchParams: Promise<{ v?: string }>;
};

export default async function PricingPage({ searchParams }: Props) {
  const params = await searchParams;
  const variant = params.v === "b" ? "b" : "a";
  const intro =
    variant === "b"
      ? "不是卖脚本，是卖成功安装结果。"
      : "Windows 与 Mac 都支持，统一 49.9 元引导交付。";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">安装方案与价格</h1>
        <p className="text-muted-foreground text-center mb-8">
          {intro}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/30 ring-1 ring-primary/20">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">统一服务（Windows / Mac：49.9）</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Windows：WSL2 + Ubuntu 稳定引导路径</p>
                <p>• Mac：原安装方案保持不变</p>
                <p>• 分步骤引导页面（每步都有目的、操作、成功标志、常见问题）</p>
                <p>• API Key 配置说明</p>
                <p>• 首次任务模板</p>
                <p>• 安装后启动与使用说明</p>
              </div>

              <h3 className="text-base font-semibold pt-2">不包含内容</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• 不承诺所有环境都能全自动一键成功</p>
                <p>• 不代买 API Key，不托管用户 Key</p>
                <p>• 不承诺无限售后</p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/checkout">立即开通 49.9 引导</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/guide">先做系统引导</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Mac 方案说明</h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• 继续使用原有 Mac 本地安装教程（不改原流程）</p>
                <p>• 支持一键脚本入口，但仍建议先做环境检查</p>
                <p>• 引导页会根据你选择自动跳转 Mac 方案</p>
              </div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button asChild variant="outline">
                  <Link href="/guide/local?system=macos">直接看 Mac 原教程</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

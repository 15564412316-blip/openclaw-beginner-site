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
      : "Windows 用户稳定安装引导（WSL2 + Ubuntu 路线）";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">49.9 元 / 次</h1>
        <p className="text-muted-foreground text-center mb-8">
          {intro}
        </p>

        <Card className="border-primary/30 ring-1 ring-primary/20">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">包含内容</h2>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• Windows -&gt; WSL2 -&gt; Ubuntu 的完整安装路径</p>
              <p>• 分步骤引导页面（每步都有目的、操作、成功标志、常见问题）</p>
              <p>• API Key 配置说明</p>
              <p>• 首次任务模板</p>
              <p>• 安装后启动与使用说明</p>
            </div>

            <h3 className="text-base font-semibold pt-2">不包含内容</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• 不承诺原生 Windows 全自动一键成功</p>
              <p>• 不代买 API Key，不托管用户 Key</p>
              <p>• 不承诺无限售后</p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/checkout">立即开通 49.9 引导</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/faq">先看 FAQ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

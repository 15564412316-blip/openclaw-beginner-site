import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function APIKeyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <div>
          <h1 className="text-3xl font-bold mb-2">模型接入配置（API Key）</h1>
          <p className="text-muted-foreground">
            这是安装后的进阶配置，不是核心安装必做步骤。需要更强模型能力时再配置即可。
          </p>
        </div>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-3 text-sm text-muted-foreground">
            <p>为什么需要 API Key：它相当于你调用模型平台的“授权凭证”。</p>
            <p>支持平台：智谱、OpenRouter、SiliconFlow 等。</p>
            <p>建议：新手先选一个平台，先跑通第一个任务，再考虑切换。</p>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="p-6 space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">重要说明</p>
            <p>1. 你的 Key 由你自己保管，我们不代充、不托管。</p>
            <p>2. 不要把 Key 发给他人或上传到公开仓库。</p>
            <p>3. 如怀疑泄露，请立刻去平台后台重置 Key。</p>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="p-6 text-sm">
            <p className="font-medium mb-2">如何验证 Key 可用</p>
            <p className="text-muted-foreground">配置完成后，执行一次最简单任务（比如“总结网页”）。能返回结果即表示可用。</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/first-task">去首次任务模板</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/install/provider">返回安装第 7 步</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

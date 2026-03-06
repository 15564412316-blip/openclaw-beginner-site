import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DemoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">5 分钟快速体验</h1>
        <p className="text-muted-foreground mb-8">
          先看一遍完整流程，再决定走本地安装还是云端部署。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/guide">开始路径选择</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/tasks">查看任务模板</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

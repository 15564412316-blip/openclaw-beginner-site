import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FirstUsePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">首次使用</h1>
        <p className="text-muted-foreground mb-8">
          安装后可直接从任务模板开始，快速感受 OpenClaw 的实际价值。
        </p>
        <Button asChild>
          <Link href="/tasks">查看任务模板</Link>
        </Button>
      </div>
    </div>
  );
}

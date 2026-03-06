import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CloudGuidePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">云端部署（暂不支持）</h1>
        <p className="text-muted-foreground mb-8">
          云端持续运行功能正在开发中，当前版本请先使用本地部署方案。
          <br className="hidden sm:block" />
          后续支持后会在本页第一时间更新。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/guide/local">先走本地安装</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/faq">查看常见问题</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

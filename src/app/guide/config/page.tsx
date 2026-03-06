import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuideConfigPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">配置说明</h1>
        <p className="text-muted-foreground mb-8">
          推荐先在 API Key 中心了解密钥准备方式，再回到安装流程完成配置。
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link href="/api-key">前往 API Key 中心</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/guide/local">返回本地安装</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

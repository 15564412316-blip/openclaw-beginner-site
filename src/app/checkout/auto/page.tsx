import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutAutoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">自动安装支付（占位）</h1>
        <p className="text-muted-foreground mb-6">
          这里将接入 49.9 的实际支付流程（Stripe/国内支付）。支付成功后解锁自动安装服务。
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/guide/local">返回安装页</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/guide/local?paid_auto=1">模拟支付成功并查看详细步骤</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">返回价格页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

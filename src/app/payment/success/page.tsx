import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-3">支付成功</h1>
        <p className="text-muted-foreground mb-6">
          订单已确认。你现在可以去安装页领取脚本并开始自动安装流程。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/guide/local?paid_auto=1">去安装页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/me">去我的页面</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

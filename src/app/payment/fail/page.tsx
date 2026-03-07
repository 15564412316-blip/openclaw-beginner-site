import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-3">支付未完成</h1>
        <p className="text-muted-foreground mb-6">
          订单暂未确认成功。请回到支付页继续支付，或在“我的页面”查看订单状态。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link href="/checkout/auto">返回支付页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/me">去我的页面</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

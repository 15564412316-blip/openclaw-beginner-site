import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManualPayPanel } from "@/components/checkout/ManualPayPanel";

export default function CheckoutSupportPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">一对一代办服务（¥99）</h1>
        <p className="text-muted-foreground mb-6 text-center">
          适合完全不想自己操作的用户。该服务是独立方案，可直接购买，不依赖 49.9 套餐。
        </p>

        <ManualPayPanel
          plan="vip_99"
          amount={99}
          title="微信/支付宝收款码支付"
          description="扫码付款后提交人工确认，确认成功后会安排一对一代办安装。"
          extraNote="服务边界：仅包含安装与基础排障，不包含长期代运维。"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/pricing">返回价格页</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/guide/local">返回安装页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

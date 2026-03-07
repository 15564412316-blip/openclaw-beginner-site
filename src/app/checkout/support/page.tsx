import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HostedPaymentPanel } from "@/components/checkout/HostedPaymentPanel";

export default function CheckoutSupportPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">一对一代办服务（¥199）</h1>
        <p className="text-muted-foreground mb-6 text-center">
          适合完全不想自己操作的用户。支付后自动确认订单，不依赖人工核账。
        </p>

        <HostedPaymentPanel
          plan="vip_99"
          amount={199}
          title="托管收银台支付"
          description="先创建订单，再跳转支付页完成付款。支付回调成功后会自动进入服务处理。"
          successPath="/contact"
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

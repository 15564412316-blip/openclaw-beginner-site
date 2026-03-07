import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ManualPayPanel } from "@/components/checkout/ManualPayPanel";

export default function CheckoutAutoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">自动安装服务（¥49.9）</h1>
        <p className="text-muted-foreground mb-6 text-center">
          支付后即可进入自动安装流程。49.9 已包含安装失败协助，不需要额外升级付费。
        </p>

        <ManualPayPanel
          plan="auto_49"
          amount={49.9}
          title="微信/支付宝收款码支付"
          description="扫码付款后，点击“我已付款，提交人工确认”。确认后会通知你并开通自动安装步骤。"
          extraNote="退款说明：若自动安装在标准流程下无法完成，可申请退款或协助处理。"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/guide/local?paid_auto=1">已支付用户：直接进入自动安装</Link>
          </Button>
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

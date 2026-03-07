import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HostedPaymentPanel } from "@/components/checkout/HostedPaymentPanel";

export default function CheckoutAutoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">自动安装服务（¥99.9）</h1>
        <p className="text-muted-foreground mb-6 text-center">
          支付完成后自动放行到安装流程，无需人工核对到账。99.9 已包含安装失败协助。
        </p>

        <HostedPaymentPanel
          plan="auto_49"
          amount={99.9}
          title="托管收银台支付"
          description="先创建订单，再跳转支付页完成付款。支付回调成功后会自动开通安装权限。"
          successPath="/guide/local?paid_auto=1"
          extraNote="下载限制：支付成功后直接下载脚本，每个订单仅可下载一次。若需再次下载，请重新购买或联系人工。"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/guide/local?paid_auto=1">已支付用户：直接进入安装</Link>
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

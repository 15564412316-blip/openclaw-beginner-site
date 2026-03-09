import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HostedPaymentPanel } from "@/components/checkout/HostedPaymentPanel";

export default function CheckoutAutoPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-3 text-center">稳定安装引导服务（¥49.9）</h1>
        <p className="text-muted-foreground mb-6 text-center">
          不是原生 Windows 强行一键。支付后进入 WSL2 + Ubuntu 分步引导流程。
        </p>

        <HostedPaymentPanel
          plan="auto_49"
          amount={49.9}
          title="托管收银台支付"
          description="先创建订单，再跳转支付页完成付款。支付成功后自动进入安装总览。"
          successPath="/payment/success"
          extraNote="服务定位：分步引导 + 检测说明 + 常见错误解释。目标是提升安装成功率。"
        />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="secondary">
            <Link href="/install">已支付用户：进入安装总览</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">返回价格页</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

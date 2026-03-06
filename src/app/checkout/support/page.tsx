import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckoutSupportPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">一对一代办支付（占位）</h1>
        <p className="text-muted-foreground mb-6">
          这里将接入 99 的支付流程。适合不想自己操作、希望一对一代办安装的用户。
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/guide/local">返回安装页</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">返回价格页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

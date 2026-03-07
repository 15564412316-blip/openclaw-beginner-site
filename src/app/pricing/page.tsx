import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free",
    name: "手动教程",
    price: "¥0",
    desc: "自己按步骤安装，适合愿意动手的用户。",
    features: ["完整图文步骤", "成功标志引导", "FAQ 常见问题"],
    cta: "免费开始",
    href: "/guide/local",
  },
  {
    id: "auto",
    name: "自动安装",
    price: "¥99.9",
    desc: "下载脚本一键执行，自动检测与安装，包含失败协助。",
    features: ["跨平台脚本", "doctor/install/config/verify", "订单仅限下载 1 次", "安装失败协助（已包含）"],
    cta: "购买自动安装",
    href: "/checkout/auto",
    recommended: true,
  },
  {
    id: "support",
    name: "一对一代办",
    price: "¥199",
    desc: "适合不想自己操作的用户，直接一对一代办安装。",
    features: ["一对一代办安装", "一次性安装排障", "不含长期代运维"],
    cta: "购买一对一代办",
    href: "/checkout/support",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">选择安装方式</h1>
          <p className="text-muted-foreground">默认建议先用自动安装（99.9）；如果你完全不想自己动手，可直接选 199 一对一代办。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.recommended ? "border-primary ring-1 ring-primary/30" : "border-border/50"}
            >
              <CardContent className="p-6">
                {plan.recommended && (
                  <span className="inline-block text-xs px-2 py-1 rounded-full bg-primary/10 text-primary mb-3">
                    推荐
                  </span>
                )}
                <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
                <p className="text-2xl font-bold mb-2">{plan.price}</p>
                <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                <ul className="text-sm text-muted-foreground space-y-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.recommended ? "default" : "outline"}>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

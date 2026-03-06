import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * CTA（行动号召）区组件
 * 引导用户开始使用
 */
export function CTASection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto text-center">
        {/* 装饰图标 */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>

        {/* 标题 */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          准备好开始了吗？
        </h2>

        {/* 描述 */}
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          不要被复杂的安装过程吓到。
          <br className="hidden sm:block" />
          跟着我们的引导，5 分钟就能完成安装，开始体验 AI 自动化的魅力。
        </p>

        {/* 行动按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="gap-2 px-8 h-12 text-base">
            <Link href="/guide">
              立即开始
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2 px-8 h-12 text-base">
            <Link href="/faq">
              还有疑问？先看 FAQ
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

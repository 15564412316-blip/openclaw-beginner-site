import { HeroSection } from "@/components/sections/HeroSection";
import { ValueCardsSection } from "@/components/sections/ValueCardsSection";
import { UserTypesSection } from "@/components/sections/UserTypesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CTASection } from "@/components/sections/CTASection";

/**
 * 首页
 */
export default function Home() {
  return (
    <>
      {/* Hero 区 - 核心价值主张 */}
      <HeroSection />

      {/* 价值卡片区 - 为什么选择我们 */}
      <ValueCardsSection />

      {/* 用户类型入口 - 帮助用户找到适合的路径 */}
      <UserTypesSection />

      {/* 流程展示区 - 上手只需 4 步 */}
      <ProcessSection />

      {/* CTA 区 - 引导开始 */}
      <CTASection />
    </>
  );
}

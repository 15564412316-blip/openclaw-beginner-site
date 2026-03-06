import { CheckCircle2 } from "lucide-react";

/**
 * 流程步骤数据
 */
const steps = [
  {
    step: 1,
    title: "选择安装方式",
    description: "根据你的情况，我们帮你选最合适的方案",
  },
  {
    step: 2,
    title: "获取 API Key",
    description: "教你如何申请和配置 AI 模型的访问密钥",
  },
  {
    step: 3,
    title: "完成安装",
    description: "跟着步骤一步步操作，遇到问题有解答",
  },
  {
    step: 4,
    title: "开始使用",
    description: "用现成的任务模板，立刻体验 AI 自动化",
  },
];

/**
 * 流程展示区组件
 * 展示用户完成入门的步骤
 */
export function ProcessSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 区域标题 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            四步完成入门
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            不需要复杂的配置，跟着步骤走，很快就能用起来
          </p>
        </div>

        {/* 步骤展示 */}
        <div className="relative">
          {/* 连接线 */}
          <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="relative">
                {/* 步骤卡片 */}
                <div className="bg-card border border-border/50 rounded-xl p-6 hover:border-primary/50 transition-colors">
                  {/* 步骤编号 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{item.step}</span>
                    </div>
                    {/* 完成标记（可选显示） */}
                    <CheckCircle2 className="w-5 h-5 text-green-500 opacity-0" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>

                  {/* 描述 */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* 箭头（移动端显示） */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-4 lg:hidden">
                    <svg className="w-6 h-6 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

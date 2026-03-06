import { Card, CardContent } from "@/components/ui/card";
import { Compass, Shield, Zap, Heart } from "lucide-react";

/**
 * 价值卡片数据
 */
const valueCards = [
  {
    icon: Compass,
    title: "路径清晰",
    description: "不知道怎么开始？我们帮你选对安装方式，一步一步引导你完成。",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Shield,
    title: "安全可控",
    description: "API Key 自己管理，数据留在本地或你选择的云端，不代充不托管。",
    gradient: "from-green-500/10 to-emerald-500/10",
    iconColor: "text-green-500",
  },
  {
    icon: Zap,
    title: "快速上手",
    description: "5 分钟完成安装，10 分钟跑通第一个任务，立即感受 AI 自动化的威力。",
    gradient: "from-yellow-500/10 to-orange-500/10",
    iconColor: "text-yellow-500",
  },
  {
    icon: Heart,
    title: "零基础友好",
    description: "不需要懂编程、命令行、服务器。全程中文说明，遇到问题有解答。",
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-500",
  },
];

/**
 * 首页价值卡片区组件
 * 展示产品的核心价值
 */
export function ValueCardsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 区域标题 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            为什么选择这里？
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            我们不是冷冰冰的开发者文档，而是帮你真正解决问题的入门指南
          </p>
        </div>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card
                key={index}
                className={`relative overflow-hidden border-border/50 bg-gradient-to-br ${card.gradient} hover:border-border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group`}
              >
                <CardContent className="p-6">
                  {/* 图标 */}
                  <div className={`w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-lg font-semibold mb-2">{card.title}</h3>

                  {/* 描述 */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

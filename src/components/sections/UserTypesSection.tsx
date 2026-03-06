import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, Briefcase, Wrench } from "lucide-react";

/**
 * 用户类型数据
 */
const userTypes = [
  {
    icon: User,
    title: "完全小白",
    description: "从没用过命令行，不知道什么是终端",
    href: "/guide?level=beginner",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: GraduationCap,
    title: "学生党",
    description: "想用 AI 帮忙写作业、做研究、整理资料",
    href: "/guide?level=student",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Briefcase,
    title: "上班族",
    description: "想自动化处理文档、邮件、报表等日常工作",
    href: "/guide?level=worker",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Wrench,
    title: "有一定基础",
    description: "用过一些开发工具，想快速了解 OpenClaw",
    href: "/guide?level=developer",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

/**
 * 用户类型入口组件
 * 帮助不同类型的用户快速找到适合自己的入口
 */
export function UserTypesSection() {
  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        {/* 区域标题 */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            你是哪种用户？
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            选择最符合你的情况，我们会给你推荐最适合的入门路径
          </p>
        </div>

        {/* 用户类型卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <Link key={index} href={type.href} className="group">
                <Card className="h-full border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {/* 图标 */}
                    <div className={`w-16 h-16 rounded-2xl ${type.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-8 h-8 ${type.color}`} />
                    </div>

                    {/* 标题 */}
                    <h3 className="text-lg font-semibold mb-2">{type.title}</h3>

                    {/* 描述 */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {type.description}
                    </p>

                    {/* 箭头提示 */}
                    <div className="mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      开始
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

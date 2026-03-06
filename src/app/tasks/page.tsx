import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Globe, PenTool, Table, FolderOpen, ArrowRight, Clock, Users } from "lucide-react";

/**
 * 任务模板数据
 */
const taskTemplates = [
  {
    id: "organize-files",
    icon: FolderOpen,
    title: "整理桌面文件",
    description: "让 AI 帮你自动整理桌面上的乱七八糟的文件",
    scenario: "桌面上一堆文件不知道怎么分类",
    input: "请帮我把桌面上的文件按类型分类整理",
    output: "文件被自动移动到「文档」「图片」「压缩包」等文件夹",
    suitable: ["办公族", "学生党", "文件多的用户"],
    difficulty: "简单",
    time: "1-2 分钟",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    id: "summarize-web",
    icon: Globe,
    title: "总结网页内容",
    description: "把长网页的内容总结成要点，节省阅读时间",
    scenario: "看到一个长文章但没时间仔细读",
    input: "请总结这个网页的核心内容：https://example.com/article",
    output: "3-5 个核心要点，加上关键结论",
    suitable: ["信息获取需求大的人", "时间紧张的用户"],
    difficulty: "简单",
    time: "30 秒",
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
  {
    id: "generate-content",
    icon: PenTool,
    title: "生成内容草稿",
    description: "让 AI 帮你写初稿，你只需要润色",
    scenario: "需要写一篇文章但不知道从哪开始",
    input: "请帮我写一篇关于「如何高效学习」的文章大纲和开头",
    output: "完整的文章大纲 + 200 字左右的开头",
    suitable: ["内容创作者", "学生", "需要写材料的人"],
    difficulty: "中等",
    time: "1 分钟",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    id: "text-to-table",
    icon: Table,
    title: "文本转表格",
    description: "把杂乱的文本整理成清晰的表格",
    scenario: "有一段文字需要整理成表格形式",
    input: "请把这段文字整理成表格：张三 25岁 北京 / 李四 30岁 上海...",
    output: "格式整齐的 Markdown 或 Excel 表格",
    suitable: ["数据处理需求的人", "行政人员"],
    difficulty: "简单",
    time: "30 秒",
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500",
  },
  {
    id: "classify-docs",
    icon: FileText,
    title: "自动分类文档",
    description: "根据文档内容自动打标签和分类",
    scenario: "有很多文档需要分类管理",
    input: "请分析这个文档并给它打上合适的标签",
    output: "文档类别 + 3-5 个标签 + 简短摘要",
    suitable: ["知识管理需求的人", "文档多的用户"],
    difficulty: "中等",
    time: "1-2 分钟",
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500",
  },
];

/**
 * 首次任务模板页面
 */
export default function TasksPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            安装完能做什么？
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            这些是 OpenClaw 最常见的使用场景。
            <br className="hidden sm:block" />
            安装完成后，你可以直接用这些任务开始体验。
          </p>
        </div>

        {/* 任务卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {taskTemplates.map((task) => {
            const Icon = task.icon;
            return (
              <Card
                key={task.id}
                className="border-border/50 hover:border-primary/50 transition-all group"
              >
                <CardContent className="p-6">
                  {/* 头部 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${task.iconBg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 ${task.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-1">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  {/* 场景 */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-1">使用场景</p>
                    <p className="text-sm">{task.scenario}</p>
                  </div>

                  {/* 输入输出示例 */}
                  <div className="space-y-3 mb-4">
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">你说</p>
                      <p className="text-sm font-mono">{task.input}</p>
                    </div>
                    <div className="bg-primary/5 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">AI 回复</p>
                      <p className="text-sm">{task.output}</p>
                    </div>
                  </div>

                  {/* 底部信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {task.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {task.suitable[0]}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.difficulty === "简单"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-yellow-500/10 text-yellow-600"
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 底部引导 */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            想好要做什么了吗？现在就开始安装吧！
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="/guide">
              开始安装
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const templates = [
  {
    title: "总结网页",
    prompt: "请帮我总结这个网页的核心观点，输出 5 条要点。",
  },
  {
    title: "整理文件",
    prompt: "请按主题整理这个文件夹，并给出重命名建议。",
  },
  {
    title: "生成内容草稿",
    prompt: "请基于这个主题输出一份 800 字中文草稿，语气专业但通俗。",
  },
  {
    title: "文本分类",
    prompt: "把这批文本按“咨询/投诉/建议/其他”分类，并给出理由。",
  },
  {
    title: "文档转结构化表格",
    prompt: "把文档中的关键信息提取成表格字段：标题、时间、负责人、动作项。",
  },
];

export default function FirstTaskPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">首次任务模板</h1>
        <p className="text-muted-foreground mb-8">
          安装完成后先跑一个最简单的任务，确认你已经真正可用。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {templates.map((tpl) => (
            <Card key={tpl.title} className="border-border/50">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold mb-2">{tpl.title}</h2>
                <p className="text-sm text-muted-foreground">{tpl.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/install/aftercare">我已完成首次任务</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/install">返回安装总览</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqItems = [
  {
    q: "什么是 WSL2？我是不是要重装系统？",
    a: "不用重装。WSL2 可以理解为“让 Windows 拥有一个 Linux 命令行环境”。",
  },
  {
    q: "什么是 Ubuntu？",
    a: "Ubuntu 是 Linux 系统。我们把它装在 WSL2 里，作为 OpenClaw 推荐运行环境。",
  },
  {
    q: "为什么不做原生 Windows 全自动一键？",
    a: "因为每台 Windows 环境差异太大，强行全自动失败率高。WSL2+Ubuntu 路径更稳定，更容易跑通。",
  },
  {
    q: "49.9 元包含什么？",
    a: "包含完整安装路径、分步引导、常见错误解释、API Key 配置说明、首次任务模板和后续启动说明。",
  },
  {
    q: "49.9 元不包含什么？",
    a: "不包含代买 API Key、不承诺自动修复你电脑所有问题、不做无限售后。",
  },
  {
    q: "我不会代码，可以用吗？",
    a: "可以。你只需要按步骤操作，页面会告诉你“做什么、为什么做、成功是什么样”。",
  },
  {
    q: "安装失败怎么办？",
    a: "先看当前步骤页的“常见问题”；若仍失败，再走支持入口提交具体报错。",
  },
  {
    q: "安装后怎么再次启动？",
    a: "在安装第 9 步会给你标准启动方式和常见问题对照表，按那一页操作即可。",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">常见问题</h1>
        <p className="text-muted-foreground mb-8">先把这些问题看一遍，安装成功率会明显提高。</p>

        <div className="space-y-4 mb-8">
          {faqItems.map((item) => (
            <Card key={item.q} className="border-border/50">
              <CardContent className="p-5">
                <h2 className="font-semibold mb-2">{item.q}</h2>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/pricing">去开通 49.9 安装引导</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/install">去安装总览</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, HelpCircle, ExternalLink } from "lucide-react";

/**
 * FAQ 问题类型
 */
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

/**
 * FAQ 数据
 */
const faqData: FAQItem[] = [
  {
    id: "1",
    category: "基础概念",
    question: "什么是 OpenClaw？",
    answer:
      "OpenClaw 是一个 AI 自动化工具，它可以帮助你自动完成各种任务，比如整理文件、总结内容、生成代码等。你可以把它想象成一个能听懂你指令的智能助手，只要告诉它你想做什么，它就会帮你完成。",
  },
  {
    id: "2",
    category: "基础概念",
    question: "什么是 skills？",
    answer:
      "Skills（技能）是 OpenClaw 的功能扩展包。就像手机上的 App 一样，每个 skill 都能让 OpenClaw 完成特定类型的任务。比如有的 skill 专门处理文档，有的专门写代码，有的专门做数据分析。",
  },
  {
    id: "3",
    category: "安装相关",
    question: "本地安装和云端部署有什么区别？",
    answer:
      "本地安装：安装在你自己的电脑上，数据完全留在本地，不需要额外费用，但需要你的电脑一直开着才能使用。\n\n云端部署：安装在云服务器上，24小时在线运行，随时可以访问，但需要支付服务器费用（通常每月几十元）。",
  },
  {
    id: "4",
    category: "API Key",
    question: "为什么需要 API Key？",
    answer:
      "API Key 就像是你调用 AI 服务的「门票」。OpenClaw 本身是免费的，但它需要调用 AI 模型来理解和执行你的指令，而这些 AI 模型是由其他公司提供的（比如智谱、OpenAI 等），所以你需要申请一个 API Key 来使用这些 AI 服务。",
  },
  {
    id: "5",
    category: "API Key",
    question: "API Key 会不会泄露？",
    answer:
      "只要按照正确的步骤操作，你的 API Key 是安全的：\n\n1. API Key 只保存在你自己的电脑上\n2. 不要把 Key 发给任何人\n3. 不要把 Key 上传到公开的代码仓库\n\n我们不会收集或存储你的 Key，你的一切数据都在你自己的控制之下。",
  },
  {
    id: "6",
    category: "使用问题",
    question: "我是小白，真的能用吗？",
    answer:
      "完全可以！OpenClaw 的设计初衷就是让不懂编程的人也能用上 AI 自动化。只要你会用电脑、能看懂中文，跟着我们的教程一步步操作，5-10 分钟就能完成安装并开始使用。遇到问题还有 FAQ 和社区支持。",
  },
  {
    id: "7",
    category: "使用问题",
    question: "安装失败怎么办？",
    answer:
      "别担心，90% 的安装问题都是小问题：\n\n1. 先看看报错信息是什么\n2. 在 FAQ 里搜索相关解决方案\n3. 如果 FAQ 里没有，可以加入社区求助\n4. 常见问题包括：网络问题、权限问题、版本不兼容等\n\n大部分问题都能在 10 分钟内解决。",
  },
  {
    id: "8",
    category: "费用相关",
    question: "使用 OpenClaw 需要多少钱？",
    answer:
      "OpenClaw 本身是完全免费的！\n\n但你需要为 AI 模型的调用付费（通过 API Key）。费用取决于你选择的平台和使用量：\n\n• 智谱 GLM：新用户有免费额度，轻度使用基本够用\n• OpenRouter：按量付费，价格透明\n• SiliconFlow：有免费额度，国内访问快\n\n大部分个人用户每月费用在 10-50 元之间。",
  },
  {
    id: "9",
    category: "费用相关",
    question: "为什么我不建议一开始就买服务器？",
    answer:
      "很多新手一上来就想「搞个服务器长期运行」，但其实：\n\n1. 先在本地跑起来，确认自己真的需要长期在线\n2. 熟悉基本操作后再考虑云端部署\n3. 服务器需要额外学习和维护成本\n4. 个人使用场景下，本地运行往往就够用了\n\n建议先用起来，再根据实际需求决定是否需要服务器。",
  },
];

/**
 * 获取所有分类
 */
const categories = Array.from(new Set(faqData.map((item) => item.category)));

/**
 * FAQ 页面
 */
export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 过滤 FAQ
  const filteredFAQ = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            常见问题
          </h1>
          <p className="text-muted-foreground text-lg">
            找不到答案？可以加入社区求助
          </p>
        </div>

        {/* 搜索框 */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="搜索问题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            全部
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-4">
          {filteredFAQ.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  没有找到相关问题，换个关键词试试？
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredFAQ.map((item) => (
              <Card
                key={item.id}
                className="border-border/50 overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* 问题标题 */}
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === item.id ? null : item.id)
                    }
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    {expandedId === item.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>

                  {/* 答案内容 */}
                  {expandedId === item.id && (
                    <div className="px-6 pb-6 pt-0">
                      <div className="text-muted-foreground leading-relaxed whitespace-pre-line border-t border-border pt-4">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 底部 CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            没找到你想要的问题？
          </p>
          <Button variant="outline" className="gap-2">
            加入社区求助
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Laptop, Cloud } from "lucide-react";

type QuestionOption = {
  id: string;
  label: string;
  value: string;
};

type Question = {
  id: "system" | "level" | "priority";
  title: string;
  subtitle: string;
  options: QuestionOption[];
};

const questions: Question[] = [
  {
    id: "system",
    title: "你的系统是什么？",
    subtitle: "我们会给你对应系统的本地部署步骤",
    options: [
      { id: "macos", label: "macOS (苹果电脑)", value: "macos" },
      { id: "windows", label: "Windows", value: "windows" },
    ],
  },
  {
    id: "level",
    title: "你的技术水平？",
    subtitle: "我们会调整教程讲解粒度",
    options: [
      { id: "beginner", label: "完全小白", value: "beginner" },
      { id: "basic", label: "能接受少量操作", value: "basic" },
      { id: "developer", label: "有一定技术基础", value: "developer" },
    ],
  },
  {
    id: "priority",
    title: "你更在意什么？",
    subtitle: "我们会在本地部署页面给出对应提醒",
    options: [
      { id: "simple", label: "最简单", value: "simple" },
      { id: "stable", label: "更稳定", value: "stable" },
      { id: "local", label: "数据留在本机", value: "local" },
      { id: "online", label: "长期在线运行", value: "online" },
    ],
  },
];

const systemLabel: Record<string, string> = {
  macos: "macOS",
  windows: "Windows",
};

const levelLabel: Record<string, string> = {
  beginner: "完全小白",
  basic: "能接受少量操作",
  developer: "有一定技术基础",
};

const priorityLabel: Record<string, string> = {
  simple: "最简单",
  stable: "更稳定",
  local: "数据留在本机",
  online: "长期在线运行",
};

export default function GuidePage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  const localGuideLink = useMemo(() => {
    const params = new URLSearchParams({
      system: answers.system ?? "",
      level: answers.level ?? "",
      priority: answers.priority ?? "",
    });
    return `/guide/local?${params.toString()}`;
  }, [answers]);
  const isCloudPreference = answers.priority === "online";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">选择你的使用情况</h1>
          <p className="text-muted-foreground text-lg">回答 3 个问题后，为你推荐最合适的部署路径</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-12">
          {questions.map((q, index) => (
            <div key={q.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  answers[q.id] ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}
              >
                {answers[q.id] ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < questions.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${answers[q.id] ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {!showResult ? (
          <div className="space-y-8">
            {questions.map((question) => (
              <Card key={question.id} className="border-border/50">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
                  <p className="text-muted-foreground text-sm mb-6">{question.subtitle}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {question.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(question.id, option.value)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          answers[question.id] === option.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              answers[question.id] === option.value ? "border-primary" : "border-border"
                            }`}
                          >
                            {answers[question.id] === option.value && (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-center pt-4">
              <Button size="lg" className="gap-2 px-12 h-12" disabled={!allAnswered} onClick={() => setShowResult(true)}>
                查看推荐路径
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">已为你准备推荐路径</h2>
              <p className="text-muted-foreground">你的选择已带入下一个页面，不需要重新填写。</p>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {isCloudPreference ? (
                      <Cloud className="w-6 h-6 text-primary" />
                    ) : (
                      <Laptop className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {isCloudPreference ? "云端部署（敬请期待）" : "本地部署（推荐）"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isCloudPreference
                        ? "你选择了长期在线运行。云端部署能力正在完善中，当前可先使用本地部署。"
                        : "你当前阶段最适合先在本地跑通 OpenClaw，后续再考虑云端方案。"}
                    </p>

                    <p className="text-sm text-muted-foreground mb-4">
                      你的选择：
                      <span className="text-foreground">
                        {systemLabel[answers.system]} / {levelLabel[answers.level]} / {priorityLabel[answers.priority]}
                      </span>
                    </p>

                    {isCloudPreference ? (
                      <div className="flex flex-wrap gap-2">
                        <Button asChild className="gap-2">
                          <a href="/guide/cloud">
                            查看云端进展
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="gap-2">
                          <a href={localGuideLink}>
                            先走本地部署
                            <ArrowRight className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <Button asChild className="gap-2">
                        <a href={localGuideLink}>
                          打开本地部署教程
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center pt-2">
              <Button variant="ghost" onClick={() => setShowResult(false)}>
                修改选择
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

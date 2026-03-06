"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Mail, Users, Gift } from "lucide-react";

/**
 * 留资入口页面
 * 收集用户邮箱，建立等待列表
 */
export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证邮箱
    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // 模拟提交（后续对接 Supabase）
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            加入等待列表
          </h1>
          <p className="text-muted-foreground text-lg">
            第一时间获取更新通知和独家福利
          </p>
        </div>

        {/* 表单卡片 */}
        <Card className="border-border/50 mb-8">
          <CardContent className="p-6 sm:p-8">
            {!isSuccess ? (
              <form onSubmit={handleSubmit}>
                {/* 邮箱输入 */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    邮箱地址
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                    disabled={isSubmitting}
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                  )}
                </div>

                {/* 提交按钮 */}
                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "提交中..." : "加入等待列表"}
                </Button>
              </form>
            ) : (
              /* 成功状态 */
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">提交成功！</h3>
                <p className="text-muted-foreground mb-6">
                  我们会在第一时间通知你最新的进展
                </p>
                <Button variant="outline" onClick={() => setIsSuccess(false)}>
                  提交另一个邮箱
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 福利说明 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Mail className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-sm">更新通知</h4>
              <p className="text-xs text-muted-foreground">
                新功能第一时间推送
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-sm">独家福利</h4>
              <p className="text-xs text-muted-foreground">
                等待列表用户专属
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <h4 className="font-medium text-sm">优先体验</h4>
              <p className="text-xs text-muted-foreground">
                新功能抢先体验
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 社群入口 */}
        <Card className="border-border/50">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">也可以加入社群</h3>
            <p className="text-sm text-muted-foreground mb-4">
              和其他用户交流，获取帮助和分享经验
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <span>Discord</span>
              </Button>
              <Button variant="outline" className="gap-2">
                <span>微信社群</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

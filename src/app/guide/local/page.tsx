"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Terminal, Download, ArrowRight, ChevronDown, ChevronUp, HelpCircle, ClipboardCheck } from "lucide-react";
import { EnvironmentCheck } from "@/components/EnvironmentCheck";
import { StepDetailButton } from "@/components/StepDetail";

/**
 * 安装步骤数据
 */
const installSteps = [
  {
    step: 1,
    title: "安装 Node.js",
    description: "OpenClaw 需要 Node.js 来运行",
    command: "node --version",
    tip: "如果显示版本号，说明已安装。如果没有，请点击查看详细说明",
    detailType: "nodejs" as const,
    status: "pending" as const,
  },
  {
    step: 2,
    title: "克隆 OpenClaw 仓库",
    description: "下载 OpenClaw 的代码到本地",
    command: "git clone https://github.com/openclaw/openclaw.git",
    tip: "需要先安装 Git。如果没有 Git，可以去 git-scm.com 下载",
    detailType: "git-clone" as const,
    status: "pending" as const,
  },
  {
    step: 3,
    title: "安装依赖",
    description: "安装 OpenClaw 运行所需的依赖包",
    command: "cd openclaw && npm install",
    tip: "这一步会下载所有需要的依赖包，可能需要几分钟",
    detailType: "npm-install" as const,
    status: "pending" as const,
  },
  {
    step: 4,
    title: "配置 API Key",
    description: "设置你的 AI 模型 API Key",
    command: "在 openclaw/.env.local 中配置 OPENCLAW_API_KEY=你的Key",
    tip: "准备好你的 API Key（还没有？去申请一个）",
    detailType: "api-key" as const,
    status: "pending" as const,
  },
];

/**
 * 详细说明内容
 */
const stepDetails: Record<string, { title: string; content: ReactNode }> = {
  nodejs: {
    title: "Node.js 安装详细说明",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">什么是 Node.js？</h4>
          <p className="text-sm text-muted-foreground">
            Node.js 是一个 JavaScript 运行环境，让 JavaScript 可以在电脑上运行（而不是只在浏览器里）。
            OpenClaw 就是用 JavaScript 写的，所以需要 Node.js 来运行。
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">如何安装？</h4>
          <div className="space-y-2">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-sm">macOS 用户</p>
              <ol className="text-sm text-muted-foreground mt-2 list-decimal list-inside">
                <li>打开终端</li>
                <li>安装 Homebrew（如果没有）：<code className="text-xs bg-background px-2 py-1 rounded">/bin/bash -c &quot;$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)&quot;</code></li>
                <li>安装 Node.js：<code className="text-xs bg-background px-2 py-1 rounded">brew install node</code></li>
              </ol>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-sm">Windows 用户</p>
              <ol className="text-sm text-muted-foreground mt-2 list-decimal list-inside">
                <li>访问 nodejs.org</li>
                <li>下载 Windows 安装包</li>
                <li>运行安装程序并按默认选项完成安装</li>
                <li>重启电脑后，在终端输入 <code className="text-xs bg-background px-2 py-1 rounded">node --version</code> 验证</li>
              </ol>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">验证安装</h4>
          <p className="text-sm text-muted-foreground mb-2">打开终端，输入以下命令：</p>
          <div className="bg-background p-3 rounded-lg font-mono text-sm">
            node --version
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            如果显示版本号（如 v20.x.x），说明安装成功！
          </p>
        </div>
      </div>
    ),
  },
  "git-clone": {
    title: "Git 和克隆仓库详细说明",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">什么是 Git？</h4>
          <p className="text-sm text-muted-foreground">
            Git 是一个版本控制工具， 用于下载和管理代码。
            我们需要用 Git 来下载 OpenClaw 的代码。
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">如何安装 Git？</h4>
          <div className="space-y-2">
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-sm">macOS</p>
              <p className="text-sm text-muted-foreground mt-1">
                <code className="text-xs bg-background px-2 py-1 rounded">brew install git</code>
              </p>
            </div>
            <div className="p-3 bg-secondary/50 rounded-lg">
              <p className="font-medium text-sm">Windows</p>
              <p className="text-sm text-muted-foreground mt-1">
                去 <a href="https://git-scm.com" target="_blank" className="text-primary hover:underline">git-scm.com</a> 下载安装
              </p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">克隆仓库</h4>
          <p className="text-sm text-muted-foreground mb-2">
            打开终端，输入以下命令：
          </p>
          <div className="bg-background p-3 rounded-lg font-mono text-sm">
            git clone https://github.com/openclaw/openclaw.git
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            这会下载 OpenClaw 的代码到一个叫 <code className="text-xs bg-background px-2 py-1 rounded">openclaw</code> 的文件夹
          </p>
        </div>
      </div>
    ),
  },
  "npm-install": {
    title: "安装依赖详细说明",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">什么是依赖？</h4>
          <p className="text-sm text-muted-foreground">
            依赖是 OpenClaw 运行需要的第三方库和工具。
            就像你盖房子需要砖头、水泥一样，OpenClaw 也需要一些基础组件才能运行。
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">安装步骤</h4>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
            <li>打开终端</li>
            <li>进入项目文件夹：
              <div className="bg-background p-3 rounded-lg font-mono text-xs mt-2">
                cd openclaw
              </div>
            </li>
            <li>安装依赖：
              <div className="bg-background p-3 rounded-lg font-mono text-xs mt-2">
                npm install
              </div>
            </li>
            <li>等待安装完成（可能需要几分钟）</li>
          </ol>
        </div>

        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-sm">
            <strong>💡 执行过程中：</strong>
            你会看到很多包名和进度条，这是正常的。
            只要没有红色错误，就等待完成即可。
          </p>
        </div>
      </div>
    ),
  },
  "api-key": {
    title: "API Key 配置详细说明",
    content: (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">什么是 API Key？</h4>
          <p className="text-sm text-muted-foreground">
            API Key 就像是一把“钥匙”，让你可以使用 AI 大模型的能力。
            OpenClaw 需要调用 AI 模型，所以你需要一个 API Key。
          </p>
        </div>

        <div>
          <h4 className="font-medium mb-2">如何获取 API Key？</h4>
          <p className="text-sm text-muted-foreground mb-2">推荐以下平台：</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>智谱 GLM</strong> - 国内访问稳定，新用户有免费额度</li>
            <li><strong>OpenRouter</strong> - 多模型聚合，按量付费</li>
            <li><strong>SiliconFlow</strong> - 国内访问快
有免费额度</li>
          </ul>
          <Button variant="outline" size="sm" className="mt-2" asChild>
            <a href="/api-key">查看详细说明</a>
          </Button>
        </div>

        <div>
          <h4 className="font-medium mb-2">如何配置？</h4>
          <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-2">
            <li>获取 API Key 后，复制它</li>
            <li>进入 OpenClaw 项目目录，创建配置文件：
              <div className="bg-background p-3 rounded-lg font-mono text-xs mt-2">
                cp .env.example .env.local
              </div>
            </li>
            <li>在 <code className="text-xs bg-background px-2 py-1 rounded">.env.local</code> 里设置 <code className="text-xs bg-background px-2 py-1 rounded">OPENCLAW_API_KEY=你的实际Key</code></li>
          </ol>
        </div>

        <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-sm">
            <strong>⚠️ 安全提示：</strong>
            不要把 API Key 分享给任何人！
            它就像你的密码一样， 要妥善保管。
          </p>
        </div>
      </div>
    ),
  },
};

/**
 * 本地安装教程页面
 */
export default function LocalInstallPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [installMode, setInstallMode] = useState<"auto" | "manual">("auto");
  const [copied, setCopied] = useState<"mac" | "win" | null>(null);
  const [showAutoCommand, setShowAutoCommand] = useState(false);
  const params =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const selectedSystem = params?.get("system") ?? null;
  const selectedLevel = params?.get("level") ?? null;
  const selectedPriority = params?.get("priority") ?? null;
  const paidAuto = params?.get("paid_auto") === "1";
  const systemLabel = selectedSystem === "windows" ? "Windows" : selectedSystem === "macos" ? "macOS" : null;
  const levelLabel =
    selectedLevel === "beginner"
      ? "完全小白"
      : selectedLevel === "basic"
        ? "能接受少量操作"
        : selectedLevel === "developer"
          ? "有一定技术基础"
          : null;
  const priorityLabel =
    selectedPriority === "simple"
      ? "最简单"
      : selectedPriority === "stable"
        ? "更稳定"
        : selectedPriority === "local"
          ? "数据留在本机"
          : selectedPriority === "online"
            ? "长期在线运行"
            : null;
  const macCommand = "chmod +x installer/openclaw-installer.sh && ./installer/openclaw-installer.sh doctor";
  const winCommand = "powershell -ExecutionPolicy Bypass -File .\\installer\\openclaw-installer.ps1 doctor";
  const preferredPlatform: "mac" | "win" = selectedSystem === "windows" ? "win" : "mac";
  const preferredCommand = preferredPlatform === "win" ? winCommand : macCommand;

  const copyCommand = async (platform: "mac" | "win", content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(platform);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      setCopied(null);
    }
  };

  // 切换步骤完成状态
  const toggleComplete = (step: number) => {
    setCompletedSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  };

  // 计算进度
  const progress = Math.round((completedSteps.length / installSteps.length) * 100);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Download className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            本地安装教程
          </h1>
          <p className="text-muted-foreground text-lg">
            跟着步骤一步步操作，5-10 分钟完成安装
          </p>
        </div>

        {(systemLabel || levelLabel || priorityLabel) && (
          <Card className="border-border/50 mb-8">
            <CardContent className="p-4 text-sm text-muted-foreground">
              已带入你的选择：
              <span className="text-foreground">
                {systemLabel ?? "未选择系统"} / {levelLabel ?? "未选择水平"} / {priorityLabel ?? "未选择偏好"}
              </span>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 mb-8">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">请选择安装方式</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={installMode === "auto" ? "default" : "outline"}
                onClick={() => setInstallMode("auto")}
              >
                自动安装（推荐）
              </Button>
              <Button
                variant={installMode === "manual" ? "default" : "outline"}
                onClick={() => setInstallMode("manual")}
              >
                手动安装（免费）
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 自动安装入口 */}
        {installMode === "auto" && (
        <Card className="border-primary/30 bg-primary/5 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">自动安装（简单三步）</h2>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold mb-1">49.9 全自动安装</h2>
                <p className="text-sm text-muted-foreground">
                  几乎不用研究命令。按步骤做完就行，49.9 已包含安装失败协助。
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">¥49.9</span>
            </div>

            {!paidAuto ? (
              <div className="space-y-4">
                <div className="rounded-lg border border-primary/20 bg-background/60 p-4">
                  <p className="text-sm mb-2 font-medium">你只需要做 3 件事：</p>
                  <p className="text-sm text-muted-foreground">1. 下载对应系统的安装脚本</p>
                  <p className="text-sm text-muted-foreground">2. 复制一条命令到终端运行</p>
                  <p className="text-sm text-muted-foreground">3. 等待自动检测和安装完成</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild>
                    <Link href="/checkout/auto">立即开通自动安装（¥49.9）</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/pricing">查看价格说明</Link>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  说明：自动安装没成功会协助你处理，不需要再额外升级。
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <Button asChild variant="outline">
                    <a href="/downloads/openclaw-installer.sh" download>
                      下载 macOS 脚本
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href="/downloads/openclaw-installer.ps1" download>
                      下载 Windows 脚本
                    </a>
                  </Button>
                </div>

                <Button className="w-full sm:w-auto" onClick={() => setShowAutoCommand((v) => !v)}>
                  {showAutoCommand ? "收起自动安装命令" : "开始自动安装"}
                </Button>

                {showAutoCommand && (
                  <div className="mt-4 bg-secondary/40 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-2">
                      {preferredPlatform === "win" ? "Windows" : "macOS"} 运行命令：
                    </p>
                    <code className="text-xs break-all">{preferredCommand}</code>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCommand(preferredPlatform, preferredCommand)}
                      >
                        <ClipboardCheck className="w-4 h-4 mr-1" />
                        {copied === preferredPlatform ? "已复制" : "复制命令"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="outline">
                    <a
                      href="https://github.com/15564412316-blip/openclaw-beginner-site/tree/main/installer"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      查看脚本说明
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link href="/guide/local">隐藏详细步骤</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        )}

        {installMode === "manual" && (
        <>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">手动安装进度</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-xl font-semibold mb-3">第一步：先做环境检测</h2>
          <p className="text-sm text-muted-foreground mb-4">
            检测通过后再开始手动安装，会省很多时间。
          </p>
        </div>
        <div className="mb-8">
          <EnvironmentCheck />
        </div>

        <div className="mb-3">
          <h2 className="text-xl font-semibold mb-3">第二步：按步骤安装</h2>
          <p className="text-sm text-muted-foreground mb-2">
            不用急，一步一步来，完成一条再做下一条。
          </p>
        </div>
        <div className="space-y-4 mb-8">
          {installSteps.map((step) => {
            const isCompleted = completedSteps.includes(step.step);
            const isExpanded = expandedStep === step.step;
            const canComplete = step.step === 1 || completedSteps.includes(step.step - 1);

            return (
              <Card
                key={step.step}
                className={`border-border/50 transition-all ${
                  isCompleted ? "border-green-500/50 bg-green-500/5" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* 步骤编号 */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{step.step}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* 步骤标题 */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{step.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedStep(isExpanded ? null : step.step)}
                        >
                          {isExpanded ? "收起" : "展开详情"}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          )}
                        </Button>
                      </div>

                      {/* 描述 */}
                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      {/* 命令框 */}
                      <div className="bg-secondary/50 rounded-lg p-3 font-mono text-sm mb-3 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-muted-foreground shrink-0" />
                        <code className="text-xs break-all">{step.command}</code>
                      </div>

                      {/* 提示 */}
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{step.tip}</span>
                      </div>

                      {/* 展开的详细内容 */}
                      {isExpanded && stepDetails[step.detailType] && (
                        <div className="mt-4 p-4 bg-secondary/30 rounded-xl border border-border/50">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 text-primary" />
                            {stepDetails[step.detailType].title}
                          </h4>
                          {stepDetails[step.detailType].content}
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant={isCompleted ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggleComplete(step.step)}
                          disabled={!isCompleted && !canComplete}
                        >
                          {isCompleted ? "取消完成" : canComplete ? "标记为完成" : "请先完成上一步"}
                        </Button>

                        <StepDetailButton
                          title={step.title}
                          type={step.detailType}
                          content={stepDetails[step.detailType]?.content}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </>
        )}

        {/* 完成提示 */}
        {installMode === "manual" && progress === 100 && (
          <Card className="border-green-500/50 bg-green-500/5 mb-8">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">安装完成！</h3>
              <p className="text-muted-foreground mb-4">
                恭喜你完成了所有安装步骤！现在可以开始使用 OpenClaw 了。
              </p>
              <Button asChild className="gap-2">
                <a href="/tasks">
                  查看可以做什么任务
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* 安装后步骤 */}
        <Card className="border-border/50 mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">安装完成后，下一步做什么？</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button asChild>
                <Link href="/tasks">看看它能做什么（使用场景）</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/api-key">去配置模型密钥（API）</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              提示：如果你主要用国内模型，先点“去配置模型密钥（API）”会更顺畅。
            </p>
          </CardContent>
        </Card>

        {/* 常见问题 */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              安装过程中可能遇到的问题
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium mb-1">命令找不到？</p>
                <p className="text-muted-foreground">
                  可能是没有正确安装或者需要重启终端。尝试关闭终端重新打开，或者检查是否安装成功。
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">网络问题？</p>
                <p className="text-muted-foreground">
                  如果下载很慢，可能是网络问题。可以尝试使用 VPN 或者国内镜像源。
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">权限问题？</p>
                <p className="text-muted-foreground">
                  Mac/Linux 用户可能需要在命令前加 <code className="text-xs bg-background px-2 py-1 rounded">sudo</code>。
                </p>
              </div>
            </div>
            <Button variant="outline" className="mt-4" asChild>
              <a href="/faq">查看更多问题</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

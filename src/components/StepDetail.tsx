"use client";

import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Terminal, Apple, Monitor, HelpCircle, ExternalLink } from "lucide-react";

type StepDetailProps = {
  title: string;
  type: string;
  content?: ReactNode;
};

const terminalGuides = {
  macOS: {
    title: "macOS (苹果电脑)",
    steps: [
      "按 Command + 空格，打开聚焦搜索",
      "输入“终端”或“Terminal”",
      "按回车打开终端应用",
    ],
    tips: "也可以在“应用程序 > 实用工具”中找到“终端”",
  },
  windows: {
    title: "Windows",
    steps: [
      "按 Win + R 打开运行对话框",
      "输入 cmd 并按回车",
      "也可以搜索 PowerShell 或命令提示符",
    ],
    tips: "推荐使用 PowerShell，兼容性更好",
  },
};

const commandExplanations: Record<string, { meaning: string; example: string }> = {
  node: {
    meaning: "Node.js 命令行工具，用于运行 JavaScript。",
    example: "node app.js 表示运行 app.js 文件",
  },
  npm: {
    meaning: "Node 包管理器，用于安装和管理依赖。",
    example: "npm install lodash 表示安装 lodash",
  },
  git: {
    meaning: "版本管理工具，用于下载和管理代码。",
    example: "git clone https://... 表示拉取代码仓库",
  },
  cd: {
    meaning: "切换目录命令。",
    example: "cd openclaw 表示进入 openclaw 目录",
  },
};

export function StepDetailDialog({ open, onOpenChange, title, content }: StepDetailProps & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [activeTab, setActiveTab] = useState<"guide" | "command" | "tips">("guide");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab("guide")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "guide" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            操作步骤
          </button>
          <button
            onClick={() => setActiveTab("command")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "command" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            命令解释
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`flex-1 py-3 text-sm font-medium ${activeTab === "tips" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
          >
            注意事项
          </button>
        </div>

        <div className="p-6">
          {activeTab === "guide" && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  如何打开终端？
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(terminalGuides).map(([key, guide]) => {
                    const Icon = key === "macOS" ? Apple : Monitor;
                    return (
                      <div key={key} className="border border-border/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{guide.title}</span>
                        </div>
                        <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                          {guide.steps.map((step) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                        <p className="text-xs text-muted-foreground mt-2">提示：{guide.tips}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {content && (
                <div>
                  <h4 className="font-semibold mb-3">详细步骤</h4>
                  <div>{content}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === "command" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">以下是常用命令解释：</p>
              {Object.entries(commandExplanations).map(([cmd, info]) => (
                <div key={cmd} className="border border-border/50 rounded-xl p-4">
                  <code className="bg-secondary px-2 py-1 rounded text-sm font-mono">{cmd}</code>
                  <p className="text-sm font-medium mt-2">{info.meaning}</p>
                  <p className="text-xs text-muted-foreground">示例：{info.example}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tips" && (
            <div className="space-y-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">安装常见问题</p>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                      <li>网络慢：可以换网络或镜像源。</li>
                      <li>权限不足：Mac/Linux 可能需要 sudo。</li>
                      <li>版本不兼容：优先使用 LTS 版本 Node.js。</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">需要更多帮助？</p>
                    <p className="text-sm text-muted-foreground mt-2">可以前往 FAQ 页面，或加入社区求助。</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function StepDetailButton({ title, type, content }: StepDetailProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)} className="gap-1">
        <HelpCircle className="w-4 h-4" />
        查看详细说明
      </Button>

      <StepDetailDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        type={type}
        content={content}
      />
    </>
  );
}

// 向后兼容旧名称
export const DetailButton = StepDetailButton;

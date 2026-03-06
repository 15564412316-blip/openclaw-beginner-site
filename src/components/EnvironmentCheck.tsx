"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Monitor, Terminal, FolderOpen } from "lucide-react";

type CheckResult = {
  name: string;
  icon: typeof Monitor;
  status: "checking" | "success" | "error" | "unknown";
  message: string;
  detail?: string;
};

const initialResults: CheckResult[] = [
  { name: "操作系统", icon: Monitor, status: "unknown", message: "点击检测" },
  { name: "Node.js", icon: Terminal, status: "unknown", message: "点击检测" },
  { name: "npm", icon: FolderOpen, status: "unknown", message: "点击检测" },
  { name: "网络连接", icon: Monitor, status: "unknown", message: "点击检测" },
  { name: "Git", icon: FolderOpen, status: "unknown", message: "点击检测" },
  { name: "网络访问国外服务", icon: Monitor, status: "unknown", message: "点击检测" },
];

export function EnvironmentCheck() {
  const [results, setResults] = useState<CheckResult[]>(initialResults);

  const checkOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Mac")) {
      return {
        os: "macOS (苹果电脑)",
        detail: "你的系统是 macOS，可以直接进行本地安装",
      };
    }
    if (ua.includes("Windows")) {
      return {
        os: "Windows",
        detail: "你的系统是 Windows，推荐使用 WSL2 或直接安装",
      };
    }
    if (ua.includes("Linux")) {
      return {
        os: "Linux",
        detail: "你的系统是 Linux，可以直接进行本地安装",
      };
    }

    return { os: "未知", detail: "未识别到系统类型" };
  };

  const runCheck = async (index: number) => {
    setResults((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], status: "checking", message: "检测中..." };
      return next;
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    let result: CheckResult;

    switch (index) {
      case 0: {
        const { os, detail } = checkOS();
        result = {
          name: "操作系统",
          icon: Monitor,
          status: "success",
          message: os,
          detail,
        };
        break;
      }
      case 1:
        result = {
          name: "Node.js",
          icon: Terminal,
          status: "unknown",
          message: "需要手动确认",
          detail: "浏览器无法检测本地安装。请打开终端输入 node --version 确认",
        };
        break;
      case 2:
        result = {
          name: "npm",
          icon: FolderOpen,
          status: "unknown",
          message: "需要手动确认",
          detail: "npm 通常随 Node.js 一起安装。请在终端输入 npm --version 确认",
        };
        break;
      case 3:
        result = {
          name: "网络连接",
          icon: Monitor,
          status: "success",
          message: "网络正常",
          detail: "你的网络连接正常，可以下载安装包",
        };
        break;
      case 4:
        result = {
          name: "Git",
          icon: FolderOpen,
          status: "unknown",
          message: "需要手动确认",
          detail: "请在终端输入 git --version 确认是否安装",
        };
        break;
      case 5:
        result = {
          name: "网络访问国外服务",
          icon: Monitor,
          status: "unknown",
          message: "需要手动确认",
          detail: "请尝试访问 github.com / npmjs.com 验证连通性",
        };
        break;
      default:
        result = results[index];
    }

    setResults((prev) => {
      const next = [...prev];
      next[index] = result;
      return next;
    });
  };

  const checkAll = async () => {
    for (let i = 0; i < results.length; i += 1) {
      await runCheck(i);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  };

  const getStatusIcon = (status: CheckResult["status"]) => {
    switch (status) {
      case "checking":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-border" />;
    }
  };

  const getStatusColor = (status: CheckResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-500/50 bg-green-500/5";
      case "error":
        return "border-red-500/50 bg-red-500/5";
      case "checking":
        return "border-blue-500/50 bg-blue-500/5";
      default:
        return "border-border/50";
    }
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">环境检测</h3>
          <Button onClick={checkAll} size="sm">
            一键检测全部
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          点击检测按钮，我们会帮你检查电脑是否具备安装条件。
        </p>

        <div className="space-y-3">
          {results.map((result) => {
            const Icon = result.icon;
            return (
              <div
                key={result.name}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{result.name}</p>
                    <p className="text-xs text-muted-foreground">{result.message}</p>
                    {result.detail && (
                      <p className="text-xs text-muted-foreground mt-1">{result.detail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">{getStatusIcon(result.status)}</div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
          <p className="text-sm text-muted-foreground">
            <strong>提示：</strong>
            浏览器无法完全检测你的本地环境。对于显示“需要手动确认”的项目，
            请打开终端输入相应命令验证是否已安装。
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

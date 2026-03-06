import { NextResponse } from "next/server";

type Reply = {
  answer: string;
  category: string;
};

const RULES: Array<{ keywords: string[]; reply: Reply }> = [
  {
    keywords: ["node", "nodejs", "版本", "version"],
    reply: {
      category: "环境检测",
      answer:
        "先在终端输入 `node --version`。有版本号就代表成功。没有的话请先安装 Node.js LTS，然后重开终端再试。",
    },
  },
  {
    keywords: ["git", "克隆", "clone"],
    reply: {
      category: "安装步骤",
      answer:
        "如果 `git clone` 失败，先检查网络。你也可以先执行 `git --version` 确认 Git 是否安装成功。",
    },
  },
  {
    keywords: ["npm", "依赖", "install", "镜像"],
    reply: {
      category: "安装步骤",
      answer:
        "依赖安装失败时，先执行 `npm config set registry https://registry.npmmirror.com`，再回到项目目录执行 `npm install`。",
    },
  },
  {
    keywords: ["api", "密钥", "key", "模型"],
    reply: {
      category: "API 配置",
      answer:
        "建议先去“配置模型密钥（API）”页面选择平台。配置时只在本地保存，不要把 key 发给任何人或上传到公开仓库。",
    },
  },
  {
    keywords: ["49.9", "自动安装", "付费", "退款"],
    reply: {
      category: "收费说明",
      answer:
        "49.9 是自动安装服务，包含安装失败协助。99 是独立的一对一代办服务，适合不想自己操作的用户。",
    },
  },
  {
    keywords: ["云端", "长期在线", "服务器"],
    reply: {
      category: "云端部署",
      answer:
        "云端部署当前是“敬请期待”。如果你现在要尽快用起来，建议先完成本地部署，再等云端版本上线。",
    },
  },
];

function fallbackReply(): Reply {
  return {
    category: "通用",
    answer:
      "我先给你最短建议：1）先跑环境检测；2）优先走自动安装；3）卡住就把报错贴出来。我会继续帮你定位。你也可以先看 FAQ 页面。",
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message ?? "").trim().toLowerCase();

    if (!message) {
      return NextResponse.json(
        { answer: "请先输入你的问题，比如“npm install 失败怎么办？”", category: "通用" },
        { status: 200 }
      );
    }

    const matched =
      RULES.find((rule) => rule.keywords.some((k) => message.includes(k.toLowerCase())))?.reply ??
      fallbackReply();

    return NextResponse.json(matched, { status: 200 });
  } catch {
    return NextResponse.json(
      { answer: "助手暂时不可用，请稍后再试。", category: "系统" },
      { status: 500 }
    );
  }
}

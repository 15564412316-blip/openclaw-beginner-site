export type InstallStep = {
  slug: string;
  title: string;
  shortTitle: string;
  goal: string;
  why: string;
  actions: string[];
  terminalHint?: string;
  pathHint?: string;
  commands?: string[];
  successSignals: string[];
  failSignals: string[];
  nextSlug?: string;
};

export const INSTALL_STEPS: InstallStep[] = [
  {
    slug: "windows-ready",
    shortTitle: "准备 Windows",
    title: "Step 1：先确认你的 Windows 可以继续安装",
    goal: "确认系统版本和权限满足安装要求。",
    why: "这一步不通过，后面都会反复报错。",
    pathHint: "左下角开始菜单 -> 设置 -> 系统 -> 关于",
    actions: [
      "打开“设置 -> 系统 -> 关于”，查看系统版本。",
      "确认是 Windows 10 2004+ 或 Windows 11。",
      "确认当前账号有管理员权限。",
    ],
    successSignals: ["看到了系统版本，且版本满足要求。", "后续可以使用管理员权限执行命令。"],
    failSignals: ["版本过低。", "没有管理员权限。"],
    nextSlug: "wsl-ubuntu",
  },
  {
    slug: "wsl-ubuntu",
    shortTitle: "装 WSL2 + Ubuntu",
    title: "Step 2：安装 WSL2 和 Ubuntu（一次完成）",
    goal: "在 Windows 里准备一个稳定的 Linux 环境。",
    why: "OpenClaw 在这个环境里更稳定，成功率更高。",
    terminalHint: "左下角开始菜单，搜索“终端”或“PowerShell”，右键“以管理员身份运行”。",
    actions: [
      "打开管理员 PowerShell。",
      "复制下方命令并粘贴，按回车执行。",
      "如果提示重启，先重启电脑。",
      "重启后打开 Ubuntu，按提示设置用户名和密码。",
    ],
    commands: ["wsl --install"],
    successSignals: ["开始菜单里能看到 Ubuntu。", "Ubuntu 打开后出现命令行，并完成用户名/密码设置。"],
    failSignals: ["命令提示无法识别。", "重启后仍无法打开 Ubuntu。"],
    nextSlug: "ubuntu-init",
  },
  {
    slug: "ubuntu-init",
    shortTitle: "初始化 Ubuntu",
    title: "Step 3：初始化 Ubuntu（复制三条命令）",
    goal: "更新系统并安装基础工具。",
    why: "避免后续下载依赖时报错。",
    terminalHint: "打开 Ubuntu（黑色窗口）后执行以下命令。",
    actions: [
      "打开 Ubuntu 终端。",
      "按顺序复制每条命令并回车执行。",
      "如果有输入密码提示，输入你刚设置的 Ubuntu 密码。",
    ],
    commands: [
      "sudo apt update && sudo apt upgrade -y",
      "sudo apt install -y curl git build-essential",
      "node -v && npm -v && git --version",
    ],
    successSignals: ["最后一条命令能打印 node/npm/git 版本号。"],
    failSignals: ["出现 command not found。", "安装中断或超时。"],
    nextSlug: "install-openclaw",
  },
  {
    slug: "install-openclaw",
    shortTitle: "安装 OpenClaw",
    title: "Step 4：安装 OpenClaw（复制三条命令）",
    goal: "把 OpenClaw 安装到你的 Ubuntu 环境。",
    why: "这是核心安装步骤，完成后就能进入配置与使用。",
    terminalHint: "仍在 Ubuntu 终端里操作。",
    actions: [
      "按顺序复制每条命令并回车执行。",
      "等待 npm install 完成（首次可能较慢）。",
    ],
    commands: [
      "git clone https://github.com/openclaw/openclaw.git ~/openclaw",
      "cd ~/openclaw",
      "npm install",
    ],
    successSignals: ["npm install 执行完成且没有中断错误。", "目录中已出现 node_modules。"],
    failSignals: ["git clone 失败。", "npm install 报错并停止。"],
    nextSlug: "api-setup",
  },
  {
    slug: "api-setup",
    shortTitle: "配置 API Key",
    title: "Step 5：配置 Provider / API Key",
    goal: "让 OpenClaw 具备调用模型的能力。",
    why: "没有 Key，OpenClaw 无法真正跑任务。",
    actions: [
      "先去模型平台申请 API Key。",
      "按 API 配置页说明写入配置。",
      "完成后回到终端做一次简单测试。",
    ],
    successSignals: ["配置保存成功。", "测试调用返回正常结果。"],
    failSignals: ["认证失败/Key 无效。", "调用超时或没有返回。"],
    nextSlug: "first-task",
  },
  {
    slug: "first-task",
    shortTitle: "首次任务 + 启动",
    title: "Step 6：跑通首次任务并记录后续启动方式",
    goal: "确认你已经真正可用，而不是只安装了一半。",
    why: "能跑出结果，才算交付完成。",
    actions: [
      "从首次任务模板里挑一个最简单任务。",
      "执行并确认有结果输出。",
      "把后续启动命令保存起来，方便下次直接用。",
    ],
    successSignals: ["你已经跑通至少一个任务。", "你知道下次怎么启动。"],
    failSignals: ["任务没有任何输出。", "不知道下次怎么启动。"],
  },
];

export function getInstallStep(slug: string) {
  return INSTALL_STEPS.find((s) => s.slug === slug);
}

export type InstallStep = {
  slug: string;
  title: string;
  shortTitle: string;
  goal: string;
  why: string;
  actions: string[];
  pathHint?: string;
  commands?: string[];
  successSignals: string[];
  commonIssues: { title: string; fix: string }[];
  failScenarios?: { scene: string; action: string }[];
  nextSlug?: string;
};

export const INSTALL_STEPS: InstallStep[] = [
  {
    slug: "windows-check",
    shortTitle: "检查系统",
    title: "Step 1：检查你的 Windows 版本",
    goal: "确认你的电脑支持 WSL2。",
    why: "如果系统版本不满足，后面的安装一定会失败。",
    pathHint: "设置 -> 系统 -> 关于（查看 Windows 版本号）",
    actions: [
      "打开“设置 -> 系统 -> 关于”，查看 Windows 版本。",
      "确保系统是 Windows 10 2004+ 或 Windows 11。",
      "确认你有管理员权限（后续安装需要）。",
    ],
    successSignals: ["能看到你的系统版本信息。", "版本满足 Windows 10 2004+ 或 Windows 11。"],
    commonIssues: [
      { title: "版本太低", fix: "先更新 Windows，再继续下一步。" },
      { title: "没有管理员权限", fix: "使用管理员账号登录或联系电脑管理员。" },
    ],
    failScenarios: [
      { scene: "看不到版本信息", action: "重启电脑后再次进入“设置 -> 系统 -> 关于”确认。" },
      { scene: "不确定版本是否支持", action: "先截图版本号，对照步骤页最低要求。" },
    ],
    nextSlug: "wsl2",
  },
  {
    slug: "wsl2",
    shortTitle: "安装 WSL2",
    title: "Step 2：安装 WSL2",
    goal: "在 Windows 上开启 Linux 运行环境。",
    why: "WSL2 是后续 Ubuntu 和 OpenClaw 稳定运行的基础。",
    actions: [
      "以管理员身份打开 PowerShell。",
      "执行命令安装 WSL2。",
      "根据提示重启电脑（如果系统要求）。",
    ],
    commands: ["wsl --install"],
    successSignals: ["命令执行完成，没有报错。", "重启后可在开始菜单看到 WSL/Ubuntu 相关入口。"],
    commonIssues: [
      { title: "命令无法识别", fix: "确认 PowerShell 是管理员模式，并更新系统后重试。" },
      { title: "安装卡住", fix: "检查网络；关闭 VPN/代理后重试一次。" },
    ],
    failScenarios: [
      { scene: "命令执行后无变化", action: "确认是管理员 PowerShell，再执行一次命令。" },
      { scene: "要求重启但你没重启", action: "先重启 Windows，再继续后续步骤。" },
    ],
    nextSlug: "ubuntu",
  },
  {
    slug: "ubuntu",
    shortTitle: "安装 Ubuntu",
    title: "Step 3：安装 Ubuntu",
    goal: "准备一个稳定的 Linux 发行版环境。",
    why: "OpenClaw 在 Linux 命令行环境下更稳定、更容易排查问题。",
    pathHint: "Microsoft Store 搜索 Ubuntu",
    actions: [
      "打开 Microsoft Store，搜索 Ubuntu。",
      "安装 Ubuntu（建议最新版 LTS）。",
      "安装完成后启动 Ubuntu。",
    ],
    successSignals: ["Ubuntu 能正常打开到命令行界面。", "出现要求设置用户名/密码的界面。"],
    commonIssues: [
      { title: "Store 下载慢", fix: "换网络或稍后重试；保持网络稳定。" },
      { title: "启动闪退", fix: "先完成 WSL2 安装并重启 Windows 后再打开。" },
    ],
    failScenarios: [
      { scene: "Store 里搜不到 Ubuntu", action: "先更新 Microsoft Store 后重试搜索。" },
      { scene: "下载中断", action: "切网络后重试，避免同时大量下载。" },
    ],
    nextSlug: "ubuntu-init",
  },
  {
    slug: "ubuntu-init",
    shortTitle: "初始化 Ubuntu",
    title: "Step 4：初始化 Ubuntu",
    goal: "完成 Ubuntu 首次配置并更新基础组件。",
    why: "初始化不完整会导致后续依赖安装失败。",
    actions: ["设置 Ubuntu 用户名和密码。", "更新软件源和系统包。", "安装常用基础工具。"],
    commands: [
      "sudo apt update && sudo apt upgrade -y",
      "sudo apt install -y curl git build-essential",
    ],
    successSignals: ["命令执行完成且无红色报错。", "输入 git --version 能显示版本号。"],
    commonIssues: [
      { title: "sudo 权限报错", fix: "确认你输入的是刚创建的 Ubuntu 密码。" },
      { title: "下载超时", fix: "检查网络，必要时切换镜像源后重试。" },
    ],
    failScenarios: [
      { scene: "输入密码看不到字符", action: "这是正常现象，直接输入后按回车。" },
      { scene: "apt 命令报锁文件", action: "等待后台进程结束后再执行命令。" },
    ],
    nextSlug: "linux-verify",
  },
  {
    slug: "linux-verify",
    shortTitle: "验证环境",
    title: "Step 5：验证 Linux 环境",
    goal: "确认 Node、npm、git 在 Ubuntu 环境可用。",
    why: "先验证环境，能避免安装到一半才发现缺依赖。",
    actions: ["在 Ubuntu 里分别检查 node、npm、git 版本。", "若缺失，先安装对应依赖。"],
    commands: ["node -v", "npm -v", "git --version"],
    successSignals: ["三个命令都能返回版本号。"],
    commonIssues: [
      { title: "node 不存在", fix: "先安装 Node.js LTS 后再继续。" },
      { title: "npm 报错", fix: "重新安装 Node，或修复 npm 缓存后重试。" },
    ],
    failScenarios: [
      { scene: "版本命令返回 command not found", action: "先补装依赖，再执行一次验证命令。" },
      { scene: "版本过低", action: "升级到 LTS 版本后继续。" },
    ],
    nextSlug: "openclaw",
  },
  {
    slug: "openclaw",
    shortTitle: "安装 OpenClaw",
    title: "Step 6：安装 OpenClaw",
    goal: "拉取 OpenClaw 项目并安装依赖。",
    why: "这是核心安装步骤，完成后才能进入配置和使用。",
    actions: ["克隆 OpenClaw 仓库。", "进入项目目录。", "执行依赖安装命令。"],
    commands: [
      "git clone https://github.com/openclaw/openclaw.git ~/openclaw",
      "cd ~/openclaw",
      "npm install",
    ],
    successSignals: ["npm install 完成，无中断报错。", "目录下出现 node_modules。"],
    commonIssues: [
      { title: "git clone 失败", fix: "优先检查网络；必要时使用镜像地址重试。" },
      { title: "npm install 失败", fix: "清理缓存后重试：npm cache clean --force。" },
    ],
    failScenarios: [
      { scene: "依赖安装很慢", action: "先等待，不要中途关闭终端；超时再重试。" },
      { scene: "中途报权限问题", action: "确认当前目录权限，必要时新建目录重装。" },
    ],
    nextSlug: "provider",
  },
  {
    slug: "provider",
    shortTitle: "配置模型",
    title: "Step 7：配置 Provider / API Key",
    goal: "让 OpenClaw 具备调用模型的能力。",
    why: "没有 API Key，OpenClaw 无法真正执行 AI 任务。",
    actions: ["选择一个模型平台申请 API Key。", "按文档将 Key 写入配置文件。", "运行测试命令确认 Key 可用。"],
    successSignals: ["配置保存成功。", "测试调用返回有效结果。"],
    commonIssues: [
      { title: "Key 无效", fix: "检查是否复制完整，是否有空格或过期。" },
      { title: "余额不足", fix: "到服务商后台检查配额和账单。" },
    ],
    failScenarios: [
      { scene: "配置后依旧报认证失败", action: "删除旧配置重新写入，避免隐藏空格。" },
      { scene: "请求超时", action: "先确认服务商平台可用，再检查本地网络。" },
    ],
    nextSlug: "first-run",
  },
  {
    slug: "first-run",
    shortTitle: "首次任务",
    title: "Step 8：运行首次任务",
    goal: "确认 OpenClaw 安装完成且能实际产出结果。",
    why: "“能跑出第一个结果”才是真正完成交付。",
    actions: ["从任务模板里选一个最简单场景。", "执行后观察结果输出。", "保存结果，确认流程跑通。"],
    successSignals: ["任务执行完成。", "有可读结果输出。"],
    commonIssues: [
      { title: "任务无响应", fix: "先回到上一步检查 API Key 和网络。" },
      { title: "结果质量差", fix: "调整提示词，指定更明确的目标和格式。" },
    ],
    failScenarios: [
      { scene: "有响应但结果为空", action: "缩小任务范围，先做一个更简单的任务。" },
      { scene: "输出格式混乱", action: "在提示词里明确“按列表/表格输出”。" },
    ],
    nextSlug: "aftercare",
  },
  {
    slug: "aftercare",
    shortTitle: "后续启动",
    title: "Step 9：后续启动方式与常见问题",
    goal: "让你下次能快速重新启动，不走回头路。",
    why: "安装一次只是开始，稳定复用才是长期价值。",
    actions: ["记录你的启动命令。", "保存常见报错处理方式。", "把常用任务模板收藏起来。"],
    successSignals: ["你能独立完成一次“重启 -> 运行任务”。"],
    commonIssues: [
      { title: "重启后找不到目录", fix: "在 Ubuntu 里使用 cd ~/openclaw 进入项目。" },
      { title: "命令忘了", fix: "到“后续启动说明”页复制标准命令。" },
    ],
    failScenarios: [
      { scene: "隔几天后不记得怎么启动", action: "把启动命令保存到桌面文本或便签。" },
      { scene: "再次运行报错", action: "先回到第 5 步重新做环境验证。" },
    ],
  },
];

export function getInstallStep(slug: string) {
  return INSTALL_STEPS.find((s) => s.slug === slug);
}

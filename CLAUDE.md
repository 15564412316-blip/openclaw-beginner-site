# OpenClaw 新手安全上手站 - 项目规则

## 项目简介
这是一个面向零基础用户的网站，帮助他们理解、安装、配置和首次使用 OpenClaw/skills。
网站风格要直观、互动性强、游戏化。

## 技术栈
- **Next.js 16** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS v4** - 样式
- **shadcn/ui** - UI 组件库
- **Supabase** - 后端服务（数据库、认证）
- **Cloudflare Pages** - 部署平台
- **Sentry** - 错误监控
- **Cloudflare Turnstile** - 人机验证

## 开发原则

### 1. 先做 MVP
- 不要过度设计
- 先实现核心功能，再优化

### 2. 代码结构清晰
- 组件放在 `src/components/`
- 页面放在 `src/app/`
- 工具函数放在 `src/lib/`
- 类型定义放在 `src/types/`

### 3. 响应式设计
- 所有页面必须支持手机、平板、电脑
- 使用 Tailwind 的响应式类名（sm:, md:, lg:, xl:）

### 4. 环境变量
- 所有环境变量不要写死到代码中
- 使用 `.env.local` 存储敏感信息
- 提供 `.env.example` 模板

### 5. 中文说明
- 所有注释和文档使用中文
- 代码变量名使用英文

## 目录结构

```
openclaw-guide/
├── src/
│   ├── app/                    # Next.js 页面
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   └── globals.css         # 全局样式
│   ├── components/
│   │   ├── ui/                 # shadcn/ui 组件
│   │   ├── layout/             # 布局组件（Header, Footer）
│   │   └── sections/           # 页面区块组件
│   ├── lib/
│   │   └── utils.ts            # 工具函数
│   ├── hooks/                  # 自定义 Hooks
│   ├── types/                  # TypeScript 类型定义
│   └── config/                 # 配置文件
├── public/                     # 静态资源
├── CLAUDE.md                   # 本文件
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 常用命令

```bash
# 进入项目目录
cd /Users/caoyuchuan/openclaw-guide

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行代码检查
npm run lint
```

## 开发注意事项

1. **每次修改代码后**，运行 `npm run lint` 检查代码问题
2. **创建新组件时**，放在对应的目录下
3. **添加新页面时**，在 `src/app/` 下创建文件夹
4. **使用环境变量时**，先在 `.env.example` 添加模板

## Git 提交规范

使用简单的中文描述：
- `feat: 添加用户登录功能`
- `fix: 修复首页样式问题`
- `docs: 更新项目文档`
- `refactor: 重构代码结构`

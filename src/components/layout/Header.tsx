import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 网站顶部导航栏组件
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">OpenClaw</span>
          <span className="text-sm text-muted-foreground">稳定安装引导</span>
        </Link>

        {/* 导航链接 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/install"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            安装向导
          </Link>
          <Link
            href="/first-task"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            首次任务
          </Link>
          <Link
            href="/api-key"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            API 配置
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            常见问题
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            49.9 开通
          </Link>
        </nav>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/me">我的页面</Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:flex">
            <Link href="/login">登录</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/pricing">立即开通</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

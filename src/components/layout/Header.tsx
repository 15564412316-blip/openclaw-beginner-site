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
          <span className="text-sm text-muted-foreground">新手指南</span>
        </Link>

        {/* 导航链接 */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/guide"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            使用指南
          </Link>
          <Link
            href="/faq"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            常见问题
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            关于我们
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            价格
          </Link>
        </nav>

        {/* 操作按钮 */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="outline" size="sm" className="hidden sm:flex">
            <Link href="/tasks">装完能做什么</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/guide/local">开始安装</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

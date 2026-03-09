import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 网站顶部导航栏组件
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">OpenClaw</span>
          <span className="text-sm text-muted-foreground">安装引导</span>
        </Link>

        <div className="flex items-center">
          <Button asChild size="sm">
            <Link href="/guide">立即安装</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

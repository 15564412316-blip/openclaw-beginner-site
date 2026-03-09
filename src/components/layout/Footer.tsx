import Link from "next/link";

/**
 * 网站底部页脚组件
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
          <div>
            <p className="font-semibold">OpenClaw 安装引导（49.9 元 / 次）</p>
            <p className="text-muted-foreground">先选系统，再给你对应的安装路径。</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/guide" className="text-muted-foreground hover:text-foreground transition-colors">
              立即安装
            </Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              价格说明
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
              常见问题
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
          © {new Date().getFullYear()} OpenClaw. 保留所有权利。
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

/**
 * 网站底部页脚组件
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="font-semibold">OpenClaw 稳定安装引导</p>
            <p className="text-sm text-muted-foreground">49.9 元 / 次，目标是让你真正装好并跑通。</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              开通服务
            </Link>
            <Link href="/install" className="text-muted-foreground hover:text-foreground transition-colors">
              Windows 向导
            </Link>
            <Link href="/guide/local?system=macos" className="text-muted-foreground hover:text-foreground transition-colors">
              Mac 原教程
            </Link>
            <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
              常见问题
            </Link>
            <Link href="/support" className="text-muted-foreground hover:text-foreground transition-colors">
              联系支持
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

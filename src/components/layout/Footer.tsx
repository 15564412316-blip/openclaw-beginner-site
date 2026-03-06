import Link from "next/link";

/**
 * 网站底部页脚组件
 */
export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 品牌信息 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold">OpenClaw 新手指南</h3>
            <p className="text-sm text-muted-foreground">
              帮助零基础用户快速上手 OpenClaw/skills 的互动式学习平台
            </p>
          </div>

          {/* 快速链接 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">快速开始</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  安装指南
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/config"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  配置说明
                </Link>
              </li>
              <li>
                <Link
                  href="/guide/first-use"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  首次使用
                </Link>
              </li>
            </ul>
          </div>

          {/* 帮助支持 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">帮助支持</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  常见问题
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  联系我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 相关链接 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">相关链接</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/openclaw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://openclaw.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  OpenClaw 官网
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenClaw. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}

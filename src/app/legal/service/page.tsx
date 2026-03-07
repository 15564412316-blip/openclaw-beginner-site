export default function ServiceBoundaryPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold">服务边界说明</h1>
        <p className="text-sm text-muted-foreground">更新时间：2026-03-07</p>
        <p className="text-sm">1. 自动安装（99.9）包含：脚本执行、基础检测、安装失败协助。</p>
        <p className="text-sm">2. 自动安装订单仅支持一次脚本下载领取。</p>
        <p className="text-sm">3. 一对一代办（199）是独立服务，不包含长期代运维。</p>
        <p className="text-sm">4. 免费用户可使用教程，不默认提供实时人工代操作。</p>
      </div>
    </div>
  );
}

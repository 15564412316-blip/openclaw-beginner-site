import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Shield, Zap, AlertTriangle, ExternalLink } from "lucide-react";

/**
 * API 平台数据
 */
const apiPlatforms = [
  {
    id: "zhipu",
    name: "智谱 GLM / BigModel",
    description: "国内大模型厂商，支持中文，价格实惠",
    features: ["国内访问稳定", "中文支持好", "新用户有免费额度"],
    pricing: "按量付费，新用户送 token",
    link: "https://open.bigmodel.cn/",
    recommended: true,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    description: "聚合多个模型，可切换不同 AI 模型",
    features: ["多模型聚合", "灵活切换", "按实际使用付费"],
    pricing: "按量付费，不同模型价格不同",
    link: "https://openrouter.ai/",
    recommended: false,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-500",
  },
  {
    id: "siliconflow",
    name: "SiliconFlow",
    description: "国内 AI 推理平台，价格透明",
    features: ["国内访问快", "价格透明", "多模型支持"],
    pricing: "按量付费，有免费额度",
    link: "https://cloud.siliconflow.cn/",
    recommended: false,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
  },
];

/**
 * API Key 接入中心页面
 */
export default function APIKeyPage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            API Key 接入中心
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            了解什么是 API Key，以及如何获取和配置你的第一个 AI 模型密钥
          </p>
        </div>

        {/* 什么是 API Key */}
        <Card className="border-border/50 mb-8">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              什么是 API Key？
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">简单来说</strong>，
                API Key 就像是一把「钥匙」，让你可以使用 AI 大模型的能力。
              </p>
              <p>
                你可以把它理解为：你向 AI 模型服务商（如智谱、OpenRouter）申请了一个账号，
                API Key 就是这个账号的「密码」，有了它，OpenClaw 就能帮你调用 AI 模型来完成任务。
              </p>
              <div className="bg-secondary/50 rounded-xl p-4 border border-border/50">
                <p className="text-sm">
                  💡 <strong className="text-foreground">打个比方</strong>：API Key 就像你家的门禁卡。
                  每次进出小区都需要刷卡验证身份。同样，每次调用 AI 模型也需要 API Key 来验证你的身份和权限。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 为什么需要自己的 Key */}
        <Card className="border-border/50 mb-8">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              为什么需要自己准备 API Key？
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                OpenClaw 是一个开源工具，它本身不提供 AI 模型服务。
                你需要使用自己的 API Key 来调用 AI 模型。
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/20">
                  <p className="font-medium text-green-600 mb-2">✅ 好处</p>
                  <ul className="text-sm space-y-1">
                    <li>• 数据和额度完全由你控制</li>
                    <li>• 不经过第三方，更安全</li>
                    <li>• 用多少付多少，透明可控</li>
                  </ul>
                </div>
                <div className="bg-yellow-500/5 rounded-xl p-4 border border-yellow-500/20">
                  <p className="font-medium text-yellow-600 mb-2">⚠️ 注意</p>
                  <ul className="text-sm space-y-1">
                    <li>• 我们不代充、不托管你的 Key</li>
                    <li>• 你需要自己保管好自己的 Key</li>
                    <li>• 费用由你选择的平台决定</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 推荐平台 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">推荐接入平台</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apiPlatforms.map((platform) => (
              <Card
                key={platform.id}
                className={`border-border/50 hover:border-primary/50 transition-all group ${
                  platform.recommended ? "ring-2 ring-primary/20" : ""
                }`}
              >
                <CardContent className="p-6">
                  {/* 推荐标签 */}
                  {platform.recommended && (
                    <div className="inline-block px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                      新手推荐
                    </div>
                  )}

                  {/* 平台图标和名称 */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${platform.iconBg} flex items-center justify-center`}
                    >
                      <Key className={`w-5 h-5 ${platform.iconColor}`} />
                    </div>
                    <h3 className="font-semibold">{platform.name}</h3>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-muted-foreground mb-4">
                    {platform.description}
                  </p>

                  {/* 特点 */}
                  <ul className="space-y-2 mb-4">
                    {platform.features.map((feature, index) => (
                      <li
                        key={index}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* 价格 */}
                  <div className="text-sm text-muted-foreground mb-4">
                    <strong className="text-foreground">费用：</strong>
                    {platform.pricing}
                  </div>

                  {/* 链接按钮 */}
                  <Button
                    asChild
                    variant={platform.recommended ? "default" : "outline"}
                    className="w-full gap-2"
                  >
                    <a
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      前往申请
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 安全提示 */}
        <Card className="border-yellow-500/20 bg-yellow-500/5 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">安全提示</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 不要把 API Key 分享给任何人</li>
                  <li>• 不要把 Key 提交到 GitHub 等公开平台</li>
                  <li>• 如果怀疑 Key 泄露，立即到平台重新生成</li>
                  <li>• 定期检查 API 使用量，发现异常及时处理</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 下一步引导 */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            拿到 API Key 后，下一步就是配置到 OpenClaw 中
          </p>
          <Button asChild size="lg" className="gap-2">
            <a href="/guide/local">
              继续安装教程
              <span className="text-lg">→</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

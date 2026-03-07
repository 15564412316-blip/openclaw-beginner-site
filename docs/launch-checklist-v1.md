# OpenClaw 上线待办（v1）

更新时间：2026-03-07

## 1. 域名与 DNS
1. 购买域名（建议 .com）
2. 在 Cloudflare 添加站点并接管 DNS
3. 新增 `CNAME`：
   - `www` -> Cloudflare Pages 分配域名
4. 新增重定向规则：
   - `openclaw.xxx` -> `www.openclaw.xxx`
5. 开启 HTTPS（Cloudflare Full/Strict）

## 2. 服务器与部署
1. 部署平台：Cloudflare Pages
2. 连接 GitHub 仓库：`openclaw-beginner-site`
3. Build 设置：
   - Build command: `npm run build`
   - Output directory: `.next`
4. 环境变量（Pages）：
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPPORT_WECHAT`（可选，付费后展示）
   - `SUPABASE_URL`（后端用）
   - `SUPABASE_SERVICE_ROLE_KEY`（后端用）
   - `ADMIN_REVIEW_TOKEN`（后台审核口令）
5. 验证首发版本：
   - 首页可访问
   - 引导流程可走完
   - 支付页可提交“人工确认订单”

## 3. 数据库（Supabase）
1. 创建 Supabase 项目（区域建议新加坡）
2. 在 SQL Editor 执行：
   - [docs/supabase-schema-v1.sql](/Users/caoyuchuan/openclaw-guide/docs/supabase-schema-v1.sql)
   - 若为旧项目，再执行 [docs/supabase-migration-payment-v1.sql](/Users/caoyuchuan/openclaw-guide/docs/supabase-migration-payment-v1.sql)
   - 若已启用手机号登录，再执行 [docs/supabase-migration-auth-v1.sql](/Users/caoyuchuan/openclaw-guide/docs/supabase-migration-auth-v1.sql)
3. 创建后台管理员账号（Supabase Auth，可后补）
4. 配置备份：
   - 每日自动备份（至少保留 7 天）
5. 验证数据链路：
   - 人工订单能写入 `orders`
   - 工单可写入 `support_tickets`
   - 登录用户能写入 `app_users`
   - 登录事件能写入 `auth_login_events`

## 4. 支付（当前 Demo）
1. 准备微信/支付宝商户收款码图片
2. 替换页面占位图（`ManualPayPanel`）
3. 建立人工审核 SOP：
   - 收到“我已付款”后 10 分钟内核验
   - 核验通过 -> 订单改为 `paid_confirmed`
   - 审核入口：`/admin/orders`（需口令）
4. 退款 SOP：
   - 自动安装不可用且无法修复 -> 可退款

## 5. 支付（正式版后续）
1. 选型聚合支付（如虎皮椒/PayJS/易支付等，按合规评估）
2. 接入自动回调与签名校验
3. 打通订单状态机：
   - `pending_payment` -> `paid_confirmed` -> `refunded/rejected`

## 6. 运营与风控
1. 免费模式仅提供教程，不开放人工直连
2. 49.9 包含失败协助，不做二次升级收费
3. 99 为独立代办服务，仅面向明确需求用户
4. 增加频控：
   - AI 问答日限（默认 10 次）
   - 表单防刷（reCAPTCHA/hCaptcha）

## 7. 监控与告警
1. 接入前端日志（Sentry 或同类）
2. 接入可用性监控（UptimeRobot）
3. 关键告警：
   - 支付提交接口 5xx
   - 下单成功率异常下降
   - 页面不可访问

## 8. 你需要亲自准备的事项
1. 域名购买与实名认证
2. 微信/支付宝商户资质（下周办理）
3. 收款码与品牌素材（logo、客服说明）
4. 最终退款规则与服务条款确认

# Windows EXE 打包说明

目标：把 `public/downloads/openclaw-installer-gui.ps1` 打成可双击的 `openclaw-installer-setup.exe`。

## 前置

- 一台 Windows 10/11 电脑
- PowerShell 5.1+
- 管理员权限（首次安装模块可能需要）

## 推荐方式（自动）

仓库已内置 GitHub Actions 自动打包：

- 工作流：`.github/workflows/build-windows-exe.yml`
- 触发：更新 `public/downloads/openclaw-installer-gui.ps1` 后 push 到 `main`
- 结果：自动生成 EXE 并发布到 tag `installer-latest`

建议在生产环境配置：

- `WIN_INSTALLER_EXE_URL=https://github.com/15564412316-blip/openclaw-beginner-site/releases/download/installer-latest/openclaw-installer-setup.exe`

这样终端用户支付后会直接下载 EXE，不需要任何命令操作。

另外已内置安装链路冒烟测试：

- 工作流：`.github/workflows/windows-installer-smoke.yml`
- 会在 Windows runner 执行 `doctor -> install -> verify -SkipConfigCheck`
- 只有报告为 `Overall: PASS` 才算通过

## 手动打包（备用）

1. 打开 PowerShell，进入项目根目录。
2. 执行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-win-exe.ps1
```

3. 生成文件：
   - `public/downloads/openclaw-installer-setup.exe`

## 发布步骤（手动备用）

1. 提交该 EXE 到仓库 `public/downloads/`。
2. 推送到 `main`。
3. 线上下载接口会自动优先下发 EXE；若 EXE 不存在，自动回退到 ZIP。

## 注意

- 由于未做代码签名，Windows SmartScreen 可能显示“未验证发布者”，部分机器会拦截或提示删除。
- 正式商用建议购买代码签名证书（OV/EV）并对 EXE 签名：
  - 先签名再发布，可显著减少“高风险/未知发布者”提示。
  - EV 证书在 SmartScreen 信任建立上通常更快。

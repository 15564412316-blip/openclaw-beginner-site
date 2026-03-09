# Windows Inno 安装器说明

目标：使用 Inno Setup 生成稳定的 Windows 安装向导 EXE（不再使用 ps2exe 打包路线）。

## 自动构建（推荐）

仓库已内置 GitHub Actions 自动打包：

- 工作流：`.github/workflows/build-windows-installer-inno.yml`
- 触发：更新 `installer/windows/**` 或安装脚本后 push 到 `main`
- 结果：生成并发布 `openclaw-installer-inno-v1.exe` 到 `installer-latest` release

建议在生产环境配置：

- `WIN_INSTALLER_EXE_URL=https://github.com/15564412316-blip/openclaw-beginner-site/releases/download/installer-latest/openclaw-installer-inno-v1.exe`

这样终端用户支付后会直接下载 Inno 安装向导 EXE。

## 安装链路验证

- 工作流：`.github/workflows/windows-installer-smoke.yml`
- 执行：`doctor -> install -> verify -SkipConfigCheck`
- 判定：报告必须为 `Overall: PASS`

## 本地手动打包（备用）

1. 在 Windows 上安装 Inno Setup 6。
2. 打开 `installer/windows/OpenClawInstaller.iss`。
3. 点击 Compile，输出文件在 `installer/windows/dist/openclaw-installer-inno-v1.exe`。

## 注意

- 未签名 EXE 仍可能触发 SmartScreen 风险提示。
- 商用建议购买代码签名证书（OV/EV）并对安装器签名后发布。

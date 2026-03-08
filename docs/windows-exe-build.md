# Windows EXE 打包说明

目标：把 `public/downloads/openclaw-installer-gui.ps1` 打成可双击的 `openclaw-installer-setup.exe`。

## 前置

- 一台 Windows 10/11 电脑
- PowerShell 5.1+
- 管理员权限（首次安装模块可能需要）

## 打包步骤

1. 打开 PowerShell，进入项目根目录。
2. 执行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts/build-win-exe.ps1
```

3. 生成文件：
   - `public/downloads/openclaw-installer-setup.exe`

## 发布步骤

1. 提交该 EXE 到仓库 `public/downloads/`。
2. 推送到 `main`。
3. 线上下载接口会自动优先下发 EXE；若 EXE 不存在，自动回退到 ZIP。

## 注意

- 由于未做代码签名，Windows SmartScreen 可能显示“未验证发布者”，用户需选择“仍要运行”。
- 正式商用建议增加代码签名证书，减少安全提示和拦截。

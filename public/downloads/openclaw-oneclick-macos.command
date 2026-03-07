#!/usr/bin/env bash
set -euo pipefail

echo "========================================"
echo "OpenClaw 一键安装器 (macOS)"
echo "========================================"

echo "[1/4] 下载安装脚本..."
TMP_SH="/tmp/openclaw-installer.sh"
curl -fsSL "https://raw.githubusercontent.com/15564412316-blip/openclaw-beginner-site/main/public/downloads/openclaw-installer.sh" -o "$TMP_SH"
chmod +x "$TMP_SH"

echo "[2/4] 环境检测..."
"$TMP_SH" doctor

echo "[3/4] 自动安装..."
"$TMP_SH" install --dir "$HOME/openclaw"

echo "[4/4] 安装验证..."
"$TMP_SH" verify --dir "$HOME/openclaw"

LATEST_REPORT="$(ls -t "$HOME/.openclaw-installer"/report-*.txt 2>/dev/null | head -n 1 || true)"
if [[ -n "$LATEST_REPORT" ]]; then
  cp "$LATEST_REPORT" "$HOME/Desktop/openclaw-install-report.txt"
  echo "已将安装报告保存到桌面：openclaw-install-report.txt"
fi

echo
read -r -p "安装完成。是否立即打开项目目录? (y/n): " OPEN_NOW
if [[ "$OPEN_NOW" == "y" || "$OPEN_NOW" == "Y" ]]; then
  open "$HOME/openclaw"
fi

echo "建议：请下载并阅读 openclaw-ops-guide.txt（后续运行与API配置）"
read -r -p "按回车键退出..." _

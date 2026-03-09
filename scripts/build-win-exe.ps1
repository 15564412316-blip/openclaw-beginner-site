param(
  [string]$Source = "public/downloads/openclaw-installer-gui.ps1",
  [string]$Output = "public/downloads/openclaw-installer-setup-v2.exe",
  [string]$ProductName = "OpenClaw Installer"
)

$ErrorActionPreference = "Stop"

function Ensure-Module([string]$name) {
  if (-not (Get-Module -ListAvailable -Name $name)) {
    Write-Host "Installing module: $name"
    Install-Module -Name $name -Scope CurrentUser -Force -AllowClobber
  }
}

if (-not (Test-Path $Source)) {
  throw "Source script not found: $Source"
}

Ensure-Module "ps2exe"
Import-Module ps2exe

$outDir = Split-Path -Parent $Output
if (-not (Test-Path $outDir)) {
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

Invoke-PS2EXE `
  -inputFile $Source `
  -outputFile $Output `
  -title $ProductName `
  -description "OpenClaw visual installer" `
  -company "OpenClaw" `
  -product $ProductName `
  -copyright "OpenClaw" `
  -version "0.1.0.0" `
  -noConsole `
  -DPIAware

Write-Host "Build complete: $Output"

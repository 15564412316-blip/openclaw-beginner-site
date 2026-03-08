param(
  [Parameter(Position = 0)]
  [ValidateSet("doctor", "install", "config", "verify", "report", "help")]
  [string]$Command = "help",

  [string]$Dir = "$HOME/openclaw",
  [string]$ApiKey = "",
  [string]$Provider = "gmn",
  [string]$BaseUrl = "https://gmncode.cn/v1",
  [string]$Model = "gpt-5.3-codex",
  [switch]$SkipConfigCheck
)

$AppName = "openclaw-installer"
$ConfigDir = Join-Path $HOME ".openclaw"
$ConfigFile = Join-Path $ConfigDir "openclaw.json"
$LogDir = Join-Path $HOME ".openclaw-installer"
$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ReportTxt = Join-Path $LogDir "report-$Timestamp.txt"
$ReportJson = Join-Path $LogDir "report-$Timestamp.json"
$Checks = @()
$RepoUrls = @(
  "https://github.com/openclaw/openclaw.git",
  "https://gitclone.com/github.com/openclaw/openclaw.git"
)
$RepoZipUrls = @(
  "https://codeload.github.com/openclaw/openclaw/zip/refs/heads/main",
  "https://ghfast.top/https://codeload.github.com/openclaw/openclaw/zip/refs/heads/main"
)

New-Item -ItemType Directory -Path $LogDir -Force | Out-Null

function Add-Check {
  param(
    [string]$Name,
    [string]$Status,
    [string]$Message,
    [string]$Fix = ""
  )

  $script:Checks += [PSCustomObject]@{
    name = $Name
    status = $Status
    message = $Message
    fix = $Fix
  }
}

function Write-Report {
  param([string]$Title)

  $overall = "PASS"
  if ($Checks | Where-Object { $_.status -eq "FAIL" }) {
    $overall = "FAIL"
  }

  $txt = @()
  $txt += "=== $Title ($Timestamp) ==="
  $txt += "Overall: $overall"
  $txt += ""
  foreach ($c in $Checks) {
    $txt += "- [$($c.status)] $($c.name): $($c.message)"
    if ($c.fix) {
      $txt += "  Fix: $($c.fix)"
    }
  }
  $txt -join [Environment]::NewLine | Out-File -FilePath $ReportTxt -Encoding UTF8

  $obj = [PSCustomObject]@{
    title = $Title
    timestamp = $Timestamp
    overall = $overall
    checks = $Checks
  }
  $obj | ConvertTo-Json -Depth 5 | Out-File -FilePath $ReportJson -Encoding UTF8

  Write-Host "Report TXT: $ReportTxt"
  Write-Host "Report JSON: $ReportJson"
  foreach ($c in $Checks) {
    Write-Host "[$($c.status)] $($c.name): $($c.message)"
  }
}

function Require-Command {
  param(
    [string]$Name,
    [string]$Fix
  )
  $cmd = Get-Command $Name -ErrorAction SilentlyContinue
  if ($null -ne $cmd) {
    Add-Check -Name $Name -Status "PASS" -Message $cmd.Source
    return $true
  }
  Add-Check -Name $Name -Status "FAIL" -Message "$Name not found" -Fix $Fix
  return $false
}

function Is-WindowsHost {
  return [Environment]::OSVersion.Platform -eq [PlatformID]::Win32NT
}

function Try-Install-WithWinget {
  param(
    [string]$PackageId,
    [string]$Name
  )
  $winget = Get-Command winget -ErrorAction SilentlyContinue
  if ($null -eq $winget) {
    Add-Check -Name "winget" -Status "FAIL" -Message "winget not found" -Fix "Install App Installer from Microsoft Store"
    return $false
  }

  try {
    & winget install --id $PackageId -e --accept-package-agreements --accept-source-agreements --silent
    if ($LASTEXITCODE -eq 0) {
      Add-Check -Name "auto_install_$Name" -Status "PASS" -Message "Installed via winget: $PackageId"
      return $true
    }
  } catch {
    # Fall through to failed result.
  }
  Add-Check -Name "auto_install_$Name" -Status "FAIL" -Message "Failed to install $Name via winget" -Fix "Install $Name manually and rerun"
  return $false
}

function Ensure-Directory([string]$path) {
  if (-not (Test-Path $path)) {
    New-Item -ItemType Directory -Path $path -Force | Out-Null
  }
}

function Try-Clone-Repo([string]$url, [string]$targetDir) {
  try {
    git clone $url $targetDir | Out-Null
    return $true
  } catch {
    return $false
  }
}

function Try-Download-And-Unzip([string[]]$urls, [string]$targetDir) {
  $tmpZip = Join-Path $env:TEMP "openclaw-main.zip"
  $tmpExtract = Join-Path $env:TEMP "openclaw-main-extract"
  foreach ($u in $urls) {
    try {
      if (Test-Path $tmpZip) { Remove-Item -Force $tmpZip -ErrorAction SilentlyContinue }
      if (Test-Path $tmpExtract) { Remove-Item -Recurse -Force $tmpExtract -ErrorAction SilentlyContinue }
      Invoke-WebRequest -UseBasicParsing -Uri $u -OutFile $tmpZip
      Expand-Archive -Path $tmpZip -DestinationPath $tmpExtract -Force
      $root = Get-ChildItem -Path $tmpExtract -Directory | Select-Object -First 1
      if ($null -eq $root) { continue }
      Ensure-Directory (Split-Path -Parent $targetDir)
      if (Test-Path $targetDir) { Remove-Item -Recurse -Force $targetDir -ErrorAction SilentlyContinue }
      Move-Item -Path $root.FullName -Destination $targetDir
      return $true
    } catch {
      # try next url
    }
  }
  return $false
}

function Run-Doctor {
  $script:Checks = @()
  Add-Check -Name "os" -Status "PASS" -Message "$([Environment]::OSVersion.VersionString)"

  [void](Require-Command -Name "node" -Fix "Install Node.js LTS first (https://nodejs.org)")
  [void](Require-Command -Name "npm" -Fix "npm should be installed with Node.js")
  [void](Require-Command -Name "git" -Fix "Install Git first (https://git-scm.com)")

  try {
    Invoke-WebRequest -Uri "https://github.com" -Method Head -TimeoutSec 8 | Out-Null
    Add-Check -Name "network_github" -Status "PASS" -Message "github.com reachable"
  } catch {
    Add-Check -Name "network_github" -Status "FAIL" -Message "github.com unreachable" -Fix "Check proxy/VPN or network settings"
  }

  try {
    Invoke-WebRequest -Uri "https://registry.npmjs.org" -Method Head -TimeoutSec 8 | Out-Null
    Add-Check -Name "network_npm" -Status "PASS" -Message "registry.npmjs.org reachable"
  } catch {
    Add-Check -Name "network_npm" -Status "FAIL" -Message "registry.npmjs.org unreachable" -Fix "Try: npm config set registry https://registry.npmmirror.com"
  }

  Write-Report -Title "doctor"
}

function Run-Install {
  $script:Checks = @()
  Add-Check -Name "target_dir" -Status "PASS" -Message $Dir

  $hasNode = $null -ne (Get-Command node -ErrorAction SilentlyContinue)
  $hasNpm = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)
  $hasGit = $null -ne (Get-Command git -ErrorAction SilentlyContinue)

  if (Is-WindowsHost) {
    if (-not ($hasNode -and $hasNpm)) {
      [void](Try-Install-WithWinget -PackageId "OpenJS.NodeJS.LTS" -Name "nodejs")
    }
    if (-not $hasGit) {
      [void](Try-Install-WithWinget -PackageId "Git.Git" -Name "git")
    }
  }

  $okNode = Require-Command -Name "node" -Fix "Install Node.js LTS first (https://nodejs.org)"
  $okNpm = Require-Command -Name "npm" -Fix "Install npm with Node.js"
  $okGit = Require-Command -Name "git" -Fix "Install Git first (https://git-scm.com)"
  if (-not ($okNode -and $okNpm -and $okGit)) {
    Write-Report -Title "install-precheck"
    exit 1
  }

  if (Test-Path (Join-Path $Dir ".git")) {
    try {
      git -C $Dir pull --ff-only | Out-Null
      Add-Check -Name "git_pull" -Status "PASS" -Message "Updated existing repository"
    } catch {
      Add-Check -Name "git_pull" -Status "FAIL" -Message "Failed to update repository, continue with existing code" -Fix "Check network and retry"
    }
  } else {
    $cloned = $false
    foreach ($repoUrl in $RepoUrls) {
      if (Try-Clone-Repo -url $repoUrl -targetDir $Dir) {
        Add-Check -Name "git_clone" -Status "PASS" -Message "Cloned from $repoUrl"
        $cloned = $true
        break
      }
    }
    if (-not $cloned) {
      $unzipped = Try-Download-And-Unzip -urls $RepoZipUrls -targetDir $Dir
      if ($unzipped) {
        Add-Check -Name "zip_fallback" -Status "PASS" -Message "Downloaded and extracted source zip"
        $cloned = $true
      }
    }
    if (-not $cloned) {
      Add-Check -Name "git_clone" -Status "FAIL" -Message "Failed to fetch repository from all sources" -Fix "Check network/proxy and retry"
      Write-Report -Title "install"
      exit 1
    }
  }

  if (-not (Test-Path (Join-Path $Dir "package.json"))) {
    Add-Check -Name "project_files" -Status "FAIL" -Message "package.json missing after fetch" -Fix "Retry install"
    Write-Report -Title "install"
    exit 1
  }

  try {
    Push-Location $Dir
    npm install | Out-Null
    Pop-Location
    Add-Check -Name "npm_install" -Status "PASS" -Message "Dependencies installed"
  } catch {
    if ($PWD.Path -eq $Dir) {
      Pop-Location
    }
    Add-Check -Name "npm_install" -Status "FAIL" -Message "npm install failed" -Fix "Try npm mirror and rerun"
  }

  Write-Report -Title "install"
}

function Run-Config {
  if (-not $ApiKey) {
    Write-Host "Missing required argument: -ApiKey"
    exit 1
  }

  $script:Checks = @()
  New-Item -ItemType Directory -Path $ConfigDir -Force | Out-Null

  if (Test-Path $ConfigFile) {
    $backup = "$ConfigFile.bak-$Timestamp"
    Copy-Item $ConfigFile $backup -Force
    Add-Check -Name "backup_config" -Status "PASS" -Message $backup
  } else {
    Add-Check -Name "backup_config" -Status "PASS" -Message "No existing config, skip backup"
  }

  $cfg = @{
    models = @{
      providers = @{
        "$Provider" = @{
          baseUrl = $BaseUrl
          apiKey = $ApiKey
          auth = "api-key"
          api = "openai-responses"
          authHeader = $true
          models = @(
            @{
              id = $Model
              name = $Model
            }
          )
        }
      }
    }
    agents = @{
      defaults = @{
        model = @{
          primary = "$Provider/$Model"
        }
      }
    }
  }

  $cfg | ConvertTo-Json -Depth 10 | Out-File -FilePath $ConfigFile -Encoding UTF8
  if (Test-Path $ConfigFile) {
    Add-Check -Name "write_config" -Status "PASS" -Message $ConfigFile
  } else {
    Add-Check -Name "write_config" -Status "FAIL" -Message "Failed to write config" -Fix "Check folder permission: $ConfigDir"
  }

  Write-Report -Title "config"
}

function Run-Verify {
  $script:Checks = @()

  if (Get-Command node -ErrorAction SilentlyContinue) {
    Add-Check -Name "node_version" -Status "PASS" -Message (node --version)
  } else {
    Add-Check -Name "node_version" -Status "FAIL" -Message "Node.js missing" -Fix "Install Node.js LTS first"
  }

  if (Get-Command npm -ErrorAction SilentlyContinue) {
    Add-Check -Name "npm_version" -Status "PASS" -Message (npm --version)
  } else {
    Add-Check -Name "npm_version" -Status "FAIL" -Message "npm missing" -Fix "Install npm with Node.js"
  }

  if (Test-Path $Dir) {
    Add-Check -Name "openclaw_dir" -Status "PASS" -Message $Dir
  } else {
    Add-Check -Name "openclaw_dir" -Status "FAIL" -Message "OpenClaw directory not found" -Fix "Run install command first"
  }

  if (Test-Path (Join-Path $Dir "node_modules")) {
    Add-Check -Name "dependencies" -Status "PASS" -Message "node_modules exists"
  } else {
    Add-Check -Name "dependencies" -Status "FAIL" -Message "Dependencies not found" -Fix "Run npm install in $Dir"
  }

  if ($SkipConfigCheck) {
    Add-Check -Name "config_file" -Status "PASS" -Message "Skipped in install phase"
  } else {
    if (Test-Path $ConfigFile) {
      Add-Check -Name "config_file" -Status "PASS" -Message $ConfigFile
    } else {
      Add-Check -Name "config_file" -Status "FAIL" -Message "Config file missing" -Fix "Run config command with -ApiKey"
    }
  }

  Write-Report -Title "verify"
}

function Show-Report {
  $latestTxt = Get-ChildItem -Path $LogDir -Filter "report-*.txt" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  $latestJson = Get-ChildItem -Path $LogDir -Filter "report-*.json" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1

  if (-not $latestTxt -and -not $latestJson) {
    Write-Host "No report found in $LogDir"
    exit 1
  }

  if ($latestTxt) { Write-Host "Latest TXT: $($latestTxt.FullName)" }
  if ($latestJson) { Write-Host "Latest JSON: $($latestJson.FullName)" }
}

function Show-Help {
  @"
Usage:
  .\openclaw-installer.ps1 doctor
  .\openclaw-installer.ps1 install [-Dir <path>]
  .\openclaw-installer.ps1 config -ApiKey <key> [-Provider <name>] [-BaseUrl <url>] [-Model <id>]
  .\openclaw-installer.ps1 verify [-Dir <path>] [-SkipConfigCheck]
  .\openclaw-installer.ps1 report
"@ | Write-Host
}

switch ($Command) {
  "doctor" { Run-Doctor }
  "install" { Run-Install }
  "config" { Run-Config }
  "verify" { Run-Verify }
  "report" { Show-Report }
  default { Show-Help }
}

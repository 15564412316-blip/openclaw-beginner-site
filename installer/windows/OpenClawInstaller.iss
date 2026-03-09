#define MyAppName "OpenClaw 安装器"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "OpenClaw"
#define MyAppExeName "run-openclaw-install.bat"

[Setup]
AppId={{C4E014D1-6E08-49D6-A385-C7E868D0958E}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\OpenClawInstaller
DisableProgramGroupPage=yes
PrivilegesRequired=admin
OutputDir=dist
OutputBaseFilename=openclaw-installer-inno-v1
Compression=lzma
SolidCompression=yes
WizardStyle=modern
SetupLogging=yes
UninstallDisplayIcon={app}\bin\{#MyAppExeName}

[Languages]
Name: "chinesesimp"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "创建桌面快捷方式"; GroupDescription: "附加任务"; Flags: unchecked

[Files]
Source: "..\..\public\downloads\openclaw-installer.ps1"; DestDir: "{app}\payload"; Flags: ignoreversion
Source: "..\..\public\downloads\openclaw-ops-guide.txt"; DestDir: "{app}\payload"; Flags: ignoreversion
Source: "run-openclaw-install.bat"; DestDir: "{app}\bin"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\OpenClaw 安装器"; Filename: "{app}\bin\{#MyAppExeName}"
Name: "{autodesktop}\OpenClaw 安装器"; Filename: "{app}\bin\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\bin\{#MyAppExeName}"; Description: "立即开始 OpenClaw 一键安装"; Flags: postinstall nowait skipifsilent
Filename: "{app}\payload\openclaw-ops-guide.txt"; Description: "打开后续使用指南"; Flags: postinstall shellexec skipifsilent unchecked

[Code]
function InitializeSetup(): Boolean;
begin
  Result := True;
end;

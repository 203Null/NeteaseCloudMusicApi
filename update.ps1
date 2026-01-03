$ErrorActionPreference = "Stop"

$packageName = "NeteaseCloudMusicApi"
$targetFolder = "NeteaseCloudMusicApi"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$targetPath = Join-Path $root $targetFolder
if (Test-Path $targetPath) {
  Write-Host "Removing existing '$targetPath'..."
  Remove-Item -Recurse -Force $targetPath
}

Write-Host "Downloading $packageName@latest from npm..."
$tarballName = (& npm pack "$packageName@latest").Trim()
$tarballPath = Join-Path $root $tarballName

Write-Host "Unpacking $tarballName into '$targetPath'..."
New-Item -ItemType Directory -Path $targetPath | Out-Null
tar -xzf $tarballPath -C $targetPath --strip-components=1

Write-Host "Cleaning up tarball..."
Remove-Item $tarballPath -Force

Write-Host "Done. Package unpacked to '$targetPath'."

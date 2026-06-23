# Pre-key tank scroll frames (WebP + alpha) from tank_filled_greennew.mp4
# Re-run after replacing the source video.

$Root = Split-Path -Parent $PSScriptRoot
$Video = Join-Path $Root "public\video\tank_filled_greennew.mp4"
$OutDir = Join-Path $Root "public\hero\tank-frames"

if (-not (Test-Path $Video)) {
  Write-Error "Missing source video: $Video"
  exit 1
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

ffmpeg -y -i $Video `
  -vf "colorkey=0x00FF00:0.14:0.08,colorkey=0x000000:0.05:0.05,format=rgba" `
  -c:v libwebp `
  -quality 85 `
  -compression_level 6 `
  (Join-Path $OutDir "frame_%04d.webp")

Write-Host "Exported WebP frames to $OutDir"

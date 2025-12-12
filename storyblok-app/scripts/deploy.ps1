# Deployment script for world4you (PowerShell)
# This script builds the Next.js app and uploads it via FTP

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment to world4you..." -ForegroundColor Green

# Load environment variables from .env.local
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
        }
    }
}

# Check required variables
if (-not $env:FTP_HOST -or -not $env:FTP_USER -or -not $env:FTP_PASS) {
    Write-Host "❌ Error: FTP credentials not set" -ForegroundColor Red
    Write-Host "Please set FTP_HOST, FTP_USER, and FTP_PASS environment variables"
    exit 1
}

# Build the application
Write-Host "📦 Building Next.js application..." -ForegroundColor Yellow
npm run build

if (-not (Test-Path "out")) {
    Write-Host "❌ Error: Build output directory 'out' not found" -ForegroundColor Red
    Write-Host "Make sure next.config.ts has 'output: export' configured"
    exit 1
}

# Upload via FTP using WinSCP or similar
Write-Host "📤 Uploading files to world4you..." -ForegroundColor Yellow

# Option 1: Using WinSCP command line (if installed)
if (Get-Command winscp -ErrorAction SilentlyContinue) {
    $script = @"
open ftp://$env:FTP_USER`:$env:FTP_PASS@$env:FTP_HOST
synchronize remote out /htdocs
exit
"@
    $script | winscp /script=-
} else {
    Write-Host "⚠️  WinSCP not found. Please install WinSCP or use an FTP client manually." -ForegroundColor Yellow
    Write-Host "Upload files from the 'out' directory to your webspace root"
}

Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green


# ==============================================================================
# NETRISK - Environment Setup Script (PowerShell)
# ==============================================================================
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " NETRISK - Python Environment & Dependency Setup            " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

# 1. Check Python installation
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Yellow
$PythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $PythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $PythonCmd = "py"
} else {
    Write-Error "Python 3 is not installed or not in PATH. Please install Python 3.11+."
}
$PyVersion = & $PythonCmd --version
Write-Host "Found: $PyVersion" -ForegroundColor Green

# 2. Virtual Environment Setup
Write-Host "`n[2/5] Checking virtual environment (.venv)..." -ForegroundColor Yellow
$VenvPython = Join-Path $RootDir ".venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    Write-Host "Creating virtual environment at .venv..." -ForegroundColor Cyan
    & $PythonCmd -m venv .venv
}
Write-Host "Virtual environment ready at .venv" -ForegroundColor Green

# 3. Install/Update Dependencies
Write-Host "`n[3/5] Installing dependencies from backend/requirements.txt..." -ForegroundColor Yellow
& $VenvPython -m pip install --upgrade pip --quiet
& $VenvPython -m pip install -r backend/requirements.txt --quiet
Write-Host "Dependencies successfully installed." -ForegroundColor Green

# 4. Verify Directory Structure & Environment Variables
Write-Host "`n[4/5] Verifying directory structure and configuration..." -ForegroundColor Yellow
$Directories = @("backend", "database", "docs", "diagrams", "scripts")
foreach ($dir in $Directories) {
    $path = Join-Path $RootDir $dir
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Host "Created missing directory: $dir" -ForegroundColor Gray
    }
}

$EnvFile = Join-Path $RootDir "backend\.env"
$EnvExample = Join-Path $RootDir "backend\.env.example"
if (-not (Test-Path $EnvFile)) {
    if (Test-Path $EnvExample) {
        Copy-Item $EnvExample $EnvFile
        Write-Host "Created backend/.env from template." -ForegroundColor Green
        Write-Host "NOTE: Update backend/.env with your Jira/Confluence API credentials if needed." -ForegroundColor Magenta
    }
} else {
    Write-Host "Configuration file backend/.env is present." -ForegroundColor Green
}

# 5. Database Initialization
Write-Host "`n[5/5] Checking SQLite Database..." -ForegroundColor Yellow
$DbFile = Join-Path $RootDir "database\netrisk.db"
if (-not (Test-Path $DbFile)) {
    Write-Host "Initializing new SQLite database at database/netrisk.db..." -ForegroundColor Cyan
    & $VenvPython -c "import sys; sys.path.insert(0, 'backend'); from app.database import init_db; init_db(); print('Database tables initialized successfully.')"
} else {
    Write-Host "Existing database found at: database/netrisk.db" -ForegroundColor Green
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " Setup complete! You can now run the platform using:        " -ForegroundColor Green
Write-Host "   .\scripts\run.ps1                                        " -ForegroundColor White
Write-Host " Or run tests using:                                        " -ForegroundColor Green
Write-Host "   .\scripts\test.ps1                                       " -ForegroundColor White
Write-Host "============================================================" -ForegroundColor Cyan

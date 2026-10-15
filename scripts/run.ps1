# ==============================================================================
# NETRISK - Application Launch Script (PowerShell)
# ==============================================================================
[CmdletBinding()]
param(
    [string]$HostAddress = "127.0.0.1",
    [int]$Port = 8000,
    [switch]$NoReload
)

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

$VenvPython = Join-Path $RootDir ".venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Warning "Virtual environment not detected at .venv."
    Write-Host "Running setup first..." -ForegroundColor Yellow
    & (Join-Path $PSScriptRoot "setup.ps1")
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " NETRISK - Intelligent Risk-Aware SDLC Decision Platform    " -ForegroundColor Cyan
Write-Host " Capstone Demonstration Server (Python / FastAPI / Jinja2)  " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$BaseUrl = "http://${HostAddress}:${Port}"

Write-Host "`nActive Service Endpoints:" -ForegroundColor Yellow
Write-Host "  Landing Page:        $BaseUrl/" -ForegroundColor White
Write-Host "  Executive Dashboard: $BaseUrl/dashboard" -ForegroundColor White
Write-Host "  Assessment Wizard:   $BaseUrl/assessment" -ForegroundColor White
Write-Host "  Assessment History:  $BaseUrl/history" -ForegroundColor White
Write-Host "  Project Management:  $BaseUrl/project-management" -ForegroundColor White
Write-Host "  Jira Kanban Board:   $BaseUrl/jira-board" -ForegroundColor White
Write-Host "  Technical Docs:      $BaseUrl/documentation" -ForegroundColor White
Write-Host "  System Settings:     $BaseUrl/settings" -ForegroundColor White
Write-Host "`nPress Ctrl+C to terminate the server.`n" -ForegroundColor Gray

$ArgsList = @("-m", "uvicorn", "app.main:app", "--host", $HostAddress, "--port", "$Port", "--app-dir", "backend")
if (-not $NoReload) {
    $ArgsList += "--reload"
}

& $VenvPython $ArgsList

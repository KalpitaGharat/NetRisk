# ==============================================================================
# NETRISK - Automated Test Suite Runner (PowerShell)
# ==============================================================================
[CmdletBinding()]
param(
    [switch]$VerboseOutput
)

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

$VenvPython = Join-Path $RootDir ".venv\Scripts\python.exe"

if (-not (Test-Path $VenvPython)) {
    Write-Error "Virtual environment not detected at .venv. Please run .\scripts\setup.ps1 first."
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " NETRISK - Automated Test Suite & Validation Harness        " -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$OverallSuccess = $true

# Part 1: Pytest Suite
Write-Host "`n[Suite 1/2] Running Pytest Unit & Integration Tests..." -ForegroundColor Yellow
$PytestArgs = @("-m", "pytest", "backend/tests", "-v")
if (-not $VerboseOutput) {
    $PytestArgs = @("-m", "pytest", "backend/tests", "-q")
}

& $VenvPython $PytestArgs
if ($LASTEXITCODE -ne 0) {
    Write-Host "X Pytest suite failed with exit code $LASTEXITCODE" -ForegroundColor Red
    $OverallSuccess = $false
} else {
    Write-Host "+ Pytest suite passed successfully." -ForegroundColor Green
}

# Part 2: SDLC Scenario Validation Harness
Write-Host "`n[Suite 2/2] Running Domain Scenario Tests (8 Capstone Scenarios)..." -ForegroundColor Yellow
& $VenvPython "backend/tests/run_scenarios.py"
if ($LASTEXITCODE -ne 0) {
    Write-Host "X Scenario validation suite failed with exit code $LASTEXITCODE" -ForegroundColor Red
    $OverallSuccess = $false
} else {
    Write-Host "+ All 8 domain scenarios validated successfully." -ForegroundColor Green
}

Write-Host "`n============================================================" -ForegroundColor Cyan
if ($OverallSuccess) {
    Write-Host " ALL TEST SUITES PASSED (100%)" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host " ONE OR MORE TEST SUITES FAILED" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Cyan
    exit 1
}

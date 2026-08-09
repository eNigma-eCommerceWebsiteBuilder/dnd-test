param(
    [string]$TemplateFrontendRoot = "D:\projects\eNigma-TemplateFrontend",
    [string]$DndTestRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [string]$OutputDirectory = "",
    [string]$ReportDirectory = "",
    [string]$PuckTargetRoot = $TemplateFrontendRoot,
    [switch]$SkipPuckConfigGeneration,
    [string[]]$RouteId = @()
)

$ErrorActionPreference = "Stop"
$parserEntry = Join-Path $DndTestRoot "scripts\templatefrontend-parser\ast-parser.ts"
if (-not (Test-Path -LiteralPath $parserEntry)) {
    throw "DnD-owned parser entry point is missing: $parserEntry"
}

$seedDir = if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    Join-Path $PuckTargetRoot "data\puck\seeds"
}
elseif ([System.IO.Path]::IsPathRooted($OutputDirectory)) {
    $OutputDirectory
}
else {
    Join-Path $DndTestRoot $OutputDirectory
}
if (-not (Test-Path $seedDir)) {
    New-Item -ItemType Directory -Path $seedDir -Force | Out-Null
}

$reportDir = if ([string]::IsNullOrWhiteSpace($ReportDirectory)) {
    if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
        Join-Path $PuckTargetRoot "data\puck\reports"
    }
    else {
        Join-Path $seedDir "_reports"
    }
}
elseif ([System.IO.Path]::IsPathRooted($ReportDirectory)) {
    $ReportDirectory
}
else {
    Join-Path $DndTestRoot $ReportDirectory
}
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

if (-not (Test-Path -LiteralPath $PuckTargetRoot)) {
    throw "Puck target root does not exist: $PuckTargetRoot"
}

if (-not $SkipPuckConfigGeneration) {
    Push-Location $PuckTargetRoot
    try {
        & npm run puck:generate
        if ($LASTEXITCODE -ne 0) {
            throw "Puck config generation failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location
    }
}

$manifestPath = Join-Path $PuckTargetRoot "puck\generated\site-manifest.json"
if (-not (Test-Path -LiteralPath $manifestPath)) {
    throw "Generated target site manifest is missing: $manifestPath"
}

try {
    $siteManifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
}
catch {
    throw "Generated target site manifest is invalid: $($_.Exception.Message)"
}

$pages = @($siteManifest.routes | ForEach-Object {
    if ([string]::IsNullOrWhiteSpace($_.id) -or [string]::IsNullOrWhiteSpace($_.sourceFile)) {
        throw "Every target manifest route must define id and sourceFile."
    }
    [PSCustomObject]@{
        Id = [string]$_.id
        SourceFile = [string]$_.sourceFile
    }
})
if ($pages.Count -eq 0) {
    throw "Generated target site manifest declares no routes."
}

if ($RouteId.Count -gt 0) {
    $availableRouteIds = $pages | ForEach-Object { $_.Id }
    $unknownRouteIds = $RouteId | Where-Object { $_ -notin $availableRouteIds }
    if ($unknownRouteIds.Count -gt 0) {
        throw "Unknown route id(s): $($unknownRouteIds -join ', ')"
    }
    $pages = @($pages | Where-Object { $_.Id -in $RouteId })
}

$success = 0
$fail = 0
$results = @()

foreach ($page in $pages) {
    $inputPath = Join-Path $TemplateFrontendRoot $page.SourceFile
    $outputPath = Join-Path $seedDir "$($page.Id).json"

    if (-not (Test-Path -LiteralPath $inputPath)) {
        $fail++
        $results += "FAIL: $($page.Id) - missing input $inputPath"
        continue
    }

    Push-Location $DndTestRoot
    try {
        $previousTemplateRoot = $env:TEMPLATE_FRONTEND_ROOT
        $previousPuckRoot = $env:PUCK_PROJECT_ROOT
        $previousReportPath = $env:PUCK_REPORT_PATH
        $env:TEMPLATE_FRONTEND_ROOT = $TemplateFrontendRoot
        $env:PUCK_PROJECT_ROOT = $PuckTargetRoot
        $env:PUCK_REPORT_PATH = Join-Path $reportDir "$($page.Id).report.json"
        $result = & npx tsx $parserEntry $inputPath $outputPath 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        $env:TEMPLATE_FRONTEND_ROOT = $previousTemplateRoot
        $env:PUCK_PROJECT_ROOT = $previousPuckRoot
        $env:PUCK_REPORT_PATH = $previousReportPath
        Pop-Location
    }

    $generatedLine = ($result | Where-Object { $_ -match "Generated" } | Select-Object -First 1)
    $reportPath = Join-Path $reportDir "$($page.Id).report.json"
    $reportIsClean = $false
    $reportError = $null
    if (Test-Path -LiteralPath $reportPath) {
        try {
            $report = Get-Content -Raw -LiteralPath $reportPath | ConvertFrom-Json
            $reportIsClean = (
                -not $report.fatal -and
                @($report.errors).Count -eq 0 -and
                @($report.warnings).Count -eq 0 -and
                @($report.droppedComponents).Count -eq 0 -and
                @($report.unmatchedHtml).Count -eq 0
            )
            if (-not $reportIsClean) {
                $reportError = "diagnostics are not clean"
            }
        }
        catch {
            $reportError = "diagnostics report is invalid: $($_.Exception.Message)"
        }
    }
    else {
        $reportError = "diagnostics report was not generated"
    }

    if ($exitCode -eq 0 -and $generatedLine -and $reportIsClean -and (Test-Path -LiteralPath $outputPath)) {
        $success++
        $results += "PASS: $($page.Id) - $generatedLine"
    }
    else {
        $fail++
        $errorLine = ($result | Where-Object { $_ -match "Error|error" } | Select-Object -First 1)
        if (-not $errorLine) {
            $errorLine = $reportError
        }
        if (-not $errorLine) {
            $errorLine = ($result | Select-Object -Last 1)
        }
        $results += "FAIL: $($page.Id) - $errorLine"
    }
}

Write-Output "=== AST PARSER TO DND-TEST RESULTS ==="
Write-Output "TemplateFrontend: $TemplateFrontendRoot"
Write-Output "Target seeds: $seedDir"
Write-Output "Target reports: $reportDir"
Write-Output "Success: $success / $($pages.Count)"
Write-Output "Fail: $fail / $($pages.Count)"
Write-Output ""
$results | ForEach-Object { Write-Output $_ }

if ($fail -gt 0) {
    exit 1
}

Push-Location $PuckTargetRoot
try {
    & npm run puck:generate
    if ($LASTEXITCODE -ne 0) {
        throw "Target Puck config generation after parsing failed with exit code $LASTEXITCODE"
    }
    & npm run puck:validate
    if ($LASTEXITCODE -ne 0) {
        throw "Target Puck validation after parsing failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

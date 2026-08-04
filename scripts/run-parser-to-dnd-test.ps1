param(
    [string]$TemplateFrontendRoot = "D:\projects\eNigma-TemplateFrontend",
    [string]$DndTestRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
    [switch]$SkipPuckConfigGeneration
)

$ErrorActionPreference = "Stop"

$seedDir = Join-Path $DndTestRoot "data\seeds"
if (-not (Test-Path $seedDir)) {
    New-Item -ItemType Directory -Path $seedDir -Force | Out-Null
}

if (-not $SkipPuckConfigGeneration) {
    Push-Location $DndTestRoot
    try {
        & npm run generate:puck-config
        if ($LASTEXITCODE -ne 0) {
            throw "Puck config generation failed with exit code $LASTEXITCODE"
        }
    }
    finally {
        Pop-Location
    }
}

$pages = @(
    @("app\page.tsx", "home"),
    @("app\collections\page.tsx", "collections"),
    @("app\collections\[slug]\page.tsx", "collection-detail"),
    @("app\categories\page.tsx", "categories"),
    @("app\categories\[slug]\page.tsx", "category-detail"),
    @("app\products\page.tsx", "products"),
    @("app\products\[slug]\page.tsx", "product-detail"),
    @("app\search\page.tsx", "search"),
    @("app\auth\page.tsx", "auth"),
    @("app\account\page.tsx", "account"),
    @("app\account\orders\page.tsx", "account-orders"),
    @("app\account\orders\[id]\page.tsx", "account-order-detail"),
    @("app\account\orders\[id]\downloads\page.tsx", "account-order-downloads"),
    @("app\account\orders\[id]\return\page.tsx", "account-order-return"),
    @("app\account\wishlist\page.tsx", "account-wishlist"),
    @("app\account\subscriptions\page.tsx", "account-subscriptions"),
    @("app\account\subscriptions\[id]\page.tsx", "account-subscription-detail"),
    @("app\account\addresses\page.tsx", "account-addresses"),
    @("app\account\payment-methods\page.tsx", "account-payment-methods"),
    @("app\account\settings\page.tsx", "account-settings"),
    @("app\account\sessions\page.tsx", "account-sessions"),
    @("app\account\downloads\page.tsx", "account-downloads"),
    @("app\account\returns\page.tsx", "account-returns"),
    @("app\account\returns\[id]\page.tsx", "account-return-detail"),
    @("app\cart\page.tsx", "cart"),
    @("app\checkout\page.tsx", "checkout"),
    @("app\checkout\success\page.tsx", "checkout-success"),
    @("app\checkout\subscription\page.tsx", "checkout-subscription"),
    @("app\downloads\[key]\page.tsx", "downloads"),
    @("app\wishlist\shared\[token]\page.tsx", "shared-wishlist")
)

$success = 0
$fail = 0
$results = @()

foreach ($page in $pages) {
    $inputPath = Join-Path $TemplateFrontendRoot $page[0]
    $outputPath = Join-Path $seedDir "$($page[1]).json"

    if (-not (Test-Path -LiteralPath $inputPath)) {
        $fail++
        $results += "FAIL: $($page[1]) - missing input $inputPath"
        continue
    }

    Push-Location $TemplateFrontendRoot
    try {
        $result = & npx tsx (Join-Path $TemplateFrontendRoot "ast-parser.ts") $inputPath $outputPath 2>&1
        $exitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    $generatedLine = ($result | Where-Object { $_ -match "Generated" } | Select-Object -First 1)
    $reportPath = Join-Path $seedDir "_reports\$($page[1]).report.json"
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
        $results += "PASS: $($page[1]) - $generatedLine"
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
        $results += "FAIL: $($page[1]) - $errorLine"
    }
}

Write-Output "=== AST PARSER TO DND-TEST RESULTS ==="
Write-Output "TemplateFrontend: $TemplateFrontendRoot"
Write-Output "DndTest seeds: $seedDir"
Write-Output "Success: $success / $($pages.Count)"
Write-Output "Fail: $fail / $($pages.Count)"
Write-Output ""
$results | ForEach-Object { Write-Output $_ }

if ($fail -gt 0) {
    exit 1
}

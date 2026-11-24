param (
    [Parameter(Mandatory=$true)]
    [string]$FilePath
)

$resolved = (Resolve-Path $FilePath).Path
Write-Host "Testing opening Excel file: $resolved"

$xl = New-Object -ComObject Excel.Application
$xl.Visible = $false
$xl.DisplayAlerts = $false

try {
    $wb = $xl.Workbooks.Open($resolved)
    Write-Host "EXCEL_OPEN_SUCCESS: Workbook opened cleanly!"
    Write-Host "Sheet count: $($wb.Sheets.Count)"
    foreach ($sh in $wb.Sheets) {
        Write-Host " - Sheet: $($sh.Name) (Visible: $($sh.Visible))"
    }
    $wb.Close($false)
    exit 0
} catch {
    Write-Host "EXCEL_OPEN_FAILED: $($_.Exception.Message)"
    exit 1
} finally {
    $xl.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($xl) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

Add-Type -AssemblyName System.IO.Compression.FileSystem

$files = @(
    @{ File = 'Tech Fault Diagnostics.docx'; Lesson = 2 },
    @{ File = 'Tech Troubleshooting.docx'; Lesson = 3 },
    @{ File = 'De-escalation Masterclass.docx'; Lesson = 4 },
    @{ File = 'Clear IT Instructions.docx'; Lesson = 5 },
    @{ File = 'Case Escalation Mastery.docx'; Lesson = 6 },
    @{ File = 'CRM Ticket Hygiene.docx'; Lesson = 7 },
    @{ File = 'Support Shift Handover.docx'; Lesson = 8 }
)

$destDir = "Lesson Plan\extracted"
if (!(Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

foreach ($f in $files) {
    $path = Join-Path "Lesson Plan" $f.File
    if (Test-Path $path) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
        $entry = $zip.GetEntry('word/document.xml')
        if ($entry) {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $xml = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            $text = $xml -replace '</w:p>', "`n`n"
            $text = $text -replace '<[^>]+>', ''
            $text = [System.Net.WebUtility]::HtmlDecode($text)
            
            $outPath = Join-Path $destDir ("lesson_" + $f.Lesson + ".txt")
            [System.IO.File]::WriteAllText($outPath, $text)
            Write-Host "Extracted Lesson $($f.Lesson): $($text.Length) characters to $outPath"
        }
        $zip.Dispose()
    } else {
        Write-Warning "File not found: $path"
    }
}

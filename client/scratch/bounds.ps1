Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\nalin\.gemini\antigravity\brain\44422e26-4291-41ac-8184-4a8e0d891ad1\.user_uploaded\media_1794247277726_2fe5da63.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

Write-Host "Total image size: $($bmp.Width) x $($bmp.Height)"

# Find bounding box where pixel brightness > 25
$minX = $bmp.Width; $maxX = 0; $minY = $bmp.Height; $maxY = 0

for ($y = 0; $y -lt $bmp.Height; $y += 2) {
    for ($x = 0; $x -lt $bmp.Width; $x += 2) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.R -gt 25 -or $c.G -gt 25 -or $c.B -gt 25) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Active UI Bounding Box: Left=$minX, Top=$minY, Right=$maxX, Bottom=$maxY"
Write-Host "Active UI Dimensions: Width=$($maxX - $minX) x Height=$($maxY - $minY)"

$bmp.Dispose()


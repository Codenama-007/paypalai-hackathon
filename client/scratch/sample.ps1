Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\nalin\.gemini\antigravity\brain\44422e26-4291-41ac-8184-4a8e0d891ad1\.user_uploaded\media_1794247277726_2fe5da63.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

function Get-HexColor($c) {
    return "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
}

# Scan area around logo (40..70, 15..35) to find peak gold color
$maxGold = $bmp.GetPixel(0, 0)
$maxGoldVal = 0
for ($x = 35; $x -lt 70; $x++) {
    for ($y = 15; $y -lt 35; $y++) {
        $c = $bmp.GetPixel($x, $y)
        # Gold has high R and G, lower B
        if ($c.R -gt 150 -and $c.G -gt 120 -and $c.B -lt 120) {
            $val = $c.R + $c.G - $c.B
            if ($val -gt $maxGoldVal) {
                $maxGoldVal = $val
                $maxGold = $c
            }
        }
    }
}
Write-Host "Peak Gold (Logo):" (Get-HexColor $maxGold) "R:$($maxGold.R) G:$($maxGold.G) B:$($maxGold.B)"

# Scan chart area (150..500, 180..280) for peak green and red candle colors
$maxGreen = $bmp.GetPixel(0, 0)
$maxGreenVal = 0
$maxRed = $bmp.GetPixel(0, 0)
$maxRedVal = 0

for ($x = 150; $x -lt 500; $x++) {
    for ($y = 180; $y -lt 280; $y++) {
        $c = $bmp.GetPixel($x, $y)
        if ($c.G -gt $c.R + 40 -and $c.G -gt $c.B + 20) {
            if ($c.G -gt $maxGreenVal) {
                $maxGreenVal = $c.G
                $maxGreen = $c
            }
        }
        if ($c.R -gt $c.G + 40 -and $c.R -gt $c.B + 40) {
            if ($c.R -gt $maxRedVal) {
                $maxRedVal = $c.R
                $maxRed = $c
            }
        }
    }
}
Write-Host "Peak Green (Candle):" (Get-HexColor $maxGreen) "R:$($maxGreen.R) G:$($maxGreen.G) B:$($maxGreen.B)"
Write-Host "Peak Red (Candle):" (Get-HexColor $maxRed) "R:$($maxRed.R) G:$($maxRed.G) B:$($maxRed.B)"

# Scan sidebar active item "Analyst" border/bg (35..120, 80..105)
$sidePillBg = $bmp.GetPixel(60, 92)
Write-Host "Sidebar Active Pill Bg (60, 92):" (Get-HexColor $sidePillBg)

# Scan border between sidebar and main workspace (130..155, 100)
$minBorder = $bmp.GetPixel(0, 0)
for ($x = 135; $x -lt 150; $x++) {
    $c = $bmp.GetPixel($x, 100)
    Write-Host "Sidebar border x=$x :" (Get-HexColor $c)
}

# Scan Price text at (600..700, 120..140)
Write-Host "Price area (620, 130):" (Get-HexColor ($bmp.GetPixel(620, 130)))

# Card background at center of Stock Overview card (400, 140)
Write-Host "Stock Card Bg (400, 140):" (Get-HexColor ($bmp.GetPixel(400, 140)))

# AI Co-Pilot background at (800, 150)
Write-Host "AI Co-Pilot Bg (800, 150):" (Get-HexColor ($bmp.GetPixel(800, 150)))

$bmp.Dispose()

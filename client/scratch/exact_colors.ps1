Add-Type -AssemblyName System.Drawing

$imgPath = "C:\Users\nalin\.gemini\antigravity\brain\44422e26-4291-41ac-8184-4a8e0d891ad1\.user_uploaded\media_1794247277726_2fe5da63.jpg"
$bmp = New-Object System.Drawing.Bitmap($imgPath)

function Get-HexColor($x, $y) {
    $c = $bmp.GetPixel($x, $y)
    return "#{0:X2}{1:X2}{2:X2}" -f $c.R, $c.G, $c.B
}

Write-Host "Top Nav Background (x=100, y=35):" (Get-HexColor 100 35)
Write-Host "Logo Gold (x=55, y=44):" (Get-HexColor 55 44)
Write-Host "NIFTY Pill Background (x=240, y=45):" (Get-HexColor 240 45)
Write-Host "NIFTY Green text (x=335, y=45):" (Get-HexColor 335 45)
Write-Host "Risk Profile Gold text (x=460, y=45):" (Get-HexColor 460 45)
Write-Host "Sidebar Background (x=60, y=140):" (Get-HexColor 60 140)
Write-Host "Sidebar Active Pill Bg (x=60, y=98):" (Get-HexColor 60 98)
Write-Host "Sidebar Active Border (x=30, y=98):" (Get-HexColor 30 98)
Write-Host "Sidebar War Room Red (x=115, y=125):" (Get-HexColor 115 125)
Write-Host "Workspace Background (x=300, y=70):" (Get-HexColor 300 70)
Write-Host "Stock Card Background (x=300, y=140):" (Get-HexColor 300 140)
Write-Host "Stock Card Border (x=300, y=120):" (Get-HexColor 300 120)
Write-Host "Stock Gold Circle (x=325, y=140):" (Get-HexColor 325 140)
Write-Host "Stock Live Pill Green (x=450, y=138):" (Get-HexColor 450 138)
Write-Host "Chart Card Background (x=300, y=260):" (Get-HexColor 300 260)
Write-Host "Chart Card Border (x=300, y=182):" (Get-HexColor 300 182)
Write-Host "Candle Green (x=218, y=230):" (Get-HexColor 218 230)
Write-Host "Candle Red (x=270, y=235):" (Get-HexColor 270 235)
Write-Host "Key Metrics Card Bg (x=630, y=260):" (Get-HexColor 630 260)
Write-Host "Key Metrics Active Tab (x=590, y=198):" (Get-HexColor 590 198)
Write-Host "Stream Card Bg (x=300, y=360):" (Get-HexColor 300 360)
Write-Host "Summary Card Bg (x=590, y=360):" (Get-HexColor 590 360)
Write-Host "Approval Gate Bg (x=300, y=475):" (Get-HexColor 300 475)
Write-Host "Approve Btn Bg (x=600, y=475):" (Get-HexColor 600 475)
Write-Host "Redirect Btn Bg (x=670, y=475):" (Get-HexColor 670 475)
Write-Host "Stop Btn Bg (x=735, y=475):" (Get-HexColor 735 475)
Write-Host "Disclaimer Bg (x=300, y=520):" (Get-HexColor 300 520)
Write-Host "Co-Pilot Bg (x=830, y=200):" (Get-HexColor 830 200)
Write-Host "Co-Pilot Ticker Box (x=830, y=145):" (Get-HexColor 830 145)
Write-Host "Co-Pilot Tools Box (x=830, y=230):" (Get-HexColor 830 230)
Write-Host "Co-Pilot Chat Bar (x=830, y=540):" (Get-HexColor 830 540)

$bmp.Dispose()


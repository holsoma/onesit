$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot = Split-Path -Parent $PSScriptRoot
$outputDirectory = Join-Path $projectRoot 'assets\brand\concepts'
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null
$fontFamily = [System.Drawing.FontFamily]::new('Arial')
$format = [System.Drawing.StringFormat]::GenericTypographic
$culture = [System.Globalization.CultureInfo]::InvariantCulture

function Format-Number([double]$value) { $value.ToString('0.###', $culture) }
function New-Lettering([string]$text, [single]$size, [int]$style = 1) {
    $outline = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $outline.AddString($text, $fontFamily, $style, $size, [System.Drawing.PointF]::new(0,0), $format)
    return ,$outline
}
function Convert-Outline($outline) {
    $points = $outline.PathPoints
    $types = $outline.PathTypes
    $commands = [System.Collections.Generic.List[string]]::new()
    for ($i = 0; $i -lt $points.Length; $i++) {
        $kind = $types[$i] -band 7
        $point = (Format-Number $points[$i].X) + ' ' + (Format-Number $points[$i].Y)
        if ($kind -eq 0) { $commands.Add('M' + $point) }
        elseif ($kind -eq 1) { $commands.Add('L' + $point) }
        elseif ($kind -eq 3) {
            $second = (Format-Number $points[$i+1].X) + ' ' + (Format-Number $points[$i+1].Y)
            $third = (Format-Number $points[$i+2].X) + ' ' + (Format-Number $points[$i+2].Y)
            $commands.Add('C' + $point + ' ' + $second + ' ' + $third)
            $i += 2
        }
        if (($types[$i] -band 128) -ne 0) { $commands.Add('Z') }
    }
    return $commands -join ' '
}
function Move-Outline($outline, [single]$x, [single]$y) {
    $matrix = [System.Drawing.Drawing2D.Matrix]::new()
    $matrix.Translate($x,$y)
    $outline.Transform($matrix)
    $matrix.Dispose()
}

$one = New-Lettering 'One' 100
$sit = New-Lettering 'SIT' 100
$oneBounds = $one.GetBounds()
$sitBounds = $sit.GetBounds()
$top = [Math]::Min($oneBounds.Y,$sitBounds.Y)
Move-Outline $one (-$oneBounds.X) (-$top)
Move-Outline $sit ($oneBounds.Width + 5 - $sitBounds.X) (-$top)
$logoWidth = $sit.GetBounds().Right
$logoHeight = [Math]::Max($one.GetBounds().Bottom,$sit.GetBounds().Bottom)
$oneSvg = Convert-Outline $one
$sitSvg = Convert-Outline $sit
$ink = '#202024'
$red = '#F0323C'
$options = @(
    @{ Slug='student-companion'; Label='Student companion'; Tag='STUDENT COMPANION' },
    @{ Slug='sitizen-companion'; Label='SITizen companion'; Tag='SITIZEN COMPANION' },
    @{ Slug='wordmark-only'; Label='No bottom text'; Tag='' }
)
$bitmap = [System.Drawing.Bitmap]::new(1500,1040)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$graphics.Clear([System.Drawing.ColorTranslator]::FromHtml('#F8F7F6'))
$inkBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($ink))
$redBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml($red))
$mutedBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#69676B'))
$panelBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#FFFFFF'))
$labelFont = [System.Drawing.Font]::new('Arial',19,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
$titleFont = [System.Drawing.Font]::new('Arial',32,[System.Drawing.FontStyle]::Bold,[System.Drawing.GraphicsUnit]::Pixel)
$smallFont = [System.Drawing.Font]::new('Arial',14,[System.Drawing.FontStyle]::Regular,[System.Drawing.GraphicsUnit]::Pixel)
$graphics.DrawString('OneSIT wordmark options',$titleFont,$inkBrush,60,42)
$graphics.DrawString('Same lettering. Three treatments for the bottom line.',$labelFont,$mutedBrush,60,92)
$optionIndex = 0
foreach ($option in $options) {
    $tagPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $totalHeight = $logoHeight
    $ruleY = $logoHeight + 11
    if ($option.Tag) {
        $letters = @()
        $inkWidth = 0
        foreach ($letter in $option.Tag.ToCharArray()) {
            if ($letter -eq ' ') { $letters += $null; $inkWidth += 6 }
            else { $glyph = New-Lettering ([string]$letter) 18 1; $letters += ,$glyph; $inkWidth += $glyph.GetBounds().Width }
        }
        $spacing = ($logoWidth - $inkWidth) / ($letters.Count - 1)
        $cursor = 0
        foreach ($glyph in $letters) {
            if ($null -eq $glyph) { $cursor += 6 + $spacing; continue }
            $bounds = $glyph.GetBounds()
            Move-Outline $glyph ($cursor-$bounds.X) ($ruleY+9-$bounds.Y)
            $tagPath.AddPath($glyph,$false)
            $cursor += $bounds.Width + $spacing
            $glyph.Dispose()
        }
        $totalHeight = $tagPath.GetBounds().Bottom
    }
    $viewWidth = Format-Number ($logoWidth+4)
    $viewHeight = Format-Number ($totalHeight+4)
    $extra = ''
    if ($option.Tag) {
        $extra = '<path fill="'+$ink+'" d="M0 '+(Format-Number $ruleY)+' H'+(Format-Number $logoWidth)+' V'+(Format-Number ($ruleY+1))+' H0Z"/><path fill="'+$ink+'" fill-rule="evenodd" d="'+(Convert-Outline $tagPath)+'"/>'
    }
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+$viewWidth+' '+$viewHeight+'" role="img" aria-label="OneSIT'+$(if ($option.Tag) { ', '+$option.Label })+'"><title>OneSIT'+$(if ($option.Tag) { ' '+$option.Label })+'</title><g transform="translate(2 2)"><path fill="'+$ink+'" fill-rule="evenodd" d="'+$oneSvg+'"/><path fill="'+$red+'" fill-rule="evenodd" d="'+$sitSvg+'"/>'+$extra+'</g></svg>'
    [System.IO.File]::WriteAllText((Join-Path $outputDirectory ('onesit-'+$option.Slug+'.svg')),$svg,[System.Text.UTF8Encoding]::new($false))
    $rowY = 158 + $optionIndex * 278
    $graphics.FillRectangle($panelBrush,40,$rowY,1420,254)
    $graphics.DrawString($option.Label,$labelFont,$inkBrush,66,($rowY+24))
    $saved = $graphics.Save()
    $graphics.TranslateTransform(68,($rowY+80))
    $graphics.ScaleTransform(1.45,1.45)
    $graphics.FillPath($inkBrush,$one)
    $graphics.FillPath($redBrush,$sit)
    if ($option.Tag) { $graphics.FillRectangle($inkBrush,0,$ruleY,$logoWidth,1); $graphics.FillPath($inkBrush,$tagPath) }
    $graphics.Restore($saved)
    $graphics.DrawString('PHONE HEADER',$smallFont,$mutedBrush,850,($rowY+28))
    $graphics.DrawRectangle([System.Drawing.Pens]::LightGray,850,($rowY+66),540,140)
    $saved = $graphics.Save()
    $graphics.TranslateTransform(876,($rowY+91))
    $scale = 184 / $logoWidth
    $graphics.ScaleTransform($scale,$scale)
    $graphics.FillPath($inkBrush,$one)
    $graphics.FillPath($redBrush,$sit)
    if ($option.Tag) { $graphics.FillRectangle($inkBrush,0,$ruleY,$logoWidth,1); $graphics.FillPath($inkBrush,$tagPath) }
    $graphics.Restore($saved)
    $graphics.DrawString('Not affiliated with SIT.',$smallFont,$mutedBrush,876,($rowY+171))
    $tagPath.Dispose()
    $optionIndex++
}
$bitmap.Save((Join-Path $outputDirectory 'onesit-wordmark-comparison.png'),[System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
$one.Dispose()
$sit.Dispose()
Write-Output 'Created three outlined SVG wordmarks and a comparison preview.'

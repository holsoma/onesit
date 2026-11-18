Add-Type -AssemblyName System.Drawing
$root=Split-Path -Parent $PSScriptRoot
$iconDir=Join-Path $root 'public\icons'
[IO.Directory]::CreateDirectory($iconDir) | Out-Null
$red=[Drawing.ColorTranslator]::FromHtml('#C72535')
foreach($item in @(@{size=192;name='icon-192'},@{size=512;name='icon-512'},@{size=512;name='icon-maskable'},@{size=180;name='apple-touch-icon'})){
  $bitmap=[Drawing.Bitmap]::new($item.size,$item.size)
  $g=[Drawing.Graphics]::FromImage($bitmap)
  $g.SmoothingMode=[Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.Clear($red)
  $g.ScaleTransform($item.size/64,$item.size/64)
  $points=[Drawing.PointF[]]@([Drawing.PointF]::new(27,15),[Drawing.PointF]::new(37,15),[Drawing.PointF]::new(37,49),[Drawing.PointF]::new(27,49),[Drawing.PointF]::new(27,27),[Drawing.PointF]::new(19,31),[Drawing.PointF]::new(19,22))
  $g.FillPolygon([Drawing.Brushes]::White,$points)
  $bitmap.Save((Join-Path $iconDir ($item.name+'.png')),[Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose();$bitmap.Dispose()
}
$bitmap=[Drawing.Bitmap]::new(1200,630)
$g=[Drawing.Graphics]::FromImage($bitmap)
$g.TextRenderingHint=[Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.Clear([Drawing.ColorTranslator]::FromHtml('#F7F7F8'))
$black=[Drawing.SolidBrush]::new([Drawing.ColorTranslator]::FromHtml('#242327'))
$redBrush=[Drawing.SolidBrush]::new($red)
$font=[Drawing.Font]::new('Arial',112,[Drawing.FontStyle]::Bold,[Drawing.GraphicsUnit]::Pixel)
$g.DrawString('One',$font,$black,78,120)
$g.DrawString('SIT',$font,$redBrush,288,120)
$body=[Drawing.Font]::new('Arial',36,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
$g.DrawString('Your campus. One place.',$body,$black,85,290)
$small=[Drawing.Font]::new('Arial',23,[Drawing.FontStyle]::Regular,[Drawing.GraphicsUnit]::Pixel)
$g.DrawString('Services, academic dates and student events.',$small,$black,85,350)
$g.DrawString('Not affiliated with SIT.',$small,$black,85,535)
$g.FillRectangle($redBrush,85,450,1030,4)
$bitmap.Save((Join-Path $root 'public\og.png'),[Drawing.Imaging.ImageFormat]::Png)
$g.Dispose();$bitmap.Dispose()
'Created install icons and social preview.'

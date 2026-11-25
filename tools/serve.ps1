# Kleiner lokaler Webserver zur Vorschau der Webseite (nur auf diesem Rechner erreichbar).
# Start:  powershell -ExecutionPolicy Bypass -File tools\serve.ps1
# Dann im Browser: http://localhost:8080   -  Beenden: Strg+C
# (Datei bewusst nur mit ASCII-Zeichen, damit Windows PowerShell 5.1 sie korrekt liest.)
param([int]$Port = 8080)

$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript; charset=utf-8'; '.json' = 'application/json'
  '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'; '.ico' = 'image/x-icon'; '.woff2' = 'font/woff2'; '.txt' = 'text/plain; charset=utf-8'
  '.md' = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Vorschau laeuft: http://localhost:$Port  (Ordner: $root)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }
      $path = [System.IO.Path]::GetFullPath((Join-Path $root $rel))
      if ((Test-Path $path -PathType Container)) { $path = Join-Path $path 'index.html' }

      if (-not $path.StartsWith($root, [StringComparison]::OrdinalIgnoreCase) -or -not (Test-Path $path -PathType Leaf)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes('404 - nicht gefunden')
        $res.ContentType = 'text/plain; charset=utf-8'
      } else {
        $ext = [System.IO.Path]::GetExtension($path).ToLower()
        $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $res.Headers.Add('Cache-Control', 'no-store')
        $bytes = [System.IO.File]::ReadAllBytes($path)
      }
      $res.ContentLength64 = $bytes.Length
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      Write-Host ("{0} {1} {2}" -f $res.StatusCode, $ctx.Request.HttpMethod, $ctx.Request.Url.AbsolutePath)
    } catch {
      $res.StatusCode = 500
    } finally {
      $res.OutputStream.Close()
    }
  }
} finally {
  $listener.Stop()
}

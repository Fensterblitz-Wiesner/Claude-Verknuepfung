# Baut einen Ordner mit genau den Dateien, die online gehoeren
# (ohne tools/, .claude/ und README). Der Ordner landet neben dem Projektordner:
#   Dokumente\fensterblitz-wiesner-online
# Diesen Ordner laedst du bei Cloudflare Pages hoch ("Assets direkt hochladen").
# Start:  powershell -ExecutionPolicy Bypass -File tools\upload-vorbereiten.ps1
# (Datei bewusst nur mit ASCII-Zeichen, damit Windows PowerShell 5.1 sie korrekt liest.)

$ErrorActionPreference = 'Stop'
$root   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$ziel   = Join-Path (Split-Path $root -Parent) 'fensterblitz-wiesner-online'
$inhalt = @('index.html', 'impressum.html', 'datenschutz.html', 'css', 'js', 'img', 'fonts')

# Alten Upload-Ordner nur loeschen, wenn er ausschliesslich unsere Dateien enthaelt
if (Test-Path $ziel) {
  $fremd = Get-ChildItem $ziel -Force | Where-Object { $inhalt -notcontains $_.Name }
  if ($fremd) { throw "Im Ordner $ziel liegen fremde Dateien ($($fremd.Name -join ', ')). Bitte pruefen und Ordner selbst loeschen." }
  Remove-Item $ziel -Recurse -Force
}
New-Item -ItemType Directory -Path $ziel | Out-Null

foreach ($teil in $inhalt) {
  $quelle = Join-Path $root $teil
  if (-not (Test-Path $quelle)) { throw "Fehlt: $teil" }
  Copy-Item $quelle -Destination $ziel -Recurse
}

Write-Host "Fertig: $ziel"

# Warnung, falls noch Platzhalter in eckigen Klammern stehen
$offen = Get-ChildItem $ziel -Recurse -Include *.html |
  Select-String -Pattern '\[(Vorname|Nachname|Stra|PLZ|Telefon|Bar, per|Name und)' |
  ForEach-Object { "{0}: {1}" -f $_.Filename, $_.Line.Trim() }
if ($offen) {
  Write-Host ""
  Write-Host "ACHTUNG - noch offene Platzhalter:"
  $offen | ForEach-Object { Write-Host "  $_" }
}
if (Select-String -Path (Join-Path $ziel 'js\config.js') -Pattern 'whatsappNummer:\s*"49X' -Quiet) {
  Write-Host ""
  Write-Host "Hinweis: Noch keine WhatsApp-Nummer in js/config.js (Buttons fuehren zum Kontaktformular)."
}

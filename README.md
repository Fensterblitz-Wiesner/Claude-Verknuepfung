# Fensterblitz Wiesner – Webseite

Statische Webseite (HTML, CSS, JavaScript): kein Baukasten, keine Datenbank, keine laufenden Kosten außer Hosting und Domain.

## Ansehen

- **Am einfachsten:** `index.html` doppelklicken, dann öffnet sie sich im Browser.
- **Mit lokalem Server** (so wie später online):
  `powershell -ExecutionPolicy Bypass -File tools\serve.ps1`, danach http://localhost:8080 öffnen.

## Vor dem Veröffentlichen – Checkliste

1. **WhatsApp-Nummer eintragen:** `js/config.js` öffnen und bei `whatsappNummer` die Nummer
   im Format `4917612345678` eintragen (49 statt der führenden 0, keine Leerzeichen, kein +).
   Solange dort noch `X` stehen, führen alle WhatsApp-Buttons zum Kontaktformular.
2. **Kontaktformular aktivieren (einmalig):** Seite online stellen und das Formular einmal selbst
   absenden. FormSubmit schickt dann eine Bestätigungs-Mail an fensterblitz-wiesner@ik.me, in der
   du auf „Activate Form“ klickst. Erst danach kommen Anfragen an.
   *Optional:* In der Aktivierungs-Mail steht eine zufällige Zeichenfolge. Trage sie in
   `js/config.js` bei `formsubmitId` ein, dann steht deine E-Mail-Adresse nicht mehr im Formular (weniger Spam).
3. **Platzhalter ausfüllen** (alles in `[eckigen Klammern]`):
   - `index.html`: „Über mich“ → `[Vorname]` (2×), FAQ „Wie kann ich bezahlen?“ → `[Bar, per Überweisung oder PayPal]`
   - `impressum.html`: Name, Anschrift, Telefonnummer, ggf. Kleinunternehmer-Hinweis
   - `datenschutz.html`: Name, Anschrift, Hosting-Anbieter
   - In beiden Rechtsseiten den gelben **Hinweis-Kasten löschen**.
4. **FAQ-Antworten prüfen:** Das sind Vorschläge (z. B. „Wasserhahn reicht“, „Haushaltsleiter“).
   Passe sie an, wie du wirklich arbeitest.
5. **Datenschutzerklärung prüfen:** Die Vorlage passt zu dieser Seite, ersetzt aber keine
   Rechtsberatung. Am besten mit e-recht24.de oder datenschutz-generator.de abgleichen.

## Wo ändere ich was?

| Was | Datei |
|---|---|
| WhatsApp-Nummer, WhatsApp-Vortext, Formular-E-Mail | `js/config.js` |
| Texte, Abschnitte, FAQ | `index.html` |
| Farben, Abstände, Schrift | `css/style.css` (oben bei `:root`) |
| Impressum / Datenschutz | `impressum.html` / `datenschutz.html` |

## Eigene Fotos einbauen

- **Über mich:** Foto als `img/ueber-mich.jpg` speichern (quadratisch, ca. 600×600 px). In `index.html`
  steht im Abschnitt „Über mich“ ein Kommentar, welches `<svg>` du durch `<img …>` ersetzt.
- **Startbereich:** In `index.html` beim Hero `img/hero-fenster.svg` durch dein Foto ersetzen
  (z. B. `img/hero-foto.jpg`, Hochformat ca. 900×1000 px).
- Fotos vorher verkleinern (z. B. mit squoosh.app), damit die Seite schnell lädt.

## Online stellen (Cloudflare Pages)

1. `powershell -ExecutionPolicy Bypass -File tools\upload-vorbereiten.ps1` ausführen. Das baut
   den Ordner `Dokumente\fensterblitz-wiesner-online` mit genau den Dateien, die online gehören.
2. Im Cloudflare-Dashboard: **Workers & Pages → Erstellen → Pages → Assets direkt hochladen**,
   dann den Ordner `fensterblitz-wiesner-online` hochladen.
3. Eigene Domain (z. B. `fensterblitz-wiesner.de`) im Pages-Projekt unter **Benutzerdefinierte Domains** verbinden.
4. Bei Änderungen: Schritt 1 erneut ausführen und im Pages-Projekt eine neue Bereitstellung hochladen.

**Datenschutz:** Die Datenschutzerklärung ist auf Cloudflare ausgelegt. Schalte **keine** Zusatzdienste
wie *Web Analytics*, *Zaraz* oder Werbe-/Tracking-Funktionen ein. Sonst muss die Datenschutzerklärung
ergänzt werden, und meist braucht es dann ein Cookie-Banner.

Der Ordner `tools/` und `.claude/` werden für die Webseite nicht gebraucht und müssen nicht hochgeladen werden.

## Schrift

„Plus Jakarta Sans“ (SIL Open Font License 1.1) liegt lokal in `fonts/`, deshalb wird beim
Besuch keine Verbindung zu Google Fonts aufgebaut.

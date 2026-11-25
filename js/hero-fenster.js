/* =========================================================
   Fensterblitz Wiesner – Hero-Fenster (Einstiegs-Animation)
   Zeichnet das Fenster oben auf der Startseite: erst schmutzig,
   dann eingeschäumt, abgezogen und blitzeblank – mit Blick über
   die Dächer der Altstadt auf Dom und Groß St. Martin.
   Ohne JavaScript bleibt das einfache Fensterbild aus <noscript>.
   Wird direkt nach dem Fenster-Bereich geladen (vor dem ersten
   Bild-Aufbau), damit nichts flackert.
   ========================================================= */
(function () {
  "use strict";

  var visual = document.querySelector(".hero__visual");
  if (!visual || !document.createElementNS) return;

  /* Zeitplan in Sekunden – passend zu den Text-Animationen in css/style.css */
  var ZEIT = { wb: 0.85, wd: 1.0, zb: 2.0, zd: 0.95, ende: 2.95 };

  /* ---------- Hilfen ---------- */
  function zufall(seed) { var s = seed; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  function f(n) { return Math.round(n * 10) / 10; }

  /* ---------- Kölner Bauwerke (Fuß y=0, nach oben negativ) ---------- */
  function dom(x, s, c, d) {
    var o = '<g transform="translate(' + x + ' 0) scale(' + s + ')">';
    // Dach des Langhauses und Vierungsturm (dahinter)
    o += '<path d="M-14-70L0-120L14-70Z" fill="' + d + '"/><path d="M-3-112L0-156L3-112Z" fill="' + c + '"/>';
    // zwei Türme mit Stufen und Turmhelm
    o += '<path fill="' + c + '" d="M-54 0V-95H-51V-140H-48V-165L-34-234L-20-165V-140H-17V-95H-14V0Z"/>';
    o += '<path fill="' + c + '" d="M14 0V-95H17V-140H20V-165L34-234L48-165V-140H51V-95H54V0Z"/>';
    // Mittelteil mit Giebel
    o += '<path fill="' + c + '" d="M-14 0V-72L0-104L14-72V0Z"/>';
    // Fialen (kleine Spitzen)
    [[-54,-95,13],[-14,-95,11],[14,-95,11],[54,-95,13],[-51,-140,11],[-17,-140,10],[17,-140,10],[51,-140,11],[-48,-165,8],[-20,-165,8],[20,-165,8],[48,-165,8],[0,-104,8]].forEach(function (p) {
      o += '<path fill="' + c + '" d="M' + (p[0] - 2.6) + ' ' + p[1] + 'L' + p[0] + ' ' + (p[1] - p[2]) + 'L' + (p[0] + 2.6) + ' ' + p[1] + 'Z"/>';
    });
    // Kreuzblumen auf den Turmspitzen
    [-34, 34].forEach(function (tx) { o += '<path fill="' + c + '" d="M' + tx + ' -246L' + (tx + 3) + ' -239L' + tx + ' -232L' + (tx - 3) + ' -239Z"/>'; });
    // Details: Fenster, Portale, Bänder, Maßwerk im Helm
    var det = '';
    [-1, 1].forEach(function (m) {
      [42, 26].forEach(function (cx) { var X = m * cx; det += 'M' + (X - 3.5) + ' -14V-70L' + X + ' -78L' + (X + 3.5) + ' -70V-14Z'; });
      var T = m * 34;
      det += 'M' + (T - 4.5) + ' -100V-128L' + T + ' -136L' + (T + 4.5) + ' -128V-100Z';
      det += 'M' + (T - 5.5) + ' -146h3v-13h-3ZM' + (T + 2.5) + ' -146h3v-13h-3Z';
      det += 'M' + (T - 6) + ' 0V-15Q' + T + ' -26 ' + (T + 6) + ' -15V0Z';
      det += 'M' + (m < 0 ? -54 : 14) + ' -96h40v2.2h-40ZM' + (m < 0 ? -51 : 17) + ' -141h34v2h-34Z';
      [-180, -194, -207, -219].forEach(function (y) { var hw = 13 * (y + 234) / 69; det += 'M' + f(T - hw) + ' ' + y + 'h' + f(2 * hw) + 'v1.8h-' + f(2 * hw) + 'Z'; });
    });
    det += 'M-8 0V-19Q0-32 8-19V0ZM-7-32V-58L0-68L7-58V-32Z';
    o += '<path fill="' + d + '" d="' + det + '"/><circle cx="0" cy="-86" r="4.5" fill="' + d + '"/>';
    return o + '</g>';
  }

  function stMartinGross(x, s) {
    var hell = "#e6d8bf", schatten = "#bba98c", schiefer = "#7a7f92", schieferDunkel = "#545a6c", oeffnung = "#4a4034";
    var o = '<g transform="translate(' + x + ' 0) scale(' + s + ')">';
    // hintere Ecktürmchen (perspektivisch versetzt)
    [[-22, -150, -246, -270], [42, -150, -244, -268]].forEach(function (t) {
      o += '<rect x="' + (t[0] - 5.5) + '" y="' + t[2] + '" width="11" height="' + (t[1] - t[2] + 40) + '" fill="' + schatten + '"/>' +
           '<path d="M' + (t[0] - 7) + ' ' + t[2] + 'L' + t[0] + ' ' + t[3] + 'L' + (t[0] + 7) + ' ' + t[2] + 'Z" fill="' + schieferDunkel + '"/>';
    });
    // Kirchenschiff mit Dach und kleinen Giebeln
    o += '<path d="M-64-62L-50-86H46L60-62Z" fill="' + schiefer + '"/>';
    o += '<rect x="-60" y="-62" width="116" height="62" fill="' + hell + '"/><rect x="40" y="-62" width="16" height="62" fill="' + schatten + '"/>';
    o += '<path d="M-52-62L-39-82L-26-62ZM24-62L37-82L50-62Z" fill="' + hell + '"/>';
    // Helm (Pyramide) mit Licht- und Schattenseite + Kreuz
    o += '<path d="M-34-204L0-314L34-204Z" fill="' + schiefer + '"/><path d="M34-204L44-210L0-314Z" fill="' + schieferDunkel + '"/>';
    o += '<rect x="-1" y="-330" width="2" height="18" fill="' + schieferDunkel + '"/><rect x="-5" y="-325" width="10" height="2" fill="' + schieferDunkel + '"/>';
    // Turmschaft: Vorderseite hell, Seite im Schatten
    o += '<rect x="-32" y="-205" width="64" height="145" fill="' + hell + '"/><path d="M32-205L44-210V-66L32-60Z" fill="' + schatten + '"/>';
    // Giebel oben am Turm
    o += '<path d="M-30-205L0-234L30-205Z" fill="' + hell + '"/><circle cx="0" cy="-216" r="4" fill="' + oeffnung + '"/>';
    o += '<path d="M32-205L38-224L44-210Z" fill="' + schatten + '"/>';
    // Gesimse
    o += '<g fill="' + schatten + '"><rect x="-32" y="-162" width="64" height="2.5"/><rect x="-32" y="-124" width="64" height="2.5"/><rect x="-32" y="-90" width="64" height="2.5"/></g>';
    // romanische Bogenfenster
    var bogen = function (bx, unten, breite, hoehe) {
      var r = breite / 2;
      return 'M' + bx + ' ' + unten + 'V' + (unten - hoehe + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (bx + breite) + ' ' + (unten - hoehe + r) + 'V' + unten + 'Z';
    };
    var fenster = '';
    [-25, -12, 1, 14].forEach(function (bx) { fenster += bogen(bx, -170, 10, 22); });
    [-21, -5.5, 10].forEach(function (bx) { fenster += bogen(bx, -130, 11, 26); });
    [-13, 4].forEach(function (bx) { fenster += bogen(bx, -96, 9, 16); });
    [-49, -31, 21, 39].forEach(function (bx) { fenster += bogen(bx, -18, 8, 20); });
    o += '<path d="' + fenster + '" fill="' + oeffnung + '"/>';
    // vordere Ecktürmchen (achteckig wirkend: Licht- und Schattenhälfte) mit Schieferhut
    [-32, 32].forEach(function (tx) {
      o += '<rect x="' + (tx - 6.5) + '" y="-250" width="13" height="112" fill="' + hell + '"/><rect x="' + tx + '" y="-250" width="6.5" height="112" fill="' + schatten + '"/>' +
           '<path d="M' + (tx - 8) + ' -250L' + tx + ' -280L' + (tx + 8) + ' -250Z" fill="' + schiefer + '"/><path d="M' + tx + ' -280L' + (tx + 8) + ' -250H' + tx + 'Z" fill="' + schieferDunkel + '"/>' +
           '<rect x="' + (tx - 7.5) + '" y="-252" width="15" height="3" fill="' + schatten + '"/>';
      [-238, -214, -190, -166].forEach(function (y) { o += '<rect x="' + (tx - 1.5) + '" y="' + y + '" width="3" height="10" rx="1.5" fill="' + oeffnung + '"/>'; });
    });
    return o + '</g>';
  }


  /* ---------- Häuser, Bäume, Himmel ---------- */
  function hintergrund(farbe, seed) {
    var r = zufall(seed), o = '<g fill="' + farbe + '">', x = -10;
    while (x < 410) { var w = 16 + r() * 26, h = 18 + r() * 40; o += '<rect x="' + f(x) + '" y="' + f(-h) + '" width="' + f(w) + '" height="' + f(h) + '"/>'; x += w; }
    return o + '</g>';
  }

  function wolke(x, y, s, op) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="#fff" opacity="' + op + '"><ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="-14" cy="-8" rx="16" ry="12"/><ellipse cx="10" cy="-12" rx="18" ry="15"/></g>';
  }

  function daecher(y0, wMin, wMax, dachFarben, fassadenFarben, fensterFarbe, seed) {
    var r = zufall(seed), o = '', x = -30, i = 0;
    while (x < 430) {
      var w = wMin + r() * (wMax - wMin), base = y0 + r() * 14, h = w * (.32 + r() * .18);
      var dach = dachFarben[i % dachFarben.length], fassade = fassadenFarben[(i * 3 + 1) % fassadenFarben.length];
      var mansarde = r() > .5;
      // Fassade mit Fenstern
      o += '<rect x="' + f(x) + '" y="' + f(base) + '" width="' + f(w + .5) + '" height="260" fill="' + fassade + '"/>';
      var spalten = w > 50 ? [.2, .5, .8] : [.3, .7];
      for (var y = base + 14; y < 150; y += 26) {
        spalten.forEach(function (sp) {
          var glanz = r() < .18;
          o += '<rect x="' + f(x + w * sp - 3.5) + '" y="' + f(y) + '" width="7" height="11" rx="1" fill="' + (glanz ? "#fff3cf" : fensterFarbe) + '"/>';
        });
      }
      // Dach
      o += mansarde
        ? '<path d="M' + f(x - 2) + ' ' + f(base) + 'L' + f(x + w * .12) + ' ' + f(base - h) + 'H' + f(x + w * .88) + 'L' + f(x + w + 2) + ' ' + f(base) + 'Z" fill="' + dach + '"/>'
        : '<path d="M' + f(x - 2) + ' ' + f(base) + 'L' + f(x + w / 2) + ' ' + f(base - h) + 'L' + f(x + w + 2) + ' ' + f(base) + 'Z" fill="' + dach + '"/>';
      o += '<rect x="' + f(x - 2) + '" y="' + f(base - 2) + '" width="' + f(w + 4) + '" height="3" fill="#000" opacity=".12"/>';
      // Gaube
      if (mansarde && r() > .3) {
        var gx = x + w * .4, gy = base - h * .78;
        o += '<rect x="' + f(gx) + '" y="' + f(gy) + '" width="' + f(w * .2) + '" height="' + f(h * .5) + '" fill="' + fassade + '"/>' +
             '<path d="M' + f(gx - 2) + ' ' + f(gy) + 'L' + f(gx + w * .1) + ' ' + f(gy - 6) + 'L' + f(gx + w * .2 + 2) + ' ' + f(gy) + 'Z" fill="' + dach + '"/>' +
             '<rect x="' + f(gx + w * .1 - 2.5) + '" y="' + f(gy + 3) + '" width="5" height="' + f(h * .3) + '" fill="' + fensterFarbe + '"/>';
      }
      // Schornstein (+ manchmal Antenne)
      if (r() > .35) {
        var sx = x + w * (.22 + r() * .5), hoehe = mansarde ? h : h * (1 - Math.abs(sx - (x + w / 2)) / (w / 2));
        var top = base - hoehe - 12;
        o += '<rect x="' + f(sx) + '" y="' + f(top) + '" width="7" height="' + f(hoehe * .6 + 14) + '" fill="#8b6a5c"/><rect x="' + f(sx - 1.5) + '" y="' + f(top - 2) + '" width="10" height="3" fill="#6d5246"/>';
        if (r() > .6) o += '<path d="M' + f(sx + 3.5) + ' ' + f(top - 2) + 'v-14M' + f(sx - 3) + ' ' + f(top - 12) + 'h13M' + f(sx - 1) + ' ' + f(top - 7) + 'h9" stroke="#6b7387" stroke-width="1.2"/>';
      }
      x += w; i++;
    }
    return o;
  }

  /* Baumkronen zwischen den Häuserreihen */
  function baeume(y, seed) {
    var r = zufall(seed), gruen = ["#7fae74", "#6a9c63", "#8dbb7f", "#5f8f59"], o = '';
    for (var i = 0; i < 16; i++) {
      var cx = r() * 400, cy = y + r() * 10, rad = 12 + r() * 12;
      o += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(rad) + '" fill="' + gruen[i % 4] + '"/><circle cx="' + f(cx + rad * .6) + '" cy="' + f(cy + 4) + '" r="' + f(rad * .7) + '" fill="' + gruen[(i + 1) % 4] + '"/>';
    }
    return o;
  }

  /* Stadtbilder in einer 400 breiten Bühne, Ufer auf y=0 */

  /* ---------- Fensterbank, Griff, Pflanze ---------- */
  var BANK = function (x, y, w) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="22" rx="9" fill="url(#iv-bank)" filter="url(#iv-schatten-klein)"/>'; };
  var GRIFF = function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="9" height="40" rx="4.5" fill="#D3DBF3"/><rect x="' + (x - 2) + '" y="' + y + '" width="13" height="12" rx="4" fill="#BFC9EA"/>'; };
  var PFLANZE = function (x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-6-48C-26-62-32-84-24-96-8-86 0-66-6-48Z" fill="#2E9E62"/><path d="M4-46C10-70 30-86 44-82 42-64 24-50 4-46Z" fill="#3BB273"/>' +
      '<path d="M-2-44C-6-74 2-98 14-106 22-90 14-62-2-44Z" fill="#46C281"/><path d="M-24-44h48l-6 44h-36z" fill="#FFC83D"/><rect x="-27" y="-48" width="54" height="10" rx="4" fill="#F2B51F"/></g>';
  };

  /* ---------- Schmutz, Schaum, Werkzeuge ---------- */
  function dreck(b, staerke) {
    var r = zufall(11), X = b.x, Y = b.y, W = b.w, H = b.h;
    var o = '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="' + H + '" fill="#8a826c" opacity="' + staerke + '"/>' +
            '<rect x="' + X + '" y="' + Y + '" width="' + W + '" height="' + H + '" fill="url(#iv-verlauf)"/>';
    o += '<g filter="url(#iv-weich)" fill="#5f5747" opacity=".4">';
    for (var i = 0; i < 9; i++) o += '<ellipse cx="' + f(X + r() * W) + '" cy="' + f(Y + r() * H) + '" rx="' + f(16 + r() * 22) + '" ry="' + f(10 + r() * 16) + '"/>';
    o += '</g><g filter="url(#iv-leicht)" fill="none" stroke="#655b48" stroke-linecap="round">';
    for (var j = 0; j < 18; j++) {
      var x = X + 6 + r() * (W - 12), y = Y + 6 + r() * H * .55, l = 70 + r() * H * .45, w = (r() - .5) * 10;
      o += '<path d="M' + f(x) + ' ' + f(y) + 'q' + f(w) + ' ' + f(l / 2) + ' 0 ' + f(l) + '" stroke-width="' + f(2 + r() * 3) + '" opacity="' + f(.25 + r() * .2) + '"/>';
    }
    o += '</g>';
    for (var k = 0; k < 55; k++) o += '<circle cx="' + f(X + r() * W) + '" cy="' + f(Y + r() * H) + '" r="' + f(1 + r() * 2.6) + '" fill="#4f4738" opacity="' + f(.3 + r() * .35) + '"/>';
    return o;
  }

  function schaum(b) {
    var r = zufall(5), o = '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="#f1f5ff" opacity=".93"/>';
    var n = Math.round(b.w * b.h / 1000);
    for (var i = 0; i < n; i++) o += '<circle cx="' + f(b.x - 4 + r() * (b.w + 8)) + '" cy="' + f(b.y - 4 + r() * (b.h + 8)) + '" r="' + f(3 + r() * 12) + '" fill="#fff" stroke="#c4d2fb" stroke-width="1.4"/>';
    return o;
  }

  var SPLINE = 'calcMode="spline" keyTimes="0;1" keySplines=".45 0 .35 1"';
  function bewegen(werte, b, d) { return '<animateTransform attributeName="transform" type="translate" values="' + werte + '" begin="' + b + 's" dur="' + d + 's" fill="freeze" ' + SPLINE + '/>'; }
  function einAus(b, d) {
    return '<animate attributeName="opacity" values="0;1" begin="' + b + 's" dur="0.18s" fill="freeze"/>' +
           '<animate attributeName="opacity" values="1;0" begin="' + f(b + d) + 's" dur="0.25s" fill="freeze"/>';
  }
  function waescher(x0, x1) {
    var cx = (x0 + x1) / 2, o = '<g transform="translate(' + cx + ' -14) rotate(24)"><rect x="-7" y="-96" width="14" height="96" rx="7" fill="#3F63EC" stroke="#2A3890" stroke-width="2"/></g>';
    o += '<rect x="' + (cx - 16) + '" y="-24" width="32" height="12" rx="3" fill="#2A3890"/>';
    o += '<rect x="' + x0 + '" y="-16" width="' + (x1 - x0) + '" height="32" rx="16" fill="#EEF3FF" stroke="#B6C6F2" stroke-width="2"/>';
    for (var x = x0 + 10; x < x1 - 6; x += 13) o += '<circle cx="' + f(x) + '" cy="-15" r="5.5" fill="#F7F9FF" stroke="#C9D6FF" stroke-width="1.2"/><circle cx="' + f(x + 6) + '" cy="15" r="5.5" fill="#F7F9FF" stroke="#C9D6FF" stroke-width="1.2"/>';
    return o;
  }
  function abzieher(x0, x1) {
    var cx = (x0 + x1) / 2;
    return '<g transform="translate(' + cx + ' -32) rotate(20)"><rect x="-8" y="-100" width="16" height="100" rx="8" fill="#FFC83D" stroke="#2A3890" stroke-width="2"/></g>' +
      '<path d="M' + (cx - 20) + ' -15L' + (cx - 9) + ' -34H' + (cx + 9) + 'L' + (cx + 20) + ' -15Z" fill="#2A3890"/>' +
      '<rect x="' + (x0 + 4) + '" y="-17" width="' + (x1 - x0 - 8) + '" height="15" rx="5" fill="#3B4DB3"/>' +
      '<rect x="' + x0 + '" y="-3" width="' + (x1 - x0) + '" height="7" rx="3.5" fill="#1B1F2A"/>';
  }

  var MASKE = 'maskUnits="userSpaceOnUse" x="-100" y="-100" width="680" height="740"';

  /* ---------- Blick nach draußen: Sonnenaufgang über der Altstadt ---------- */
  function stadtbild() {
    return '<defs><radialGradient id="iv-sonne"><stop offset="0" stop-color="#ffe0b8" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc49a" stop-opacity=".55"/><stop offset="1" stop-color="#ffb08a" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="182" cy="-92" r="95" fill="url(#iv-sonne)"/><circle cx="182" cy="-92" r="20" fill="#fff0d6"/>' +
      wolke(60, -268, .9, .75) + wolke(330, -330, .7, .7) +
      '<g transform="translate(0 -34)">' + hintergrund("#d9d3dc", 30) + '</g>' +
      '<g transform="translate(0 -14)">' + dom(96, 1.15, "#625d72", "#47435a") + '</g>' +
      '<g transform="translate(0 32)">' + stMartinGross(300, .85) + '</g>' +
      daecher(-40, 34, 56, ["#c48a74", "#b77d68", "#8d93a6", "#c99682"], ["#e8dccb", "#dfe3ea", "#efd9c2", "#e3d6c4"], "#9aa3b8", 41) +
      '<rect x="-30" y="-340" width="460" height="410" fill="#fde3d3" opacity=".16"/>' +
      baeume(-6, 7) +
      daecher(30, 48, 84, ["#b5634a", "#a85a44", "#6f7890", "#c0705a", "#99503d"], ["#f2e3cf", "#e6eef6", "#f4d9c6", "#efe7d0", "#dde8da"], "#7d879e", 52) +
      '<rect x="-30" y="-340" width="460" height="520" fill="#ff9a78" opacity=".07"/>';
  }

  /* ---------- Altbaufenster mit sechs Scheiben ---------- */
  var SCHEIBEN = '<rect x="96" y="66" width="138" height="120" rx="6"/><rect x="246" y="66" width="138" height="120" rx="6"/>' +
                 '<rect x="96" y="196" width="138" height="120" rx="6"/><rect x="246" y="196" width="138" height="120" rx="6"/>' +
                 '<rect x="96" y="326" width="138" height="128" rx="6"/><rect x="246" y="326" width="138" height="128" rx="6"/>';
  var BOX = { x: 96, y: 66, w: 288, h: 388 };
  var STERN = "M0-14C1.6-4.6 4.6-1.6 14 0 4.6 1.6 1.6 4.6 0 14-1.6 4.6-4.6 1.6-14 0-4.6-1.6-1.6-4.6 0-14Z";

  function fensterSvg() {
    var t = ZEIT, b = BOX, basis = Math.round(b.y + b.h * 0.74), s = b.w / 400;
    var y0 = b.y - 26, y1 = b.y + b.h + 26, x0 = b.x - 26, x1 = b.x + b.w + 26, weg = "0 " + y0 + ";0 " + y1;

    var defs = '<defs>' +
      '<linearGradient id="iv-himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c4e6"/><stop offset=".55" stop-color="#f2cbc0"/><stop offset="1" stop-color="#fcd2b0"/></linearGradient>' +
      '<linearGradient id="iv-boden" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#efe3d2"/><stop offset="1" stop-color="#e2d4c0"/></linearGradient>' +
      '<linearGradient id="iv-bank" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E3E9FA"/></linearGradient>' +
      '<linearGradient id="iv-glanz" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="iv-verlauf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6b6250" stop-opacity="0"/><stop offset="1" stop-color="#6b6250" stop-opacity=".5"/></linearGradient>' +
      '<clipPath id="iv-glas">' + SCHEIBEN + '</clipPath>' +
      '<filter id="iv-schatten" x="-25%" y="-20%" width="150%" height="150%"><feDropShadow dx="0" dy="22" stdDeviation="20" flood-color="#14205E" flood-opacity="0.32"/></filter>' +
      '<filter id="iv-schatten-klein" x="-20%" y="-50%" width="140%" height="250%"><feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#14205E" flood-opacity="0.25"/></filter>' +
      '<filter id="iv-weich" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>' +
      '<filter id="iv-leicht" x="-20%" y="-5%" width="140%" height="110%"><feGaussianBlur stdDeviation="1.2"/></filter>' +
      // Masken: bereits eingeschäumter Bereich / noch nicht abgezogener Bereich
      '<mask id="iv-m-wasch" ' + MASKE + '><rect x="-100" y="-700" width="680" height="700" fill="#fff">' + bewegen(weg, t.wb, t.wd) + '</rect></mask>' +
      '<mask id="iv-m-nass" ' + MASKE + '><rect x="-100" y="0" width="680" height="800" fill="#fff">' + bewegen(weg, t.zb, t.zd) + '</rect></mask>' +
      '</defs>';

    var o = '<svg class="hero__fenster" viewBox="0 0 480 540" role="img" aria-label="Illustration: Blick durch ein frisch geputztes Fenster über die Dächer der Kölner Altstadt auf Dom und Groß St. Martin">' + defs;
    o += '<circle cx="240" cy="260" r="225" fill="#fff" opacity="0.08"/><circle cx="240" cy="260" r="165" fill="#fff" opacity="0.07"/>';
    o += '<rect x="80" y="50" width="320" height="420" rx="22" fill="#fff" filter="url(#iv-schatten)"/>';

    // Blick nach draußen + Glas
    o += '<g clip-path="url(#iv-glas)">';
    o += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="url(#iv-himmel)"/>';
    o += '<rect x="' + b.x + '" y="' + basis + '" width="' + b.w + '" height="' + (b.y + b.h - basis + 4) + '" fill="url(#iv-boden)"/>';
    o += '<g transform="translate(' + b.x + ' ' + basis + ') scale(' + f(s * 100) / 100 + ')">' + stadtbild() + '</g>';
    o += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="#eaf1ff" opacity=".08"/>';
    o += '<polygon points="' + (b.x - 30) + ',' + (b.y + b.h * .78) + ' ' + (b.x + b.w * .62) + ',' + (b.y - 10) + ' ' + (b.x + b.w * .78) + ',' + (b.y - 10) + ' ' + (b.x - 30) + ',' + (b.y + b.h * .9) + '" fill="#fff" opacity=".17"/>';
    o += '<polygon points="' + (b.x - 30) + ',' + (b.y + b.h * 1.02) + ' ' + (b.x + b.w * .9) + ',' + (b.y + b.h * .1) + ' ' + (b.x + b.w * .94) + ',' + (b.y + b.h * .1) + ' ' + (b.x - 30) + ',' + (b.y + b.h * 1.07) + '" fill="#fff" opacity=".12"/>';
    // wandernder Glanz, alle 7 Sekunden
    o += '<g transform="translate(-420 0)"><animateTransform attributeName="transform" type="translate" values="-420 0;640 0;640 0" keyTimes="0;.2;1" dur="7s" begin="' + t.ende + 's" repeatCount="indefinite"/>' +
         '<rect x="' + b.x + '" y="' + (b.y - 80) + '" width="80" height="' + (b.h + 160) + '" fill="url(#iv-glanz)" transform="skewX(-22)"/></g>';
    // Schmutz + Schaum, die weggeputzt werden
    o += '<g mask="url(#iv-m-nass)">' + dreck(b, .66) + '<g mask="url(#iv-m-wasch)">' + schaum(b) + '</g></g>';
    // Aufblitzen des sauberen Glases
    o += '<rect x="' + b.x + '" y="' + b.y + '" width="' + b.w + '" height="' + b.h + '" fill="#fff" opacity="0"><animate attributeName="opacity" values="0;.7;0" keyTimes="0;.18;1" begin="' + t.ende + 's" dur=".8s" fill="freeze"/></rect>';
    o += '</g>';

    // Fensterkreuz-Details, Bank, Pflanze
    o += GRIFF(220, 300) + BANK(56, 466, 368) + PFLANZE(352, 466);

    // Einwascher und Abzieher
    o += '<g opacity="0">' + einAus(t.wb, t.wd) + bewegen(weg, t.wb, t.wd) + waescher(x0, x1) + '</g>' +
         '<g opacity="0">' + einAus(t.zb, t.zd) + bewegen(weg, t.zb, t.zd) + abzieher(x0, x1) + '</g>';

    // Seifenblasen beim Einschäumen
    var rz = zufall(3);
    for (var i = 0; i < 16; i++) {
      var by = b.y + 20 + rz() * (b.h - 40), bx = b.x + 14 + rz() * (b.w - 28), rad = 6 + rz() * 9;
      var beg = f(t.wb + (by - b.y + 26) / (b.h + 52) * t.wd);
      o += '<circle cx="' + f(bx) + '" cy="' + f(by) + '" r="' + f(rad) + '" fill="#fff" fill-opacity=".25" stroke="#fff" stroke-width="1.6" opacity="0">' +
        '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.75;1" begin="' + beg + 's" dur="1.5s" fill="freeze"/>' +
        '<animateTransform attributeName="transform" type="translate" values="0 0;' + f((rz() - .5) * 70) + ' ' + f(-110 - rz() * 90) + '" begin="' + beg + 's" dur="1.5s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines=".2 .6 .4 1"/></circle>';
    }

    // Funkeln nach dem Putzen
    var sterne = [[b.x + b.w + 34, b.y + 22, 1.3, "#fff", 0], [b.x - 38, b.y + b.h * .45, 1, "#FFC83D", .9], [b.x + 46, b.y + 34, 1, "#fff", 1.8],
                  [b.x + b.w + 42, b.y + b.h * .8, .8, "#fff", 1.3], [b.x + b.w * .72, b.y + b.h * .3, .7, "#fff", .5]];
    o += '<g opacity="0"><animate attributeName="opacity" values="0;1" begin="' + t.ende + 's" dur=".35s" fill="freeze"/>';
    sterne.forEach(function (st) {
      o += '<g transform="translate(' + f(st[0]) + ' ' + f(st[1]) + ') scale(' + st[2] + ')"><path d="' + STERN + '" fill="' + st[3] + '" class="iv-funkel" style="animation-delay:' + st[4] + 's"/></g>';
    });
    return o + '</g></svg>';
  }

  /* ---------- Einfügen und steuern ---------- */
  visual.insertAdjacentHTML("afterbegin", fensterSvg());
  var svg = visual.querySelector(".hero__fenster");
  if (!svg || !svg.pauseAnimations) return;
  var hero = document.querySelector(".hero");

  // „Bewegung reduzieren“: gleich das saubere Fenster zeigen, nichts bewegt sich.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    svg.setCurrentTime(30);
    svg.pauseAnimations();
    return;
  }

  // Fenster beim Laden nicht im Bild (z. B. auf dem Handy unter den Buttons):
  // gleich die fertige Überschrift zeigen und erst putzen, wenn das Fenster sichtbar wird.
  if (svg.getBoundingClientRect().top > (window.innerHeight || 800) * 0.7) {
    if (hero) hero.classList.add("hero--direkt");
    svg.pauseAnimations();
    svg.setCurrentTime(0);
    if ("IntersectionObserver" in window) {
      var beobachter = new IntersectionObserver(function (eintraege) {
        if (eintraege[0].isIntersecting) {
          svg.unpauseAnimations();
          beobachter.disconnect();
        }
      }, { threshold: 0.45 });
      beobachter.observe(svg);
    } else {
      svg.unpauseAnimations();
    }
  }
})();

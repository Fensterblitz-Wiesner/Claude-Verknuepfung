/* Fensterblitz Wiesner – Seitenlogik (ohne externe Bibliotheken) */
(function () {
  "use strict";

  var cfg = window.FB_CONFIG || {};
  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- WhatsApp-Links ---------- */
  var nummer = String(cfg.whatsappNummer || "").replace(/\D/g, "");
  if (nummer.indexOf("00") === 0) nummer = nummer.slice(2);
  var waGueltig = /^[1-9]\d{7,14}$/.test(nummer) && !/x/i.test(String(cfg.whatsappNummer));

  if (waGueltig) {
    var waUrl = "https://wa.me/" + nummer + (cfg.whatsappText ? "?text=" + encodeURIComponent(cfg.whatsappText) : "");
    document.querySelectorAll("[data-whatsapp]").forEach(function (a) {
      a.setAttribute("href", waUrl);
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  } else {
    // Ohne gültige Nummer bleiben die Links auf dem Kontaktformular (href aus dem HTML).
    console.info("[Fensterblitz] Noch keine WhatsApp-Nummer in js/config.js – WhatsApp-Buttons führen vorerst zum Kontaktformular.");
  }

  /* ---------- Mobile Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("mobile-menu");

  function menuSchliessen() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menü öffnen");
    menu.hidden = true;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var offen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!offen));
      toggle.setAttribute("aria-label", offen ? "Menü öffnen" : "Menü schließen");
      menu.hidden = offen;
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) menuSchliessen();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        menuSchliessen();
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !e.target.closest(".nav-pill")) menuSchliessen();
    });
  }

  /* ---------- Header-Schatten beim Scrollen ---------- */
  var header = document.querySelector(".site-header");
  function headerStatus() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  }
  headerStatus();
  window.addEventListener("scroll", headerStatus, { passive: true });

  /* ---------- Einblend-Animationen & aktiver Menüpunkt ---------- */
  var bewegungReduziert = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !bewegungReduziert) {
    var revealObs = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObs.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window && navLinks.length) {
    var navObs = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) {
      var ziel = document.querySelector(a.getAttribute("href"));
      if (ziel) navObs.observe(ziel);
    });
  }

  /* ---------- Jahreszahl im Footer ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Kontaktformular (FormSubmit) ---------- */
  var form = document.getElementById("anfrage-form");
  if (!form) return;

  var ziel = (cfg.formsubmitId || cfg.email || "").trim();
  if (ziel) form.setAttribute("action", "https://formsubmit.co/" + ziel);
  var ajaxEndpoint = "https://formsubmit.co/ajax/" + ziel;

  var statusEl = form.querySelector(".form-status");
  var button = form.querySelector("button[type='submit']");
  var buttonHtml = button ? button.innerHTML : "";

  function status(typ, text) {
    if (!statusEl) return;
    statusEl.className = "form-status is-visible is-" + typ;
    statusEl.textContent = text;
  }

  // Rückkehr von FormSubmit nach einem Versand mit Anhängen (siehe mitAnhaengenSenden)
  if (/[?&]gesendet=1/.test(location.search)) {
    status("success", "Vielen Dank! Ihre Anfrage ist angekommen – ich melde mich so schnell wie möglich bei Ihnen.");
    if (history.replaceState) history.replaceState(null, "", location.pathname + location.hash);
  }

  /* ---------- Anhänge (Fotos / Dateien) ---------- */
  // FormSubmit erlaubt Anhänge nur beim normalen Absenden (nicht per AJAX),
  // alle Dateien zusammen max. 10 MB.
  var MAX_BYTES = 10 * 1024 * 1024;
  var MAX_DATEIEN = 10;
  var dateiInput = form.querySelector(".attach__input");
  var dateiListe = form.querySelector(".attach__list");
  var dateien = [];

  function groesse(bytes) {
    if (bytes < 1048576) return Math.max(1, Math.round(bytes / 1024)) + " KB";
    return (bytes / 1048576).toFixed(1).replace(".", ",") + " MB";
  }

  function listeZeigen() {
    dateiListe.innerHTML = "";
    dateien.forEach(function (datei, i) {
      var li = document.createElement("li");
      var name = document.createElement("span");
      name.className = "attach__name";
      name.textContent = datei.name;
      var size = document.createElement("span");
      size.className = "attach__size";
      size.textContent = groesse(datei.size);
      var weg = document.createElement("button");
      weg.type = "button";
      weg.className = "attach__remove";
      weg.setAttribute("aria-label", "Entfernen: " + datei.name);
      weg.innerHTML = '<svg aria-hidden="true"><use href="#i-close"/></svg>';
      weg.addEventListener("click", function () {
        dateien.splice(i, 1);
        listeZeigen();
      });
      li.appendChild(name);
      li.appendChild(size);
      li.appendChild(weg);
      dateiListe.appendChild(li);
    });
    dateiListe.hidden = dateien.length === 0;
  }

  if (dateiInput && dateiListe) {
    // Mit JavaScript sammeln wir die Dateien selbst (mehrfach auswählen, einzeln entfernen).
    dateiInput.removeAttribute("name");
    dateiInput.addEventListener("change", function () {
      Array.prototype.forEach.call(dateiInput.files, function (datei) {
        if (dateien.length < MAX_DATEIEN) dateien.push(datei);
      });
      dateiInput.value = "";
      listeZeigen();
    });
  }

  // Handyfotos sind oft 3–8 MB groß: vor dem Senden auf max. 2000 px verkleinern,
  // damit mehrere Fotos unter das 10-MB-Limit passen. Klappt das nicht, bleibt das Original.
  function verkleinern(datei) {
    if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(datei.type) || datei.size < 800 * 1024) {
      return Promise.resolve(datei);
    }
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(datei);
      var img = new Image();
      img.onload = function () {
        var faktor = Math.min(1, 2000 / Math.max(img.naturalWidth, img.naturalHeight));
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * faktor);
        canvas.height = Math.round(img.naturalHeight * faktor);
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(function (blob) {
          if (!blob || blob.size >= datei.size) return resolve(datei);
          resolve(new File([blob], datei.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.82);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        resolve(datei);
      };
      img.src = url;
    });
  }

  function mitAnhaengenSenden() {
    status("loading", "Fotos werden vorbereitet …");
    return Promise.all(dateien.map(verkleinern)).then(function (fertig) {
      var summe = fertig.reduce(function (s, d) { return s + d.size; }, 0);
      if (summe > MAX_BYTES) throw new Error("zu-gross");
      if (typeof DataTransfer === "undefined") throw new Error("kein-upload");

      form.querySelectorAll("[data-anhang]").forEach(function (el) { el.remove(); });
      function verstecktesFeld(name, wert) {
        var el = document.createElement("input");
        el.type = "hidden";
        el.name = name;
        el.value = wert;
        el.setAttribute("data-anhang", "");
        form.appendChild(el);
      }
      // FormSubmit nimmt mehrere Dateifelder an – ein Feld pro Datei.
      fertig.forEach(function (datei, i) {
        var dt = new DataTransfer();
        dt.items.add(datei);
        var feld = document.createElement("input");
        feld.type = "file";
        feld.name = "attachment" + (i + 1);
        feld.hidden = true;
        feld.setAttribute("data-anhang", "");
        feld.files = dt.files;
        form.appendChild(feld);
      });
      verstecktesFeld("_next", location.origin + location.pathname + "?gesendet=1#anfrage-form");
      verstecktesFeld("_captcha", "false");

      status("loading", "Ihre Anfrage wird gesendet …");
      form.setAttribute("enctype", "multipart/form-data");
      form.submit();
    });
  }

  // Zurück-Taste vom FormSubmit-Server: Button wieder freigeben
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && button) {
      button.disabled = false;
      button.innerHTML = buttonHtml;
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Spam-Falle: echte Menschen füllen dieses versteckte Feld nicht aus.
    var honey = form.querySelector("[name='_honey']");
    if (honey && honey.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = "Wird gesendet …";
    }

    if (dateien.length) {
      mitAnhaengenSenden().catch(function (err) {
        console.warn("[Fensterblitz] Anhänge konnten nicht gesendet werden:", err);
        status("error", err.message === "zu-gross"
          ? "Die Dateien sind zusammen größer als 10 MB. Bitte entfernen Sie ein paar Dateien oder schicken Sie die Fotos per WhatsApp."
          : "Ihr Browser kann die Dateien hier leider nicht anhängen. Bitte schicken Sie die Fotos per WhatsApp oder an " + (cfg.email || "meine E-Mail-Adresse") + ".");
        if (button) {
          button.disabled = false;
          button.innerHTML = buttonHtml;
        }
      });
      return;
    }

    var daten = {};
    new FormData(form).forEach(function (wert, schluessel) { daten[schluessel] = wert; });
    status("loading", "Ihre Anfrage wird gesendet …");

    fetch(ajaxEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(daten)
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) {
          if (!res.ok || String(json.success) !== "true") {
            throw new Error(json.message || "HTTP " + res.status);
          }
        });
      })
      .then(function () {
        form.reset();
        status("success", "Vielen Dank! Ihre Anfrage ist angekommen – ich melde mich so schnell wie möglich bei Ihnen.");
      })
      .catch(function (err) {
        console.warn("[Fensterblitz] Formular konnte nicht gesendet werden:", err);
        status("error", "Das hat leider nicht geklappt. Bitte schreiben Sie mir direkt per WhatsApp oder an " + (cfg.email || "meine E-Mail-Adresse") + ".");
      })
      .then(function () {
        if (button) {
          button.disabled = false;
          button.innerHTML = buttonHtml;
        }
      });
  });
})();

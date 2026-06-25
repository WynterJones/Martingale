(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ====== CONFIG — the free download ===================================
     The kit is a free ZIP that sits next to this page. Every [data-buy]
     link points at it and downloads on click — no checkout, no signup.
     To host the ZIP elsewhere (CDN / release asset), set DOWNLOAD_URL to
     that absolute URL instead; the `download` attr still names the file.
     Rebuild the ZIP from the repo root (see salespage/README.md).        */
  var DOWNLOAD_URL = "nabudesigner-kit.zip";
  /* ===================================================================== */

  document.querySelectorAll("[data-buy]").forEach(function (a) {
    a.setAttribute("href", DOWNLOAD_URL);
    a.setAttribute("download", "nabudesigner-kit.zip");
  });

  /* current year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* nav scrolled state */
  var nav = document.getElementById("nav");
  function onScrollNav() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 30); }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* mobile drawer */
  var drawer = document.getElementById("drawer");
  var toggle = document.getElementById("navToggle");
  var dclose = document.getElementById("drawerClose");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(true); });
  if (dclose) dclose.addEventListener("click", function () { setDrawer(false); });
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setDrawer(false); });
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id === "#top") return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  /* count-up stats */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1000, 1);
          el.textContent = Math.round(end * (0.5 - Math.cos(p * Math.PI) / 2));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  /* ====== host video modal (real YouTube) ====== */
  var fab = document.getElementById("fab");
  var modal = document.getElementById("modal");
  var player = document.getElementById("player");
  if (fab && modal && player) {
    var mclose = document.getElementById("modalClose");
    function openModal() {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      player.src = player.dataset.src + "&autoplay=1";
    }
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      player.src = "";
    }
    fab.addEventListener("click", openModal);
    mclose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
  }

  /* ====== starfield particle helper (drifting stars + twinkle) ====== */
  function starField(canvas, colors, density) {
    if (!canvas || !canvas.getContext || reduce) return;
    var ctx = canvas.getContext("2d"), dots = [], W, H, raf, host = canvas.parentElement;
    function size() {
      W = canvas.width = host.offsetWidth;
      H = canvas.height = host.offsetHeight;
      var n = Math.min(90, Math.round(W / density));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.28 + 0.06),
        vx: (Math.random() - 0.5) * 0.16,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.04 + 0.01,
        a: Math.random() * 0.5 + 0.25,
        c: colors[(Math.random() * colors.length) | 0]
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy; d.x += d.vx; d.tw += d.ts;
        if (d.y < -12) { d.y = H + 12; d.x = Math.random() * W; }
        if (d.x < -12) d.x = W + 12; else if (d.x > W + 12) d.x = -12;
        var a = d.a * (0.55 + 0.45 * Math.sin(d.tw));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + d.c + "," + a.toFixed(2) + ")";
        ctx.shadowBlur = 7; ctx.shadowColor = "rgba(" + d.c + ",.8)";
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) cancelAnimationFrame(raf); else draw();
    });
    size(); draw();
    window.addEventListener("resize", size);
  }
  starField(document.getElementById("stars"), ["123,108,255", "52,227,196", "246,207,114"], 20);
  starField(document.getElementById("starField"), ["123,108,255", "176,102,255", "246,207,114"], 26);
})();

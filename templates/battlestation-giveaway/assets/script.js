(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Lenis smooth scroll */
  if (window.Lenis && !reduce) {
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
  }

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
  function onScrollNav() { nav.classList.toggle("scrolled", window.scrollY > 30); }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* mobile drawer */
  var drawer = document.getElementById("drawer");
  var toggle = document.getElementById("navToggle");
  var dclose = document.getElementById("drawerClose");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setDrawer(true); });
  dclose.addEventListener("click", function () { setDrawer(false); });
  drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href === "#" || link.id === "enterBtn" || link.id === "enterBtn2") return;
      var t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  /* parallax band layers */
  var layers = Array.prototype.slice.call(document.querySelectorAll(".parallax"));
  if (layers.length && !reduce) {
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute("data-speed")) || 0.15;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* count-up (commas + optional $ prefix) */
  function fmt(n, prefix) { return (prefix || "") + Math.round(n).toLocaleString("en-US"); }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = parseInt(el.getAttribute("data-count"), 10),
            prefix = el.getAttribute("data-prefix") || "", t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 1100, 1);
          el.textContent = fmt(end * (0.5 - Math.cos(p * Math.PI) / 2), prefix);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = fmt(parseInt(el.getAttribute("data-count"), 10), el.getAttribute("data-prefix") || ""); });
  }

  /* countdown to the next June 30, 20:00 local */
  function nextTarget() {
    var now = new Date();
    var t = new Date(now.getFullYear(), 5, 30, 20, 0, 0); /* month 5 = June */
    if (t.getTime() < now.getTime()) t = new Date(now.getFullYear() + 1, 5, 30, 20, 0, 0);
    return t;
  }
  var target = nextTarget();
  var cdD = document.getElementById("cdD"), cdH = document.getElementById("cdH"),
      cdM = document.getElementById("cdM"), cdS = document.getElementById("cdS"),
      topCd = document.getElementById("topCountdown");
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    var ms = Math.max(0, target.getTime() - Date.now());
    var s = Math.floor(ms / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    if (cdD) { cdD.textContent = pad(d); cdH.textContent = pad(h); cdM.textContent = pad(m); cdS.textContent = pad(s); }
    if (topCd) topCd.textContent = pad(d) + "d " + pad(h) + ":" + pad(m) + ":" + pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* enter-to-win form handling (demo: no real submission) */
  function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  var counterEls = ["entryCount", "entryCount2"].map(function (id) { return document.getElementById(id); });
  var liveCount = 48217;
  function bumpCounters() {
    liveCount += 1;
    counterEls.forEach(function (el) { if (el) el.textContent = liveCount.toLocaleString("en-US"); });
  }
  function wireForm(formId, inputId, noteId) {
    var form = document.getElementById(formId);
    if (!form) return;
    var input = document.getElementById(inputId);
    var row = form.querySelector(".enter-row");
    var note = noteId ? document.getElementById(noteId) : form.querySelector(".enter-note");
    function submit(e) {
      if (e) e.preventDefault();
      var v = (input.value || "").trim();
      if (!emailOk(v)) {
        row.classList.add("err"); row.classList.remove("ok");
        input.focus();
        return;
      }
      row.classList.add("ok"); row.classList.remove("err");
      bumpCounters();
      if (note) note.innerHTML = "<b>You're in.</b> Check your inbox for your referral link to unlock 5× entries.";
      input.value = "";
      input.placeholder = "Entered ✓";
    }
    form.addEventListener("submit", submit);
    input.addEventListener("input", function () { row.classList.remove("err"); });
    var btn = form.querySelector(".btn-cta");
    if (btn) btn.addEventListener("click", submit);
  }
  wireForm("enter", "email", "enterNote");
  wireForm("enter2", "email2");

  /* video modal (real YouTube embed) */
  var watch = document.getElementById("watchBtn");
  var modal = document.getElementById("videoModal");
  var player = document.getElementById("player");
  if (watch && modal && player) {
    var mClose = document.getElementById("modalClose");
    function open() {
      modal.classList.add("open"); modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      player.src = player.dataset.src + "&autoplay=1";
    }
    function close() {
      modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      player.src = "";
    }
    watch.addEventListener("click", open);
    mClose.addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) { el.addEventListener("click", close); });
  }

  /* hero particle field — cyan / magenta drifting sparks */
  var canvas = document.getElementById("particles");
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d"), dots = [], W, H, raf;
    var hero = canvas.parentElement;
    var hues = ["22,224,255", "255,43,214", "124,77,255"];
    function size() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      var n = Math.min(72, Math.round(W / 22));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 2.1 + 0.5,
          vy: -(Math.random() * 0.32 + 0.08),
          vx: (Math.random() - 0.5) * 0.16,
          a: Math.random() * 0.5 + 0.18,
          c: hues[i % hues.length]
        });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy; d.x += d.vx;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        if (d.x < -10) d.x = W + 10; else if (d.x > W + 10) d.x = -10;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + d.c + "," + d.a + ")";
        ctx.shadowBlur = 8; ctx.shadowColor = "rgba(" + d.c + ",0.8)";
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
})();

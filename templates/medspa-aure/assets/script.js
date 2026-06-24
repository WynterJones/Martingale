(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
  }

  /* ---------- year ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    /* safety: reveal anything already within the viewport on first paint */
    requestAnimationFrame(function () {
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add("in");
      });
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- nav scrolled state ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 36); }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById("drawer");
  var toggle = document.getElementById("navToggle");
  var dClose = document.getElementById("drawerClose");
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) toggle.addEventListener("click", function () { setDrawer(true); });
  if (dClose) dClose.addEventListener("click", function () { setDrawer(false); });
  if (drawer) drawer.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setDrawer(false); });
  });

  /* ---------- smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (href === "#" || href.length < 2) return;
      var t = document.querySelector(href);
      if (!t) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(t, { offset: -70 });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------- parallax orbs ---------- */
  var orbs = Array.prototype.slice.call(document.querySelectorAll(".orb"));
  if (orbs.length && !reduce) {
    var ticking = false;
    function moveOrbs() {
      var vh = window.innerHeight;
      orbs.forEach(function (el, i) {
        var r = el.getBoundingClientRect();
        var speed = (i % 2 === 0) ? 0.08 : -0.06;
        var off = (r.top + r.height / 2 - vh / 2) * speed;
        el.style.transform = "translate3d(0," + off.toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(moveOrbs); ticking = true; }
    }, { passive: true });
    moveOrbs();
  }

  /* ---------- count-up ---------- */
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

  /* ---------- before / after slider ---------- */
  var ba = document.getElementById("ba");
  var baBefore = document.getElementById("baBefore");
  var baHandle = document.getElementById("baHandle");
  if (ba && baBefore && baHandle) {
    var dragging = false;
    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      baBefore.style.clipPath = "inset(0 " + (100 - pct) + "% 0 0)";
      baHandle.style.left = pct + "%";
      baHandle.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
    function fromEvent(clientX) {
      var r = ba.getBoundingClientRect();
      setPos(((clientX - r.left) / r.width) * 100);
    }
    function start(e) {
      dragging = true; ba.classList.add("dragging");
      fromEvent(e.touches ? e.touches[0].clientX : e.clientX);
      e.preventDefault();
    }
    function move(e) {
      if (!dragging) return;
      fromEvent(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function end() { dragging = false; ba.classList.remove("dragging"); }

    baHandle.addEventListener("mousedown", start);
    ba.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move, { passive: false });
    window.addEventListener("mouseup", end);
    baHandle.addEventListener("touchstart", start, { passive: false });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);

    baHandle.addEventListener("keydown", function (e) {
      var now = parseInt(baHandle.getAttribute("aria-valuenow"), 10) || 50;
      if (e.key === "ArrowLeft") { setPos(now - 4); e.preventDefault(); }
      else if (e.key === "ArrowRight") { setPos(now + 4); e.preventDefault(); }
      else if (e.key === "Home") { setPos(0); e.preventDefault(); }
      else if (e.key === "End") { setPos(100); e.preventDefault(); }
    });
    setPos(50);
  }

  /* ---------- host video modal ---------- */
  var modal = document.getElementById("hostModal");
  var player = document.getElementById("hostPlayer");
  var openers = [
    document.getElementById("hostWidget"),
    document.getElementById("hostFab"),
    document.getElementById("hostPlay")
  ].filter(Boolean);
  var widget = document.getElementById("hostWidget");
  if (modal && player) {
    var mClose = document.getElementById("hostClose");
    function openModal() {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (widget) widget.style.display = "none";
      player.src = player.dataset.src + "&autoplay=1";
    }
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (widget) widget.style.display = "";
      player.src = "";
    }
    openers.forEach(function (b) { b.addEventListener("click", openModal); });
    if (mClose) mClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
  }

  /* ---------- esc closes drawer ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("open")) setDrawer(false);
  });

  /* ---------- booking form (demo) ---------- */
  var form = document.getElementById("bookForm");
  var submit = document.getElementById("bookSubmit");
  var ok = document.getElementById("formOk");
  function fakeSubmit(e) {
    if (e) e.preventDefault();
    var name = document.getElementById("bf-name");
    var email = document.getElementById("bf-email");
    if (!name.value.trim() || !email.value.trim()) {
      (name.value.trim() ? email : name).focus();
      return;
    }
    if (ok) { ok.hidden = false; }
    if (form) form.querySelectorAll("input").forEach(function (i) { i.value = ""; });
  }
  if (form) form.addEventListener("submit", fakeSubmit);
  if (submit) submit.addEventListener("click", fakeSubmit);
})();

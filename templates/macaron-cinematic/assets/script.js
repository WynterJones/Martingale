(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* nav scrolled state */
  var nav = document.getElementById("nav");
  function onScrollNav() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* mobile drawer */
  var drawer = document.getElementById("drawer");
  var toggle = document.getElementById("navToggle");
  var close = document.getElementById("drawerClose");
  function setDrawer(open) {
    drawer.classList.toggle("open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  toggle.addEventListener("click", function () { setDrawer(true); });
  close.addEventListener("click", function () { setDrawer(false); });
  drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var t = document.querySelector(link.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ block: "start" });
    });
  });

  /* parallax background layers */
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

  /* count-up stats */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 900, 1);
          el.textContent = Math.round(end * (0.5 - Math.cos(p * Math.PI) / 2));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* Bob video modal */
  var fab = document.getElementById("bobFab");
  var modal = document.getElementById("bobModal");
  var player = document.getElementById("bobPlayer");
  if (fab && modal && player) {
    var modalClose = document.getElementById("bobClose");
    function openModal() {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      fab.style.display = "none";
      try { player.currentTime = 0; player.play(); } catch (e) {}
    }
    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      fab.style.display = "";
      player.pause();
    }
    fab.addEventListener("click", openModal);
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
    modal.querySelectorAll("[data-close-modal]").forEach(function (el) { el.addEventListener("click", closeModal); });
  }

  /* hero particle field */
  var canvas = document.getElementById("particles");
  if (canvas && canvas.getContext && !reduce) {
    var ctx = canvas.getContext("2d"), dots = [], W, H, raf;
    var hero = canvas.parentElement;
    function size() {
      W = canvas.width = hero.offsetWidth;
      H = canvas.height = hero.offsetHeight;
      var n = Math.min(70, Math.round(W / 22));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 2.2 + 0.6,
          vy: -(Math.random() * 0.35 + 0.1),
          vx: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.5 + 0.2
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
        ctx.fillStyle = "rgba(226,119,155," + d.a + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    var visible = true;
    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      if (visible) draw(); else cancelAnimationFrame(raf);
    });
    size(); draw();
    window.addEventListener("resize", size);
  }
})();

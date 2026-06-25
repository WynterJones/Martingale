(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ====== CONFIG — set your enrollment / checkout URL here ==============
     Point every "Enroll" button at your course checkout. Use whatever you
     sell through — Teachable, Podia, Thinkific, Kajabi, Gumroad, or a Stripe
     Payment Link. Every [data-buy] link on the page is wired to this one URL.
     Example: "https://codeforge.thrivecart.com/codeforge-course/"          */
  var BUY_URL = "https://example.com/enroll";
  /* ===================================================================== */

  document.querySelectorAll("[data-buy]").forEach(function (a) {
    a.setAttribute("href", BUY_URL);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
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

  /* anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id === "#" || id === "#top") return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ block: "start" });
    });
  });

  /* parallax layers */
  var layers = Array.prototype.slice.call(document.querySelectorAll(".parallax"));
  if (layers.length && !reduce) {
    var ticking = false;
    function updateP() {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute("data-speed")) || 0.12;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateP); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", updateP);
    updateP();
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

  /* ====== SLOT REEL — each reel idly re-spins on its own random 2-4s timer,
     but only while the machine is on screen (saves work when scrolled away). */
  var reels = Array.prototype.slice.call(document.querySelectorAll("#reels .reel"));
  var machine = document.querySelector(".machine");
  if (reels.length && machine && !reduce) {
    var timers = [], inView = false;

    function spinReel(r) {
      r.classList.remove("spinning");
      void r.offsetWidth;              // restart the animation
      r.classList.add("spinning");
      setTimeout(function () { r.classList.remove("spinning"); }, 850);
    }
    function schedule(r) {
      var delay = 2000 + Math.random() * 2000;   // random 2-4s per reel
      return setTimeout(function () {
        if (inView) spinReel(r);
        timers.push(schedule(r));                 // queue the next idle spin
      }, delay);
    }
    function start() {
      if (timers.length) return;
      reels.forEach(function (r, i) {
        spinReel(r);                              // one settling spin on entry (staggered)
        r.style.animationDelay = "";
      });
      reels.forEach(function (r) { timers.push(schedule(r)); });
    }
    function stop() { timers.forEach(clearTimeout); timers = []; }

    if ("IntersectionObserver" in window) {
      var mio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          inView = e.isIntersecting;
          if (inView) start(); else stop();
        });
      }, { threshold: 0.25 });
      mio.observe(machine);
    } else { inView = true; start(); }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (inView) start();
    });
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

  /* ====== particle field helper ====== */
  function particleField(canvas, colors, density) {
    if (!canvas || !canvas.getContext || reduce) return;
    var ctx = canvas.getContext("2d"), dots = [], W, H, raf, host = canvas.parentElement;
    function size() {
      W = canvas.width = host.offsetWidth;
      H = canvas.height = host.offsetHeight;
      var n = Math.min(80, Math.round(W / density));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.4 + 0.5,
        vy: -(Math.random() * 0.4 + 0.12),
        vx: (Math.random() - 0.5) * 0.22,
        a: Math.random() * 0.6 + 0.2,
        c: colors[(Math.random() * colors.length) | 0]
      });
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.y += d.vy; d.x += d.vx;
        if (d.y < -12) { d.y = H + 12; d.x = Math.random() * W; }
        if (d.x < -12) d.x = W + 12; else if (d.x > W + 12) d.x = -12;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + d.c + "," + d.a + ")";
        ctx.shadowBlur = 8; ctx.shadowColor = "rgba(" + d.c + ",.8)";
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
  particleField(document.getElementById("particles"), ["255,150,60", "244,192,68", "255,106,43"], 22);
  particleField(document.getElementById("emberField"), ["255,106,43", "244,192,68", "216,52,23"], 28);
})();

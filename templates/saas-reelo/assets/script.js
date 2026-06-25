(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* reveal on scroll */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (e) {
      e.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { threshold: 0.14 });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add("in"); }); }

  /* nav scrolled */
  var nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* drawer */
  var drawer = document.getElementById("drawer"), toggle = document.getElementById("navToggle"), dclose = document.getElementById("drawerClose");
  function setDrawer(o) { drawer.classList.toggle("open", o); drawer.setAttribute("aria-hidden", String(!o)); toggle.setAttribute("aria-expanded", String(o)); document.body.style.overflow = o ? "hidden" : ""; }
  toggle.addEventListener("click", function () { setDrawer(true); });
  dclose.addEventListener("click", function () { setDrawer(false); });
  drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });

  /* anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (l) {
    l.addEventListener("click", function (e) { var t = document.querySelector(l.getAttribute("href")); if (!t) return; e.preventDefault(); window.scrollTo(0, t.getBoundingClientRect().top + window.pageYOffset - 8); });
  });

  /* parallax */
  var layers = [].slice.call(document.querySelectorAll(".parallax"));
  if (layers.length && !reduce) {
    var ticking = false;
    function upd() {
      var vh = window.innerHeight;
      layers.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        var sp = parseFloat(el.getAttribute("data-speed")) || 0.12;
        el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * -sp).toFixed(1) + "px,0)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
    window.addEventListener("resize", upd); upd();
  }

  /* 3D tilt on bento/phone tiles */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (ev) {
        var r = el.getBoundingClientRect();
        var px = (ev.clientX - r.left) / r.width - 0.5;
        var py = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = "perspective(800px) rotateY(" + (px * 7).toFixed(2) + "deg) rotateX(" + (-py * 7).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* count-up */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (e) {
      e.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, end = parseFloat(el.getAttribute("data-count")), t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 900, 1); el.textContent = (end * (0.5 - Math.cos(p * Math.PI) / 2)).toFixed(0); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step); cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* lazy play videos (perf) */
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (e) {
      e.forEach(function (x) { var v = x.target; if (x.isIntersecting) { if (v.paused) v.play().catch(function () {}); } else { v.pause(); } });
    }, { threshold: 0.25 });
    document.querySelectorAll("video").forEach(function (v) { vio.observe(v); });
  }

  /* YouTube demo modal */
  var modal = document.getElementById("ytModal"), frame = document.getElementById("ytFrame"), yclose = document.getElementById("ytClose");
  function openYt() { frame.src = frame.dataset.src + "&autoplay=1"; modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function closeYt() { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; frame.src = ""; }
  document.querySelectorAll("[data-yt]").forEach(function (b) { b.addEventListener("click", openYt); });
  yclose.addEventListener("click", closeYt);
  modal.addEventListener("click", function (e) { if (e.target === modal) closeYt(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeYt(); setDrawer(false); } });
})();

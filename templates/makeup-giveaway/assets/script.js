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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });

  /* anchors */
  document.querySelectorAll('a[href^="#"]').forEach(function (l) {
    l.addEventListener("click", function (e) { var t = document.querySelector(l.getAttribute("href")); if (!t) return; e.preventDefault(); t.scrollIntoView({ block: "start" }); });
  });

  /* parallax */
  var layers = [].slice.call(document.querySelectorAll(".parallax"));
  if (layers.length && !reduce) {
    var ticking = false;
    function upd() { var vh = window.innerHeight; layers.forEach(function (el) { var r = el.parentElement.getBoundingClientRect(); var sp = parseFloat(el.getAttribute("data-speed")) || 0.14; el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * -sp).toFixed(1) + "px,0)"; }); ticking = false; }
    window.addEventListener("scroll", function () { if (!ticking) { requestAnimationFrame(upd); ticking = true; } }, { passive: true });
    window.addEventListener("resize", upd); upd();
  }

  /* tilt */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (ev) { var r = el.getBoundingClientRect(); var px = (ev.clientX - r.left) / r.width - 0.5, py = (ev.clientY - r.top) / r.height - 0.5; el.style.transform = "perspective(900px) rotateY(" + (px * 5).toFixed(2) + "deg) rotateX(" + (-py * 5).toFixed(2) + "deg)"; });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* count-up */
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (e) {
      e.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, end = parseInt(el.getAttribute("data-count"), 10), t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1100, 1); var v = Math.round(end * (0.5 - Math.cos(p * Math.PI) / 2)); el.textContent = v.toLocaleString(); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step); cio.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(function (el) { el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString(); }); }

  /* countdown to the coming Sunday */
  var cd = document.getElementById("cd");
  if (cd) {
    var target = new Date(); var day = target.getDay(); var add = (7 - day) % 7 || 7;
    target.setDate(target.getDate() + add); target.setHours(20, 0, 0, 0);
    function tick() {
      var ms = target - new Date();
      if (ms <= 0) { cd.textContent = "Final hours"; return; }
      var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
      cd.textContent = d + "d " + h + "h " + m + "m";
    }
    tick(); setInterval(tick, 60000);
  }

  /* demo entry form */
  var form = document.getElementById("enterForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.querySelector(".form-note").hidden = true;
      form.querySelector('button[type="submit"]').hidden = true;
      document.getElementById("formDone").hidden = false;
    });
  }
})();

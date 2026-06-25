/* ============================================================
   AI Profit Blueprint — squeeze page interactions
   Vanilla JS. 60fps (transform/opacity only). Honors reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  var yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- sticky nav shadow ---------- */
  var nav = $('#nav');
  var onScroll = function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  var drawer = $('#drawer');
  var toggle = $('#navToggle');
  var dClose = $('#drawerClose');
  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (dClose) dClose.addEventListener('click', closeDrawer);
  if (drawer) $$('.drawer-links a').forEach(function (a) { a.addEventListener('click', closeDrawer); });

  /* ---------- jump to #optin for CTAs ---------- */
  $$('[data-scroll]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var href = el.getAttribute('href');
      if (href && href.charAt(0) === '#') {
        var target = $(href);
        if (target) {
          e.preventDefault();
          closeDrawer();
          target.scrollIntoView({ block: 'start' });
          var input = target.querySelector('input[type="email"]');
          if (input) setTimeout(function () { input.focus({ preventScroll: true }); }, reduce ? 0 : 520);
        }
      }
    });
  });

  /* ---------- scroll reveal ---------- */
  var reveals = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (r) { r.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  }

  /* ---------- count-up stats ---------- */
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    if (reduce) {
      el.textContent = formatNum(target, decimals) + suffix;
      return;
    }
    var dur = 1400, start = null, done = false;
    function finish() {
      if (done) return;
      done = true;
      el.textContent = formatNum(target, decimals) + suffix;
    }
    function step(ts) {
      if (done) return;
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = target * easeOut(p);
      el.textContent = formatNum(val, decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else finish();
    }
    requestAnimationFrame(step);
    /* Fallback: rAF is paused in background/hidden tabs, which would strand the
       counter at a partial value. setTimeout still fires (throttled) when hidden,
       so guarantee the final number lands regardless. */
    setTimeout(finish, dur + 120);
  }
  function formatNum(v, decimals) {
    if (decimals > 0) return v.toFixed(decimals);
    return Math.round(v).toLocaleString('en-US');
  }
  var counts = $$('.count');
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counts.forEach(function (c) { cio.observe(c); });
  } else {
    counts.forEach(runCount);
  }

  /* ---------- FAQ accordion ---------- */
  $$('.acc-item').forEach(function (item) {
    var q = $('.acc-q', item);
    var a = $('.acc-a', item);
    q.addEventListener('click', function () {
      var open = item.classList.contains('open');
      $$('.acc-item').forEach(function (other) {
        other.classList.remove('open');
        $('.acc-q', other).setAttribute('aria-expanded', 'false');
        $('.acc-a', other).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- video modal ---------- */
  var modal = $('#videoModal');
  var frame = $('#ytFrame');
  var lastFocus = null;
  function openModal(trigger) {
    lastFocus = trigger || document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    if (frame) frame.src = frame.dataset.src + '&autoplay=1';
    document.body.style.overflow = 'hidden';
    var c = $('.modal-close', modal);
    if (c) c.focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    if (frame) frame.src = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-video]').forEach(function (t) {
    t.addEventListener('click', function () { openModal(t); });
  });
  $$('[data-close]', modal).forEach(function (c) {
    c.addEventListener('click', function (e) {
      // allow data-scroll CTAs inside modal to still scroll
      if (!c.hasAttribute('data-scroll')) e.preventDefault();
      closeModal();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal.classList.contains('open')) closeModal();
      if (drawer.classList.contains('open')) closeDrawer();
    }
  });

  /* ---------- opt-in form handler ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function wireForm(form) {
    var msg = $('.optin-msg', form);
    var input = form.querySelector('input[type="email"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!msg || !input) return;
      var val = (input.value || '').trim();
      msg.className = 'optin-msg show';
      if (!EMAIL.test(val)) {
        msg.classList.add('err');
        msg.textContent = 'Please enter a valid email so we can send your first lesson.';
        input.focus();
        return;
      }
      msg.classList.add('ok');
      msg.textContent = 'Check your inbox — your first lesson is on the way.';
      input.value = '';
      input.setAttribute('disabled', 'true');
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.style.opacity = '.7';
    });
  }
  var hero = $('#optinForm');
  if (hero) wireForm(hero);
  $$('[data-optin]').forEach(wireForm);

  /* ---------- ambient particle field ---------- */
  function initParticles(canvas) {
    if (!canvas || reduce) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, parts = [];
    var COUNT = 46;
    function size() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      parts = [];
      for (var i = 0; i < COUNT; i++) {
        parts.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.8 + 0.6,
          vx: (Math.random() - 0.5) * 0.16,
          vy: -(Math.random() * 0.28 + 0.06),
          a: Math.random() * 0.5 + 0.15,
          hue: Math.random() > 0.5 ? '59,130,246' : '34,211,238'
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.hue + ',' + p.a + ')';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    var raf;
    size(); seed(); tick();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { size(); seed(); }, 200);
    }, { passive: true });
  }
  initParticles($('#particles'));
  initParticles($('#particles2'));
})();

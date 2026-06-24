/* ============================================================
   SURGE — interactions
   Vanilla JS. 60fps (transform/opacity). Honors reduced-motion.
   ============================================================ */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav condense ---------- */
  var nav = document.getElementById('nav');
  function onScroll(){ if (nav) nav.classList.toggle('scrolled', window.scrollY > 30); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------- mobile drawer ---------- */
  var drawer = document.getElementById('drawer');
  var toggle = document.getElementById('navToggle');
  var dClose = document.getElementById('drawerClose');
  function openDrawer(){ if(!drawer) return; drawer.classList.add('open'); if(toggle) toggle.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; }
  function closeDrawer(){ if(!drawer) return; drawer.classList.remove('open'); if(toggle) toggle.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  if (toggle) toggle.addEventListener('click', openDrawer);
  if (dClose) dClose.addEventListener('click', closeDrawer);
  document.querySelectorAll('[data-close-drawer]').forEach(function(el){ el.addEventListener('click', closeDrawer); });

  /* ---------- video modal ---------- */
  var modal = document.getElementById('videoModal');
  var iframe = document.getElementById('modalIframe');
  var mClose = document.getElementById('modalClose');
  var lastFocus = null;
  function openModal(){
    if(!modal) return;
    lastFocus = document.activeElement;
    if (iframe && iframe.dataset.src) iframe.src = iframe.dataset.src + '&autoplay=1';
    modal.classList.add('open'); document.body.style.overflow='hidden';
    if (mClose) mClose.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open'); document.body.style.overflow='';
    if (iframe) iframe.src = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-open-modal]').forEach(function(el){ el.addEventListener('click', openModal); });
  document.querySelectorAll('[data-close-modal]').forEach(function(el){ el.addEventListener('click', closeModal); });
  if (mClose) mClose.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape'){ closeModal(); closeDrawer(); }
  });

  /* ---------- countdown (fixed demo target ~10 days out) ---------- */
  // Demo cohort start. Pinned to a fixed near-future date; degrades after it passes.
  var TARGET = new Date('2026-07-04T09:00:00').getTime();
  var cdGroups = document.querySelectorAll('#cdHero, #cdUrgency');
  function pad(n){ return (n<10?'0':'') + n; }
  function tick(){
    var now = Date.now();
    var diff = TARGET - now;
    var expired = diff <= 0;
    var d,h,m,s;
    if (expired){ d=h=m=s=0; } else {
      d = Math.floor(diff/86400000);
      h = Math.floor((diff%86400000)/3600000);
      m = Math.floor((diff%3600000)/60000);
      s = Math.floor((diff%60000)/1000);
    }
    cdGroups.forEach(function(g){
      var setv = function(k,v){ var el=g.querySelector('[data-cd="'+k+'"]'); if(el) el.textContent = pad(v); };
      setv('days',d); setv('hours',h); setv('mins',m); setv('secs',s);
    });
    if (expired){
      cdGroups.forEach(function(g){
        if (!g.dataset.expiredShown){
          g.dataset.expiredShown = '1';
          var card = g.closest('.countdown');
          var foot = card && card.querySelector('.cd-foot');
          if (foot) foot.innerHTML = '<strong>New cohort starting soon</strong> — join the waitlist below.';
        }
      });
    }
  }
  if (cdGroups.length){ tick(); setInterval(tick, 1000); }

  /* ---------- count-ups ---------- */
  function formatCount(n){
    if (n >= 1000000) return (n/1000000).toFixed(n%1000000===0?0:1).replace(/\.0$/,'') + 'M';
    if (n >= 10000)   return Math.round(n/1000) + 'k';
    return n.toLocaleString('en-US');
  }
  function countUp(el){
    var target = parseInt(el.getAttribute('data-count'),10) || 0;
    if (reduce){ el.textContent = formatCount(target); return; }
    var dur = 1600, start = null;
    function step(ts){
      if (!start) start = ts;
      var p = Math.min((ts-start)/dur, 1);
      var eased = 1 - Math.pow(1-p, 3);
      el.textContent = formatCount(Math.round(target*eased));
      if (p < 1) requestAnimationFrame(step); else el.textContent = formatCount(target);
    }
    requestAnimationFrame(step);
  }

  /* ---------- reveal + count-up via IntersectionObserver ---------- */
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){
          en.target.classList.add('in');
          en.target.querySelectorAll && en.target.querySelectorAll('[data-count]').forEach(countUp);
          io.unobserve(en.target);
        }
      });
    }, {threshold:0.18, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
    // stat-num count-ups that aren't inside a .reveal wrapper get observed directly
    document.querySelectorAll('.stat:not(.reveal)').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('[data-count]').forEach(countUp);
  }

  /* ---------- timeline scroll-scrub progress + node lighting ---------- */
  var tlWrap = document.getElementById('tlWrap');
  var tlFill = document.getElementById('tlFill');
  var tlItems = tlWrap ? Array.prototype.slice.call(tlWrap.querySelectorAll('.tl-item')) : [];
  function tlUpdate(){
    if (!tlWrap || !tlFill) return;
    var rect = tlWrap.getBoundingClientRect();
    var vh = window.innerHeight;
    // progress: 0 when top of wrap reaches mid-viewport, 1 when bottom reaches mid-viewport
    var total = rect.height;
    var passed = (vh*0.55) - rect.top;
    var p = Math.max(0, Math.min(1, passed / total));
    tlFill.style.height = (p*100) + '%';
    var midY = vh*0.55;
    tlItems.forEach(function(it){
      var r = it.getBoundingClientRect();
      var nodeY = r.top + r.height/2;
      it.classList.toggle('lit', nodeY <= midY);
    });
  }
  if (tlWrap){
    if (reduce){ tlFill.style.height='100%'; tlItems.forEach(function(it){ it.classList.add('lit'); }); }
    else { tlUpdate(); window.addEventListener('scroll', tlUpdate, {passive:true}); window.addEventListener('resize', tlUpdate); }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function(){
      var open = item.classList.contains('open');
      // close siblings
      document.querySelectorAll('.faq-item.open').forEach(function(o){
        if (o !== item){ o.classList.remove('open'); var oa=o.querySelector('.faq-a'); var oq=o.querySelector('.faq-q'); if(oa) oa.style.maxHeight=null; if(oq) oq.setAttribute('aria-expanded','false'); }
      });
      if (open){ item.classList.remove('open'); a.style.maxHeight=null; q.setAttribute('aria-expanded','false'); }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded','true'); }
    });
  });

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  var mq = document.getElementById('marquee');
  if (mq && !reduce){ mq.innerHTML += mq.innerHTML; }

  /* ---------- spots count (cosmetic, ticks down slowly) ---------- */
  var spotEls = [document.getElementById('spotsHero'), document.getElementById('spotsUrgency'), document.getElementById('spotsFinal')].filter(Boolean);
  var spots = 37;
  function setSpots(){ spotEls.forEach(function(e){ e.textContent = spots; }); }
  setSpots();
  if (!reduce){
    setInterval(function(){
      if (spots > 12 && Math.random() < 0.5){ spots--; setSpots(); }
    }, 14000);
  }

  /* ---------- hero spark/ember canvas ---------- */
  var canvas = document.getElementById('sparks');
  if (canvas && !reduce){
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, parts;
    function size(){
      var host = canvas.parentElement;
      W = host.clientWidth; H = host.clientHeight;
      canvas.width = W*dpr; canvas.height = H*dpr;
      canvas.style.width = W+'px'; canvas.style.height = H+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    function makeParts(){
      var count = Math.max(28, Math.min(64, Math.round(W/22)));
      parts = [];
      for (var i=0;i<count;i++){
        parts.push({
          x: Math.random()*W,
          y: Math.random()*H,
          r: Math.random()*1.8 + 0.5,
          vy: -(Math.random()*0.35 + 0.08),
          vx: (Math.random()-0.5)*0.25,
          a: Math.random()*0.5 + 0.15,
          tw: Math.random()*Math.PI*2
        });
      }
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      for (var i=0;i<parts.length;i++){
        var p = parts[i];
        p.y += p.vy; p.x += p.vx; p.tw += 0.04;
        if (p.y < -6){ p.y = H+6; p.x = Math.random()*W; }
        if (p.x < -6) p.x = W+6; if (p.x > W+6) p.x = -6;
        var flick = 0.6 + 0.4*Math.sin(p.tw);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(200,241,53,' + (p.a*flick).toFixed(3) + ')';
        ctx.shadowColor = 'rgba(200,241,53,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }
    var raf;
    size(); makeParts(); draw();
    window.addEventListener('resize', function(){ size(); makeParts(); });
    // pause when hero off-screen for perf
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          if (e.isIntersecting){ if(!raf) draw(); }
          else { if(raf){ cancelAnimationFrame(raf); raf=null; } }
        });
      }, {threshold:0}).observe(canvas.parentElement);
    }
  }

  /* ---------- recompute open FAQ height on resize ---------- */
  window.addEventListener('resize', function(){
    var open = document.querySelector('.faq-item.open .faq-a');
    if (open) open.style.maxHeight = open.scrollHeight + 'px';
  });

})();

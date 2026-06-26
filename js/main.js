/* ========================================================
   PORTFOLIO MAIN CONTROL MODULE
   ======================================================== */
(function(){
  "use strict";

  // Force browser to always load the page at the top instead of scroll-restoring
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(pointer: fine)').matches;

  /* ---------- PRELOADER ---------- */
  var preloader = document.getElementById('preloader');
  var countEl = document.getElementById('preloaderCount');
  var barEl = document.getElementById('preloaderBar');
  var hero = document.getElementById('hero');

  function finishPreload(){
    preloader.classList.add('is-done');
    hero.classList.add('started');
    document.body.style.overflow = '';
    
    // Initialize components on load completion
    initCachedPositions();
    if (window.Timeline) window.Timeline.init();
    setTimeout(function(){ preloader.style.display = 'none'; }, 850);
  }

  if (reduced) {
    preloader.style.display = 'none';
    hero.classList.add('started');
    // Direct initialization
    setTimeout(function() {
      initCachedPositions();
      if (window.Timeline) window.Timeline.init();
    }, 50);
  } else {
    document.body.style.overflow = 'hidden';
    var p = 0;
    var iv = setInterval(function(){
      p += Math.random() * 14 + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(finishPreload, 280); }
      countEl.textContent = Math.floor(p) + '%';
      barEl.style.setProperty('--p', p + '%');
    }, 110);
  }

  /* ---------- SPLIT HERO CHARACTERS ---------- */
  document.querySelectorAll('[data-word]').forEach(function(wordEl, wi){
    var text = wordEl.textContent;
    wordEl.textContent = '';
    var globalIndex = wi * 100;
    text.split('').forEach(function(ch, i){
      var span = document.createElement('span');
      span.className = 'char';
      span.style.setProperty('--i', globalIndex + i);
      span.textContent = ch;
      wordEl.appendChild(span);
    });
  });

  /* ---------- CUSTOM CURSOR ---------- */
  if (fine && !reduced) {
    document.body.classList.add('has-cursor');
    var dot = document.querySelector('.cursor-dot');
    var ring = document.querySelector('.cursor-ring');
    var mx=0,my=0, rx=0, ry=0;
    window.addEventListener('mousemove', function(e){
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    function ringLoop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();
    document.querySelectorAll('a, button, .magnetic, .work-card').forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('is-active'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('is-active'); });
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  if (fine && !reduced) {
    document.querySelectorAll('.magnetic').forEach(function(el){
      el.addEventListener('mousemove', function(e){
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width/2;
        var y = e.clientY - r.top - r.height/2;
        el.style.transform = 'translate(' + (x*0.28) + 'px,' + (y*0.32) + 'px)';
      });
      el.addEventListener('mouseleave', function(){ el.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------- WORK CARD TILT ---------- */
  if (fine && !reduced) {
    document.querySelectorAll('.work-card').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-py*6) + 'deg) rotateY(' + (px*8) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  }

  /* ---------- NAV SCROLL STATE ---------- */
  var nav = document.getElementById('nav');
  var sections = ['about','stack','work','contact'];
  var navLinks = {};
  document.querySelectorAll('.nav-link').forEach(function(l){ navLinks[l.dataset.nav] = l; });

  if ('IntersectionObserver' in window) {
    var spyObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var id = entry.target.id;
        if (entry.isIntersecting) {
          Object.keys(navLinks).forEach(function(k){ navLinks[k].classList.toggle('active', k===id); });
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    sections.forEach(function(id){
      var el = document.getElementById(id);
      if (el) spyObserver.observe(el);
    });
  }

  /* ---------- SCROLL REVEALS (Intersection Observer) ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    var scrollObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });
    document.querySelectorAll('[data-scroll]').forEach(function(el){
      scrollObserver.observe(el);
    });

    var specSheet = document.getElementById('specSheet');
    if (specSheet) {
      var specObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.2 });
      specObserver.observe(specSheet);
    }

    var eqObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var bar = entry.target.querySelector('.eq-bar');
          if (bar) bar.style.setProperty('--h', entry.target.dataset.h + 'px');
          entry.target.classList.add('in-view');
        } else {
          var bar = entry.target.querySelector('.eq-bar');
          if (bar) bar.style.setProperty('--h', '6px');
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.eq-item').forEach(function(el){ eqObserver.observe(el); });

  } else {
    document.querySelectorAll('[data-scroll]').forEach(function(el){ el.classList.add('is-visible'); });
    document.querySelectorAll('.eq-item').forEach(function(el){
      el.classList.add('in-view');
      var bar = el.querySelector('.eq-bar');
      if (bar) bar.style.setProperty('--h', el.dataset.h + 'px');
    });
    var ss = document.getElementById('specSheet');
    if (ss) ss.classList.add('is-visible');
  }

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(function(el){ revealObserver.observe(el); });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- PERFORMANCE OPTIMIZATION: CACHING LAYOUT OFFSETS ---------- */
  var parallaxItems = [];
  var csContainer = document.getElementById('containerScroll');
  var csHeader = document.getElementById('containerScrollHeader');
  var csCard = document.getElementById('containerScrollCard');
  var csMobile = window.innerWidth <= 768;
  var csContainerTop = 0;
  var csContainerHeight = 0;
  var cachedInnerHeight = 0;
  var cachedDocHeight = 0;

  function initCachedPositions() {
    cachedInnerHeight = window.innerHeight;
    cachedDocHeight = document.documentElement.scrollHeight - cachedInnerHeight;

    // 1. Cache Parallax Elements absolute offsets
    parallaxItems = [];
    document.querySelectorAll('[data-parallax]').forEach(function(el) {
      var speed = parseFloat(el.dataset.parallax) || 0.15;
      var rect = el.getBoundingClientRect();
      parallaxItems.push({
        element: el,
        speed: speed,
        absoluteTop: rect.top + window.scrollY
      });
    });

    // 2. Cache 3D Container Scroll absolute offsets
    if (csContainer) {
      var rect = csContainer.getBoundingClientRect();
      csContainerTop = rect.top + window.scrollY;
      csContainerHeight = rect.height;
    }

    // 3. Cache Timeline section absolute tops
    if (window.Timeline) {
      window.Timeline.recalculate();
    }
  }

  /* ---------- PARALLAX EFFECT ---------- */
  function updateParallax() {
    if (reduced) return;
    var scrollTop = window.scrollY;
    parallaxItems.forEach(function(item) {
      var offset = (item.absoluteTop - scrollTop - cachedInnerHeight * 0.5) * item.speed;
      item.element.style.transform = 'translateY(' + (-offset) + 'px)';
    });
  }

  /* ---------- 3D CONTAINER SCROLL ---------- */
  function updateContainerScroll() {
    if (!csContainer || !csCard || !csHeader || reduced) return;

    if (csMobile) {
      csCard.style.transform = '';
      csHeader.style.transform = '';
      return;
    }

    var scrollTop = window.scrollY;
    var containerTop = csContainerTop - scrollTop;

    var progress = 0;
    var scrollRange = csContainerHeight - cachedInnerHeight;
    if (scrollRange > 0) {
      progress = -containerTop / scrollRange;
      progress = Math.max(0, Math.min(1, progress));
    }

    var rotateX = 20 - (progress * 20);
    var scaleFrom = csMobile ? 0.7 : 1.05;
    var scaleTo = csMobile ? 0.9 : 1;
    var scale = scaleFrom + (progress * (scaleTo - scaleFrom));
    var translateY = progress * -100;

    csCard.style.transform = 'rotateX(' + rotateX + 'deg) scale(' + scale + ')';
    csHeader.style.transform = 'translateY(' + translateY + 'px)';
  }

  /* ---------- MASTER SCROLL HANDLER ---------- */
  var scrollScheduled = false;
  function onScroll(){
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(function(){
      nav.classList.toggle('scrolled', window.scrollY > 30);

      if (window.Timeline) window.Timeline.update();
      updateParallax();
      updateContainerScroll();
      
      scrollScheduled = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', function() {
    csMobile = window.innerWidth <= 768;
    initCachedPositions();
  });

  /* ---------- SMOOTH NAV SCROLL OFFSET ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var id = link.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - (id === 'hero' ? 0 : 70);
      window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });
})();

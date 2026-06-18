/* ============================================================================
   The Guri Woodcraft — shared site behaviour (loaded on every page)
   Handles: theme (dark/light), language switch, mobile menu, scroll reveals.
   No third-party code. No tracking. Comments explain WHY.
   ============================================================================ */
(function(){
  var root = document.documentElement;

  /* ---- THEME ----------------------------------------------------------------
     Order of precedence:
       1. a choice the visitor previously made (saved in localStorage)
       2. otherwise, the device's own setting (prefers-color-scheme)
     We set data-theme on <html>; site.css restyles everything from variables. */
  var saved = null;
  try { saved = localStorage.getItem('tgw-theme'); } catch(e){}   // private mode may block storage
  var prefersLight = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches;
  var theme = saved || (prefersLight ? 'light' : 'dark');
  root.setAttribute('data-theme', theme);

  function setTheme(t){
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('tgw-theme', t); } catch(e){}
    updateThemeButtons(t);
  }
  function updateThemeButtons(t){
    document.querySelectorAll('[data-theme-toggle]').forEach(function(btn){
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      var sun = btn.querySelector('.i-sun'), moon = btn.querySelector('.i-moon');
      if(sun && moon){ sun.style.display = t==='dark' ? 'block':'none'; moon.style.display = t==='dark' ? 'none':'block'; }
    });
  }
  document.addEventListener('click', function(e){
    var btn = e.target.closest('[data-theme-toggle]');
    if(!btn) return;
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  // if the visitor never chose, keep following their device if it changes live
  if(!saved && window.matchMedia){
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(ev){
      var s=null; try{s=localStorage.getItem('tgw-theme');}catch(e){}
      if(!s) root.setAttribute('data-theme', ev.matches ? 'light':'dark');
    });
  }
  updateThemeButtons(theme);

  /* ---- LANGUAGE -------------------------------------------------------------
     We set <html lang="en|hi|pa">; CSS shows only that language's [data-lang]
     elements. Choice is remembered. Default is English (or a saved choice). */
  var savedLang = null;
  try { savedLang = localStorage.getItem('tgw-lang'); } catch(e){}
  var lang = savedLang || (root.getAttribute('lang') || 'en');
  root.setAttribute('lang', lang);

  function setLang(l){
    root.setAttribute('lang', l);
    try { localStorage.setItem('tgw-lang', l); } catch(e){}
    document.querySelectorAll('[data-lang-btn]').forEach(function(b){
      b.setAttribute('aria-pressed', b.getAttribute('data-lang-btn') === l ? 'true':'false');
    });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest('[data-lang-btn]');
    if(!b) return;
    setLang(b.getAttribute('data-lang-btn'));
  });
  setLang(lang);

  /* ---- MOBILE MENU ---- */
  var burger = document.getElementById('burger'), mm = document.getElementById('mobileMenu');
  if(burger && mm){
    burger.addEventListener('click', function(){ var o = mm.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
    mm.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ mm.classList.remove('open'); burger.setAttribute('aria-expanded', false); }); });
  }

  /* ---- SCROLL REVEALS ---- */
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- FOOTER YEAR ---- */
  var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();
})();

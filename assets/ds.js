/* Parcele Aqui · Design System v2.0 · interações da documentação */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Tema */
  var themeBtn = $('#theme-btn');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function paintThemeBtn() {
    var dark = currentTheme() === 'dark';
    themeBtn.innerHTML = '<i class="ph ph-' + (dark ? 'sun' : 'moon') + '" aria-hidden="true"></i>';
    themeBtn.setAttribute('aria-label', dark ? 'Usar tema claro' : 'Usar tema escuro');
  }
  if (themeBtn) {
    paintThemeBtn();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('pa-theme', next); } catch (e) {}
      paintThemeBtn();
    });
  }

  /* Navegação lateral: drawer no mobile */
  var menuBtn = $('#menu-btn'), scrim = $('#scrim');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });
  $$('.sidebar .nav-link').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (document.body.classList.contains('nav-open')) { setNav(false); menuBtn && menuBtn.focus(); }
      $$('.pa-tip-wrap.open').forEach(function (w) { w.classList.remove('open'); });
    }
  });

  /* Seção ativa */
  var links = $$('.sidebar .nav-link');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          var a = map[en.target.id];
          if (a) { a.classList.add('active'); a.setAttribute('aria-current', 'true'); }
        }
      });
    }, { rootMargin: '-30% 0px -65% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Busca nas seções */
  var search = $('#search');
  if (search) search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    var any = false;
    $$('.sidebar .nav-group').forEach(function (g) {
      var vis = 0;
      $$('.nav-link', g).forEach(function (a) {
        var t = a.textContent.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        var ok = !q || t.indexOf(q) > -1;
        a.style.display = ok ? '' : 'none'; if (ok) vis++;
      });
      g.style.display = vis ? '' : 'none'; if (vis) any = true;
    });
    $('#nav-empty').style.display = any ? 'none' : 'block';
  });
  if (search) search.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var a = $$('.sidebar .nav-link').filter(function (x) { return x.style.display !== 'none'; })[0]; if (a) { location.hash = a.getAttribute('href'); search.blur(); } }
  });

  /* Toast */
  var region = $('#toasts');
  function toast(msg, icon, error) {
    if (!region) return;
    var t = document.createElement('div');
    t.className = 'pa-toast' + (error ? ' error' : '');
    t.innerHTML = '<i class="ph ph-' + (icon || 'check-circle') + '" aria-hidden="true"></i><span></span>';
    t.querySelector('span').textContent = msg;
    region.setAttribute('aria-live', error ? 'assertive' : 'polite');
    region.appendChild(t);
    var left = 4000, last = Date.now(), paused = false;
    t.addEventListener('mouseenter', function () { paused = true; });
    t.addEventListener('mouseleave', function () { paused = false; last = Date.now(); });
    var iv = setInterval(function () {
      var now = Date.now(); if (!paused) left -= now - last; last = now;
      if (left <= 0) { clearInterval(iv); t.remove(); }
    }, 100);
  }
  $$('[data-toast]').forEach(function (b) { b.addEventListener('click', function () { toast(b.dataset.toast, b.dataset.icon, b.dataset.error); }); });

  /* Copiar */
  function copy(text, label) {
    var done = function () { toast((label || 'Copiado') , 'check-circle'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { fallback(text); done(); });
    else { fallback(text); done(); }
  }
  function fallback(text) {
    var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); } catch (e) {} ta.remove();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy],[data-copy-text]');
    if (!b) return;
    if (b.hasAttribute('data-copy')) { var el = $(b.getAttribute('data-copy')); if (el) copy(el.textContent, 'Prompt copiado'); }
    else { var v = b.getAttribute('data-copy-text'); copy(v, v.length < 40 ? v + ' copiado' : 'Prompt copiado'); }
  });

  /* Filtro de ilustrações */
  $$('.lib-bar .filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.lib-bar .filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.f;
      $$('#illu-lib .gitem').forEach(function (it) { it.hidden = !(f === 'all' || it.dataset.g === f); });
    });
  });

  /* Formato das ilustrações */
  $$('.fmt button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.fmt button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var sq = b.dataset.fmt === 'sq', lib = $('#illu-lib');
      lib.classList.toggle('sq', sq);
      $$('img[data-f]', lib).forEach(function (i) {
        i.src = (sq ? 'assets/ilustracoes-quadrado/' : 'assets/ilustracoes/') + i.dataset.f + '.webp';
        i.width = sq ? 1200 : 1980; i.height = sq ? 1200 : 1020;
      });
      $$('code.fname', lib).forEach(function (c) { c.textContent = (sq ? 'ilustracoes-quadrado/' : 'ilustracoes/') + c.dataset.f + '.webp'; });
    });
  });

  /* Tooltip */
  $$('[data-tip]').forEach(function (w) {
    var btn = $('.pa-tip-trigger', w), timer;
    function open() { clearTimeout(timer); w.classList.add('open'); }
    function close() { clearTimeout(timer); w.classList.remove('open'); }
    w.addEventListener('mouseenter', function () { timer = setTimeout(open, 300); });
    w.addEventListener('mouseleave', close);
    btn.addEventListener('focus', open);
    btn.addEventListener('blur', close);
    btn.addEventListener('click', function (e) { e.preventDefault(); w.classList.contains('open') ? close() : open(); });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('[data-tip]')) $$('.pa-tip-wrap.open').forEach(function (w) { w.classList.remove('open'); }); });

  /* FAQ */
  $$('.pa-faq-item > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      var p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = open;
    });
  });

  /* Menu mobile em acordeão */
  $$('.pa-acc > button').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); });
  });

  /* Mega menu */
  var MEGA = window.PA_MEGA || {};
  $$('[data-mega]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-mega]').forEach(function (x) { x.setAttribute('aria-expanded', x === b ? 'true' : 'false'); });
      var d = MEGA[b.dataset.mega]; if (!d) return;
      $('#mega-k').textContent = b.dataset.mega; $('#mega-t').textContent = d[0];
      $('#mega-c').innerHTML = d[1].map(function (x) {
        return '<a class="pa-navcard" href="#navegacao"><span class="tile sm"><i class="ph ph-' + x[0] + '" aria-hidden="true"></i></span><span><b>' + x[1] + '</b><span>' + x[2] + '</span></span></a>';
      }).join('');
    });
  });

  /* Toggle */
  $$('.pa-switch').forEach(function (s) { s.addEventListener('click', function () { s.setAttribute('aria-checked', s.getAttribute('aria-checked') === 'true' ? 'false' : 'true'); }); });

  /* Método de pagamento */
  $$('.pa-methods').forEach(function (g) {
    var items = $$('.pa-method', g);
    items.forEach(function (m) {
      m.addEventListener('click', function () {
        if (m.getAttribute('aria-disabled') === 'true') return;
        items.forEach(function (x) { x.setAttribute('aria-checked', x === m ? 'true' : 'false'); });
      });
    });
  });

  /* Simulador (valores ilustrativos) */
  var chips = $$('#sim-chips .pa-chip');
  var fmt = function (v) { return 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.setAttribute('aria-pressed', x === c ? 'true' : 'false'); });
      var n = +c.dataset.n, rate = 0.0464, pv = 10000;
      var pmt = n === 1 ? pv * (1 + rate) : pv * rate / (1 - Math.pow(1 + rate, -n));
      $('#sim-out').textContent = n + 'x de ' + fmt(pmt);
      $('#sim-tot').textContent = fmt(pmt * n);
    });
  });

  /* Carrossel */
  var car = $('#car'), dots = $$('#car-dots span');
  function carSync() {
    if (!car) return;
    var cards = car.children, w = cards[0].getBoundingClientRect().width + 16;
    var i = Math.round(car.scrollLeft / w);
    dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    var prev = $('[data-car="prev"]'), next = $('[data-car="next"]');
    if (prev) prev.disabled = car.scrollLeft < 4;
    if (next) next.disabled = car.scrollLeft + car.clientWidth >= car.scrollWidth - 4;
  }
  if (car) {
    car.addEventListener('scroll', function () { window.requestAnimationFrame(carSync); }, { passive: true });
    $$('[data-car]').forEach(function (b) {
      b.addEventListener('click', function () {
        var w = car.children[0].getBoundingClientRect().width + 16;
        car.scrollBy({ left: b.dataset.car === 'next' ? w : -w, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    carSync();
  }

  /* Demonstração de duração */
  $$('.motion-track').forEach(function (t) {
    var go = function () { t.classList.toggle('go'); };
    t.addEventListener('click', go);
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
})();

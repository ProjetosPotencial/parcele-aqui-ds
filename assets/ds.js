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
    if (b.hasAttribute('data-copy')) { var el = $(b.getAttribute('data-copy')); if (el) copy(el.textContent, b.getAttribute('data-copy-label') || 'Prompt copiado'); }
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

  /* Carrossel: vale para todo bloco com data-carousel */
  $$('[data-carousel]').forEach(function (wrap) {
    var car = wrap.querySelector('.pa-car'); if (!car) return;
    var dots = Array.prototype.slice.call(wrap.querySelectorAll('.pa-dots span'));
    var step = function () { var c = car.children[0]; return c ? c.getBoundingClientRect().width + 16 : 0; };
    var idx = function () { return Math.round(car.scrollLeft / (step() || 1)); };
    var sync = function () { var i = idx(); dots.forEach(function (d, k) { d.classList.toggle('on', k === i); }); };
    var go = function (i) {
      var n = car.children.length; i = (i + n) % n;
      car.scrollTo({ left: i * step(), behavior: reduce ? 'auto' : 'smooth' });
    };
    car.addEventListener('scroll', function () { window.requestAnimationFrame(sync); }, { passive: true });
    wrap.querySelectorAll('[data-car]').forEach(function (b) {
      b.addEventListener('click', function () { go(idx() + (b.dataset.car === 'next' ? 1 : -1)); });
    });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(idx() + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx() - 1); }
    });
    sync();
  });

  /* Demonstração de duração */
  $$('.motion-track').forEach(function (t) {
    var go = function () { t.classList.toggle('go'); };
    t.addEventListener('click', go);
    t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });
})();

/* Slider de valor: o campo acompanha a barra e a barra acompanha o campo */
(function () {
  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var parse = function (s) { var n = parseFloat(String(s).replace(/[^\d,]/g, '').replace(',', '.')); return isNaN(n) ? null : n; };
  document.querySelectorAll('.pa-range').forEach(function (r) {
    var field = r.closest('.pa-field'); if (!field) return;
    var inp = field.querySelector('.pa-input'); if (!inp) return;
    var paint = function () {
      var p = (r.value - r.min) / (r.max - r.min) * 100;
      r.style.setProperty('--fill', p + '%');
    };
    var sync = function () { var t = brl(+r.value); inp.value = t; r.setAttribute('aria-valuetext', t); paint(); };
    r.addEventListener('input', sync);
    inp.addEventListener('change', function () {
      var n = parse(inp.value); if (n === null) { sync(); return; }
      n = Math.min(+r.max, Math.max(+r.min, Math.round(n / +r.step || 1) * (+r.step || 1)));
      r.value = n; sync();
    });
    paint();
  });
})();


/* Código copiável: gera o HTML de cada demonstração dos componentes */
(function () {
  var KINDS = ['Componentes', 'Plataforma', 'Padrões'];
  var VOID = { area: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, source: 1, wbr: 1 };
  var INLINE = { a: 1, b: 1, i: 1, span: 1, strong: 1, em: 1, small: 1, code: 1, s: 1, br: 1 };
  var BOOL = /^(checked|disabled|hidden|readonly|open|required|selected|multiple)$/;
  function attrs(el) {
    var o = '';
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === 'data-codegen' || a.name === 'tabindex' && el.classList.contains('pa-car') === false && a.value === '-1') continue;
      o += ' ' + a.name + (a.value === '' && BOOL.test(a.name) ? '' : '="' + a.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"');
    }
    return o;
  }
  function ser(node, d) {
    var pad = new Array(d + 1).join('  ');
    if (node.nodeType === 3) { var t = node.textContent.replace(/\s+/g, ' ').trim(); return t ? pad + t.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '\n' : ''; }
    if (node.nodeType !== 1) return '';
    var tag = node.tagName.toLowerCase();
    if (tag === 'svg' && /parcele/i.test(node.getAttribute('aria-label') || '')) return pad + '<img src="logos/parcele-aqui-logo.svg" alt="Parcele Aqui" height="32">\n';
    var open = '<' + tag + attrs(node) + '>';
    if (VOID[tag]) return pad + open + '\n';
    var kids = Array.prototype.slice.call(node.children);
    var simple = kids.every(function (c) { return INLINE[c.tagName.toLowerCase()] && c.children.length === 0; });
    if (tag === 'svg' || tag === 'pre' || (simple && node.innerHTML.length < 160)) {
      var inner = tag === 'svg' || tag === 'pre' ? node.innerHTML : node.innerHTML.replace(/\s+/g, ' ').trim();
      return pad + open + inner + '</' + tag + '>\n';
    }
    var out = pad + open + '\n';
    Array.prototype.forEach.call(node.childNodes, function (c) { out += ser(c, d + 1); });
    return out + pad + '</' + tag + '>\n';
  }
  function codeOf(demo) {
    var c = demo.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('.demo-label,.demo-note,.code-box'), function (x) { x.remove(); });
    var out = '';
    Array.prototype.forEach.call(c.childNodes, function (n) { out += ser(n, 0); });
    return out.trim();
  }
  var n = 0;
  KINDS.forEach(function (k) {
    document.querySelectorAll('.section[data-kind="' + k + '"] .demo').forEach(function (demo) {
      if (demo.closest('.code-box') || demo.parentElement.closest('.demo')) return;
      var id = 'code-' + (++n);
      var d = document.createElement('details');
      d.className = 'code-box';
      d.innerHTML = '<summary><i class="ph ph-code" aria-hidden="true"></i>Código HTML<i class="ph ph-caret-down chev" aria-hidden="true"></i></summary>' +
        '<div class="code-body"><button class="pa-btn sm ghost copy" type="button" data-copy="#' + id + '" data-copy-label="Código copiado"><i class="ph ph-copy" aria-hidden="true"></i>Copiar</button><pre><code id="' + id + '"></code></pre></div>' +
        '<p class="hint">Requer <code>tokens/tokens.css</code>, <code>assets/ds.css</code> e os ícones Phosphor (<code>assets/phosphor/style.css</code>). Comportamentos (acordeão, carrossel, toast) estão em <code>assets/ds.js</code>.</p>';
      demo.appendChild(d);
      d.addEventListener('toggle', function () {
        if (d.open && !d.dataset.ready) { d.querySelector('code').textContent = codeOf(demo); d.dataset.ready = '1'; }
      });
    });
  });
})();

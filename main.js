/* Mayukh & Priyanka — v3 (typographic, no photos) */
(() => {
  const C = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  document.body.classList.add('loading');

  /* ---------------- SVG helpers ---------------- */
  const NS = 'http://www.w3.org/2000/svg';
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  const pt = (a, r) => `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
  const petal = (r, len, w) => `M0 ${-r} C${w} ${-(r + len * .35)} ${w * .55} ${-(r + len * .85)} 0 ${-(r + len)} C${-w * .55} ${-(r + len * .85)} ${-w} ${-(r + len * .35)} 0 ${-r}Z`;
  function mandala(svg, rings) {
    return rings.map(R => {
      const g = mk('g', { class: 'm-ring' }, svg);
      if (R.t === 'c') mk('circle', { r: R.r, pathLength: 1 }, g);
      if (R.t === 'p') for (let i = 0; i < R.n; i++) mk('path', { d: petal(R.r, R.len, R.w), transform: `rotate(${(i * 360 / R.n + (R.off || 0)).toFixed(2)})`, pathLength: 1 }, g);
      if (R.t === 'rays') for (let i = 0; i < R.n; i++) mk('path', { d: `M0 ${-R.r} V${-(R.r + R.len * (i % 2 ? .55 : 1))}`, transform: `rotate(${(i * 360 / R.n).toFixed(2)})`, pathLength: 1 }, g);
      if (R.t === 'd') for (let i = 0; i < R.n; i++) { const a = i / R.n * Math.PI * 2; mk('circle', { cx: (Math.cos(a) * R.r).toFixed(2), cy: (Math.sin(a) * R.r).toFixed(2), r: R.s, class: 'dot' }, g); }
      if (R.t === 's') { let d = ''; for (let i = 0; i < R.n; i++) { const a1 = i / R.n * Math.PI * 2, a2 = (i + 1) / R.n * Math.PI * 2; d += `M${pt(a1, R.r)} Q${pt((a1 + a2) / 2, R.r + R.h)} ${pt(a2, R.r)} `; } mk('path', { d, pathLength: 1 }, g); }
      return g;
    });
  }
  const drawables = scope => $$('[pathLength]', scope);
  const hideStrokes = scope => gsap.set(drawables(scope), { strokeDasharray: 1, strokeDashoffset: 1 });

  const HERO_RINGS = [
    { t: 'c', r: 104 }, { t: 'd', r: 100, n: 90, s: .45 }, { t: 's', r: 92, n: 36, h: 6 },
    { t: 'p', r: 72, len: 18, w: 5, n: 36 }, { t: 'c', r: 70 }, { t: 'rays', r: 56, len: 12, n: 72 }, { t: 'c', r: 54 },
    { t: 'p', r: 34, len: 19, w: 8, n: 24 }, { t: 'd', r: 31, n: 48, s: .5 }, { t: 's', r: 24, n: 16, h: 5 },
    { t: 'p', r: 6, len: 14, w: 5, n: 12 }, { t: 'c', r: 4 }
  ];
  const LOADER_RINGS = [
    { t: 'c', r: 100 }, { t: 's', r: 88, n: 24, h: 8 }, { t: 'p', r: 58, len: 26, w: 8, n: 24 }, { t: 'c', r: 56 },
    { t: 'p', r: 26, len: 26, w: 10, n: 12, off: 15 }, { t: 'c', r: 22 }, { t: 'p', r: 4, len: 16, w: 6, n: 8 }
  ];
  const SUN_RINGS = [
    { t: 'rays', r: 70, len: 34, n: 96 }, { t: 'c', r: 66 }, { t: 's', r: 52, n: 48, h: 8 }, { t: 'c', r: 44 },
    { t: 'p', r: 20, len: 22, w: 7, n: 32 }, { t: 'c', r: 16 }
  ];

  /* ---------------- motifs ---------------- */
  const MOTIFS = [
    // tiffin
    `<rect x="32" y="44" width="56" height="18" rx="4"/><rect x="32" y="64" width="56" height="18" rx="4"/><rect x="32" y="84" width="56" height="18" rx="4"/><path d="M42 44 V30 Q60 16 78 30 V44"/><path d="M28 53 H32 M88 53 H92 M28 73 H32 M88 73 H92 M28 93 H32 M88 93 H92"/>`,
    // two classmates
    `<circle cx="34" cy="48" r="10"/><circle cx="86" cy="48" r="10"/><path d="M18 100 Q34 64 50 100"/><path d="M70 100 Q86 64 102 100"/><path d="M46 44 Q60 26 74 44" stroke-dasharray="3 5"/><path d="M60 34 C56 28 50 32 54 37 L60 42 L66 37 C70 32 64 28 60 34Z"/>`,
    // menu
    `<path d="M18 30 L58 36 V100 L18 94Z"/><path d="M102 30 L62 36 V100 L102 94Z"/><path d="M26 48 L50 51 M26 58 L50 61 M26 68 L44 70 M70 51 L94 48 M70 61 L94 58 M70 71 L88 69"/><path d="M60 14 L62 20 L68 20 L63 24 L65 30 L60 26 L55 30 L57 24 L52 20 L58 20Z"/>`,
    // plate
    `<circle cx="60" cy="64" r="28"/><circle cx="60" cy="64" r="18"/><path d="M20 34 V96 M14 34 V48 Q20 56 26 48 V34"/><path d="M100 34 Q110 52 100 64 V96"/>`,
    // plan list
    `<rect x="28" y="20" width="64" height="84" rx="6"/><path d="M48 20 V14 H72 V20"/><path d="M38 42 l4 4 l8 -8 M58 42 H82 M38 62 l4 4 l8 -8 M58 62 H82 M58 84 H82"/><rect x="38" y="78" width="11" height="11" rx="2"/>`,
    // rings + sparkles
    `<circle cx="48" cy="70" r="24"/><circle cx="72" cy="70" r="24"/><path d="M60 18 V34 M52 26 H68 M94 30 l8 8 M102 30 l-8 8 M20 36 v8 M16 40 h8"/>`
  ];
  const EMBLEMS = {
    engagement: `<circle cx="-24" cy="22" r="46"/><circle cx="24" cy="22" r="46"/><path d="M-24 -24 L-38 -40 L-30 -54 H-18 L-10 -40 Z"/><path d="M-38 -40 H-10 M-30 -54 L-24 -40 L-18 -54"/><path d="M58 -64 V-40 M46 -52 H70"/><path d="M-74 -30 V-14 M-82 -22 H-66"/><path d="M76 66 v12 M70 72 h12"/>`,
    haldi: `<path d="M-48 20 C-56 70 -24 86 0 86 C24 86 56 70 48 20 C44 0 24 -8 0 -8 C-24 -8 -44 0 -48 20 Z"/><path d="M-22 -8 L-18 -22 H18 L22 -8"/><path d="M-27 -22 H27"/><ellipse cx="0" cy="-44" rx="15" ry="20"/><path d="M-14 -26 C-30 -44 -52 -50 -72 -44 C-56 -30 -36 -24 -14 -26 Z"/><path d="M14 -26 C30 -44 52 -50 72 -44 C56 -30 36 -24 14 -26 Z"/><path d="M-8 -28 C-22 -52 -36 -64 -48 -72 C-44 -52 -30 -36 -8 -28 Z"/><path d="M8 -28 C22 -52 36 -64 48 -72 C44 -52 30 -36 8 -28 Z"/><path d="M-50 28 Q0 44 50 28"/><path d="M-44 62 Q0 74 44 62"/><circle cx="-22" cy="46" r="3"/><circle cx="0" cy="49" r="3"/><circle cx="22" cy="46" r="3"/>`,
    wedding: `<circle r="88" class="nodraw" stroke-dasharray="1.5 6"/><g transform="translate(0 -10) scale(.74)"><path d="M-50 70 H50 L42 54 H-42 Z"/><path d="M-62 88 H62 L50 70 H-50 Z"/><path d="M0 54 C-34 40 -30 6 -10 -22 C-8 -2 4 4 6 -8 C10 -20 6 -34 0 -46 C24 -26 36 4 28 28 C40 20 40 8 36 0 C50 22 40 50 0 54 Z"/><path d="M0 46 C-14 40 -14 22 -2 8 C0 20 10 22 12 14 C22 28 16 42 0 46 Z"/></g>${Array.from({ length: 7 }, (_, i) => { const a = (-90 + i * 360 / 7) * Math.PI / 180; return `<circle class="dot" cx="${(Math.cos(a) * 88).toFixed(1)}" cy="${(Math.sin(a) * 88).toFixed(1)}" r="4.5"/>`; }).join('')}`,
    reception: `<g transform="translate(-30 6) rotate(-14)"><path d="M-16 -60 H16 L12 0 C10 12 -10 12 -12 0 Z"/><path d="M-15 -38 H15"/><path d="M0 10 V58 M-18 58 H18"/></g><g transform="translate(30 6) rotate(14)"><path d="M-16 -60 H16 L12 0 C10 12 -10 12 -12 0 Z"/><path d="M-15 -38 H15"/><path d="M0 10 V58 M-18 58 H18"/></g><path d="M0 -66 V-84 M-10 -64 L-20 -78 M10 -64 L20 -78"/><circle cx="-36" cy="-72" r="3"/><circle cx="-26" cy="-84" r="2"/><circle cx="38" cy="-76" r="2.5"/><path d="M-80 -20 v12 M-86 -14 h12 M78 30 v10 M73 35 h10 M70 -60 l6 6 M76 -60 l-6 6"/>`
  };
  const withLen = s => s.replace(/<(path|circle|ellipse|rect)(?![^>]*class="(?:nodraw|dot)")/g, '<$1 pathLength="1"');

  /* ---------------- render content ---------------- */
  // manifesto
  const hl = new Set(C.highlight || []);
  $('#manifesto').innerHTML = C.invite.split(' ').map(w => `<span class="word${hl.has(w) ? ' hl' : ''}">${esc(w)}</span>`).join(' ');
  $('#sign-g').textContent = C.groomFull; $('#sign-b').textContent = C.brideFull;

  // marquee
  const fillTrack = (track, items) => {
    const set = items.map(t => t === '✺' ? '<span class="star">✺</span>' : /[ऀ-ॿ]/.test(t) ? `<span class="deva">${t}</span>` : `<span>${esc(t)}</span>`).join('');
    track.innerHTML = set.repeat(4);
    track.innerHTML += track.innerHTML; // two identical halves -> seamless -50% loop
  };
  fillTrack($('.mq-a .mq-track'), [C.groom, '✺', C.bride, '✺', 'शुभ विवाह', '✺', 'Save the date', '✺']);
  fillTrack($('.mq-b .mq-track'), C.events.flatMap(e => [`${e.date.slice(8)}.02 · ${e.name}`, '✺']));

  // story cards
  const pad2 = n => String(n).padStart(2, '0');
  $('#story-stack').innerHTML = C.story.map((s, i) => `
    <article class="card">
      <div class="card-top"><span class="card-label">${esc(s.label)}</span><span class="card-num">${pad2(i + 1)}</span></div>
      <div class="card-motif"><svg viewBox="0 0 120 120" stroke-linecap="round" stroke-linejoin="round">${withLen(MOTIFS[i % MOTIFS.length])}</svg></div>
      <h3 class="card-title">${esc(s.title)}</h3>
      <p class="card-text">${esc(s.text)}</p>
    </article>`).join('');
  $('#story-tot').textContent = pad2(C.story.length);

  // events
  const fmtDay = d => new Date(d + 'T12:00:00+05:30');
  const weekday = d => fmtDay(d).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Kolkata' });
  const longDate = d => fmtDay(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
  const nameHTML = n => { const ws = n.split(' '), amp = ws.includes('&'); return ws.map((w, i) => { const it = amp ? w === '&' : ws.length > 1 && i === ws.length - 1; return `<span class="w">${it ? `<em>${esc(w)}</em>` : esc(w)}</span>`; }).join(' '); };
  const gcal = e => { const d = e.date.replace(/-/g, ''); const q = new URLSearchParams({ action: 'TEMPLATE', text: `${C.groom} & ${C.bride} — ${e.name}`, dates: `${d}T113000Z/${d}T173000Z`, location: `${e.venue}, ${e.address}`, details: e.tagline }); return 'https://calendar.google.com/calendar/render?' + q; };
  $('#ev-track').innerHTML = C.events.map((e, i) => `
    <article class="ev" data-k="${e.key}">
      <div class="ev-day" aria-hidden="true">${e.date.slice(8)}</div>
      <div class="ev-text">
        <div class="ev-idx"><span>${pad2(i + 1)} / ${pad2(C.events.length)}</span><span>${weekday(e.date)}</span></div>
        <h3 class="ev-name">${nameHTML(e.name)}</h3>
        <p class="ev-tag">${esc(e.tagline)}</p>
        <dl class="ev-meta">
          <div><dt>Date</dt><dd>${longDate(e.date)}</dd></div>
          <div><dt>Time</dt><dd>${esc(e.time)}</dd></div>
          <div class="wide"><dt>Venue</dt><dd>${esc(e.venue)} — ${esc(e.address)}</dd></div>
        </dl>
        <div class="ev-btns">
          ${e.map ? `<a class="btn magnetic" href="${esc(e.map)}" target="_blank" rel="noopener" data-cursor="Map">Directions ↗</a>` : ''}
          <a class="btn magnetic" href="${gcal(e)}" target="_blank" rel="noopener" data-cursor="Save">Add to calendar</a>
        </div>
      </div>
      <div class="ev-art" aria-hidden="true"><div class="ring-orbit"></div><svg viewBox="-100 -100 200 200">${withLen(EMBLEMS[e.key] || EMBLEMS.wedding)}</svg></div>
    </article>`).join('');

  // rsvp event pills
  $('#ev-checks').innerHTML = C.events.map(e => `<label class="pill" data-cursor><input type="checkbox" name="events" value="${esc(e.name)}" checked><span>${esc(e.name)}</span></label>`).join('');

  // svgs
  const heroRings = mandala($('#mandala'), HERO_RINGS);
  const loaderRings = mandala($('.ld-mandala'), LOADER_RINGS);
  mandala($('.cd-sun svg'), SUN_RINGS);

  /* ---------------- smooth scroll ---------------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ lerp: .085 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    lenis.stop(); window.__lenis = lenis;
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault();
    lenis ? lenis.scrollTo(t, { duration: 1.8 }) : t.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------------- cursor + magnetic ---------------- */
  if (fine) {
    const cur = $('#cursor'), dot = $('.c-dot'), ring = $('.c-ring'), lab = $('.c-label');
    const dx = gsap.quickTo(dot, 'x', { duration: .12 }), dy = gsap.quickTo(dot, 'y', { duration: .12 });
    const rx = gsap.quickTo(ring, 'x', { duration: .5, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .5, ease: 'power3' });
    addEventListener('pointermove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    addEventListener('pointerdown', () => cur.classList.add('down')); addEventListener('pointerup', () => cur.classList.remove('down'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('[data-cursor], a, button, select, .pill');
      cur.classList.remove('hover', 'label');
      if (!t) return;
      const l = t.getAttribute('data-cursor');
      if (l) { lab.textContent = l; cur.classList.add('label'); } else cur.classList.add('hover');
    });
    document.addEventListener('pointerleave', () => gsap.to(cur, { opacity: 0, duration: .2 }));
    document.addEventListener('pointerenter', () => gsap.to(cur, { opacity: 1, duration: .2 }));

    $$('.magnetic').forEach(m => {
      const xTo = gsap.quickTo(m, 'x', { duration: .6, ease: 'power3' }), yTo = gsap.quickTo(m, 'y', { duration: .6, ease: 'power3' });
      m.addEventListener('pointermove', e => { const r = m.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .35); yTo((e.clientY - r.top - r.height / 2) * .45); });
      m.addEventListener('pointerleave', () => { gsap.to(m, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, .35)', overwrite: true }); });
    });
  }

  /* ---------------- petals canvas ---------------- */
  function petals() {
    const cv = $('#petals'), ctx = cv.getContext('2d'), hero = $('#hero');
    const cols = ['#f0a73a', '#f6c45c', '#e2672b', '#c8281e', '#f4ead8', '#f0a73a'];
    let W, H, dpr, running = false, mx = -999, my = -999;
    const N = innerWidth < 700 ? 18 : 38;
    const P = Array.from({ length: N }, () => ({}));
    const spawn = (p, top) => Object.assign(p, { x: Math.random() * W, y: top ? -20 - Math.random() * H * .3 : Math.random() * H, s: 4 + Math.random() * 8, r: Math.random() * 6.28, vr: (Math.random() - .5) * .04, vy: .35 + Math.random() * .8, sw: Math.random() * 6.28, f: Math.random() * 6.28, vf: .02 + Math.random() * .04, c: cols[Math.random() * cols.length | 0], a: .55 + Math.random() * .4, ox: 0, oy: 0 });
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = hero.clientWidth; H = hero.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); P.forEach(p => spawn(p, false));
    addEventListener('resize', size);
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mx = my = -999; });
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.sw += .012; p.f += p.vf; p.r += p.vr; p.y += p.vy; p.x += Math.sin(p.sw) * .45;
        const ddx = p.x - mx, ddy = p.y - my, d2 = ddx * ddx + ddy * ddy;
        if (d2 < 16000) { const d = Math.sqrt(d2) || 1, k = (1 - d / 126) * 3.2; p.ox += ddx / d * k; p.oy += ddy / d * k; }
        p.ox *= .93; p.oy *= .93;
        if (p.y > H + 30) spawn(p, true);
        const x = p.x + p.ox, y = p.y + p.oy, s = p.s;
        ctx.save(); ctx.translate(x, y); ctx.rotate(p.r); ctx.scale(1, Math.cos(p.f)); ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.bezierCurveTo(s * .9, -s * .6, s * .7, s * .7, 0, s); ctx.bezierCurveTo(-s * .7, s * .7, -s * .9, -s * .6, 0, -s); ctx.fill(); ctx.restore();
      }
      requestAnimationFrame(tick);
    };
    ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: s => { running = s.isActive; if (running) requestAnimationFrame(tick); } });
  }

  /* ---------------- hero name proximity (variable font) ---------------- */
  function proximity(chars) {
    if (!fine) return;
    let mx = -9999, my = -9999;
    const state = chars.map(() => ({ w: 300, s: 0 }));
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    $('#hero').addEventListener('pointerleave', () => { mx = my = -9999; });
    gsap.ticker.add(() => {
      if (scrollY > innerHeight) return;
      chars.forEach((c, i) => {
        const r = c.getBoundingClientRect(), d = Math.hypot(r.left + r.width / 2 - mx, r.top + r.height / 2 - my);
        const k = Math.pow(Math.max(0, 1 - d / 300), 1.6), st = state[i];
        st.w += (300 + 560 * k - st.w) * .14; st.s += (100 * k - st.s) * .14;
        c.style.fontVariationSettings = `'opsz' 144, 'wght' ${st.w.toFixed(0)}, 'SOFT' ${st.s.toFixed(0)}`;
      });
    });
  }

  /* ---------------- countdown ---------------- */
  const UNITS = [['Days', 864e5], ['Hours', 36e5], ['Minutes', 6e4], ['Seconds', 1e3]];
  $('#cd-grid').innerHTML = UNITS.map(([l]) => `<div class="cd-unit"><div class="cd-num"></div><div class="cd-lab">${l}</div></div>`).join('');
  const nums = $$('.cd-num');
  let cdAnimate = false;
  function setNum(el, str) {
    while (el.children.length < str.length) { const d = document.createElement('span'); d.className = 'cd-digit'; d.innerHTML = '<span>0</span>'; el.appendChild(d); }
    while (el.children.length > str.length) el.lastChild.remove();
    [...el.children].forEach((d, i) => {
      const cur = d.lastElementChild;
      if (cur.textContent === str[i]) return;
      if (!cdAnimate || reduced) { d.innerHTML = `<span>${str[i]}</span>`; return; }
      const nx = document.createElement('span'); nx.textContent = str[i]; Object.assign(nx.style, { position: 'absolute', left: 0, top: 0 }); d.appendChild(nx);
      gsap.to(cur, { yPercent: -100, duration: .7, ease: 'expo.out', onComplete: () => cur.remove() });
      gsap.fromTo(nx, { yPercent: 100 }, { yPercent: 0, duration: .7, ease: 'expo.out', onComplete: () => { nx.style.position = ''; } });
    });
  }
  const target = new Date(C.weddingDate).getTime();
  function tickCD() {
    let ms = Math.max(0, target - Date.now());
    UNITS.forEach(([, u], i) => { const v = Math.floor(ms / u); ms -= v * u; setNum(nums[i], pad2(v)); });
  }
  tickCD(); setInterval(tickCD, 1000);

  /* ---------------- RSVP ---------------- */
  const form = $('#rsvp-form'), err = $('#f-err'), going = $('#going');
  $$('input[name=attending]', form).forEach(r => r.addEventListener('change', () => {
    const no = form.attending.value === 'No';
    if (no === going.classList.contains('off')) return;
    if (no) gsap.to(going, { height: 0, opacity: 0, duration: .5, ease: 'power3.inOut', onComplete: () => { going.classList.add('off'); ScrollTrigger.refresh(); } });
    else { going.classList.remove('off'); gsap.fromTo(going, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: .6, ease: 'power3.out', onComplete: () => ScrollTrigger.refresh() }); }
  }));
  function burst(x, y, n = 70) {
    const cols = ['#f0a73a', '#f6c45c', '#e2672b', '#c8281e', '#f4ead8'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'burst'; p.style.left = x + 'px'; p.style.top = y + 'px'; p.style.background = cols[i % cols.length];
      document.body.appendChild(p);
      const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 320;
      gsap.timeline({ onComplete: () => p.remove() })
        .to(p, { x: Math.cos(a) * v, y: Math.sin(a) * v - 140, rotation: Math.random() * 720, scale: .6 + Math.random() * .8, duration: .9, ease: 'power3.out' })
        .to(p, { y: '+=' + (260 + Math.random() * 200), opacity: 0, rotation: '+=180', duration: 1.4, ease: 'power1.in' });
    }
  }
  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = '';
    const name = form.name.value.trim(), email = form.email.value.trim(), attending = form.attending.value;
    const okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    form.name.closest('.f').classList.toggle('bad', !name); form.email.closest('.f').classList.toggle('bad', !okMail);
    if (!name || !okMail || !attending) {
      err.textContent = !name ? 'We need your name for the guest list.' : !okMail ? 'That email doesn’t look quite right.' : 'Yes, Maybe or No — pick one!';
      gsap.fromTo(form, { x: -12 }, { x: 0, duration: .6, ease: 'elastic.out(1, .25)' }); return;
    }
    if (form._honey.value) return;
    const yes = attending !== 'No', btn = $('.send', form);
    const payload = {
      _subject: `Wedding RSVP: ${attending} — ${name}`, _template: 'table', _captcha: 'false',
      Name: name, Email: email, Attending: attending,
      Guests: yes ? form.guests.value : '0',
      Events: yes ? ($$('input[name=events]:checked', form).map(i => i.value).join(', ') || 'Not specified') : '—',
      Message: form.message.value.trim() || '—'
    };
    btn.disabled = true; $('.send-t', btn).textContent = 'Sending…';
    try {
      const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(C.rsvpEmail), { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || String(j.success) !== 'true') throw new Error('failed');
      const first = name.split(' ')[0];
      $('#done-big').textContent = attending === 'No' ? 'We’ll miss you' : 'Shukriya!';
      $('#done-text').textContent = attending === 'Yes' ? `See you there, ${first}! Your seat is saved — come hungry.` : attending === 'Maybe' ? `Thanks, ${first}. We’ve pencilled you in — tell us when you know.` : `Thank you for letting us know, ${first}. We’ll save you some mithai.`;
      const r = btn.getBoundingClientRect();
      gsap.to(form, { opacity: 0, y: -20, duration: .4, onComplete: () => {
        form.style.display = 'none'; $('#rsvp-done').hidden = false;
        const sp = new SplitText('#done-big', { type: 'chars' });
        gsap.from(sp.chars, { yPercent: 120, rotation: 10, opacity: 0, stagger: .04, duration: .9, ease: 'expo.out' });
        gsap.from('#done-text', { y: 20, opacity: 0, duration: .7, delay: .3 });
        if (yes) burst(r.left + r.width / 2, r.top + r.height / 2);
        ScrollTrigger.refresh();
      } });
    } catch {
      err.textContent = 'Couldn’t send just now — please try again in a moment.';
      btn.disabled = false; $('.send-t', btn).textContent = 'Send RSVP';
    }
  });

  /* ---------------- theme by section (created after the pins so positions include pin spacing) ---------------- */
  function themes() {
    const themeSTs = [];
    const applyTheme = () => { const a = themeSTs.filter(s => s.isActive).pop(); if (a) root.dataset.theme = a.trigger.dataset.theme; };
    $$('[data-theme]').forEach(sec => { if (sec === root) return;
      themeSTs.push(ScrollTrigger.create({ trigger: sec, start: sec.id === 'end' ? 'top 80%' : 'top 55%', end: 'bottom 55%', onToggle: applyTheme }));
    });
  }

  /* ---------------- scenes ---------------- */
  function scenes() {
    // progress + nav hide
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
    let navHidden = false;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
      const hide = s.direction === 1 && s.scroll() > innerHeight * .6;
      if (hide !== navHidden) { navHidden = hide; gsap.to('#nav', { yPercent: hide ? -120 : 0, duration: .6, ease: 'power3.out' }); }
    } });

    // split titles
    $$('.split-up').forEach(t => {
      const sp = SplitText.create(t, { type: 'lines', mask: 'lines', linesClass: 'line' });
      gsap.from(sp.lines, { yPercent: 110, rotation: 3, duration: 1.3, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } });
    });
    $$('.eyebrow').forEach(e => gsap.from(e, { opacity: 0, x: -20, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: e, start: 'top 90%' } }));

    // hero scroll-out
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.ht-1', { xPercent: -18, ease: 'none' }, 0)
      .to('.ht-2', { xPercent: 18, ease: 'none' }, 0)
      .to('.ht-amp', { rotation: 160, scale: 2.2, opacity: 0, ease: 'none' }, 0)
      .to('.hero-mandala', { scale: 1.5, rotation: 50, opacity: .25, ease: 'none' }, 0)
      .to(['.hero-kicker', '.hero-sub', '.hero-foot'], { opacity: 0, y: -40, ease: 'none' }, 0);

    // manifesto word fill
    const words = $$('#manifesto .word');
    gsap.to(words, { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#manifesto', start: 'top 78%', end: 'bottom 50%', scrub: true } });
    gsap.from('.inv-ornament svg > *', { scale: 0, transformOrigin: '50% 50%', stagger: .08, duration: 1, ease: 'back.out(2)', scrollTrigger: { trigger: '.inv-ornament', start: 'top 85%' } });
    gsap.from('.inv-sign', { opacity: 0, y: 30, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.inv-sign', start: 'top 92%' } });

    // marquee with velocity
    const mA = gsap.to('.mq-a .mq-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    const mB = gsap.fromTo('.mq-b .mq-track', { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
      const v = s.getVelocity(); if (Math.abs(v) < 10) return;
      dir = v > 0 ? 1 : -1;
      const ts = dir * (1 + Math.min(Math.abs(v) / 220, 9));
      gsap.to([mA, mB], { timeScale: ts, duration: .2, overwrite: true, onComplete: () => gsap.to([mA, mB], { timeScale: dir, duration: 1.2, ease: 'power2.out' }) });
    } });
    gsap.fromTo('.mq-a', { rotation: -7 }, { rotation: -2, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.mq-b', { rotation: 6 }, { rotation: 1.5, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

    // story stack
    const cards = $$('.card'), n = cards.length, slot = j => ({ y: j * 16, scale: 1 - j * .045, rotation: j === 0 ? 0 : (j % 2 ? 2.5 : -2.5) });
    cards.forEach((c, i) => { c.style.zIndex = n - i; gsap.set(c, slot(i)); });
    cards.forEach((c, i) => { if (i) hideStrokes(c); });
    const st = gsap.timeline({ defaults: { ease: 'power2.inOut', duration: 1 }, scrollTrigger: {
      trigger: '.story-pin', pin: true, start: 'top top', end: () => '+=' + innerHeight * .75 * (n - 1), scrub: .8, anticipatePin: 1,
      onUpdate: s => { const k = Math.min(n - 1, Math.round(s.progress * (n - 1))); $('#story-cur').textContent = pad2(k + 1); $('.story-count .sl').style.setProperty('--p', s.progress); }
    } });
    for (let s = 0; s < n - 1; s++) {
      st.to(cards[s], { yPercent: -135, xPercent: s % 2 ? 18 : -18, rotation: s % 2 ? 14 : -14, ease: 'power2.in' }, s);
      for (let j = s + 1; j < n; j++) st.to(cards[j], slot(j - s - 1), s);
      st.to(drawables(cards[s + 1]), { strokeDashoffset: 0, duration: .8, stagger: .05, ease: 'power1.out' }, s + .3);
    }
    st.to({}, { duration: .3 });
    gsap.from('#story-stack', { y: 120, opacity: 0, rotation: 4, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#story', start: 'top 70%' } });
    if (fine) {
      const stack = $('#story-stack'), rX = gsap.quickTo(stack, 'rotationX', { duration: .8, ease: 'power3' }), rY = gsap.quickTo(stack, 'rotationY', { duration: .8, ease: 'power3' });
      stack.addEventListener('pointermove', e => { const r = stack.getBoundingClientRect(); rY(((e.clientX - r.left) / r.width - .5) * 14); rX(-((e.clientY - r.top) / r.height - .5) * 12); });
      stack.addEventListener('pointerleave', () => { rX(0); rY(0); });
    }

    // events
    const track = $('#ev-track'), panels = $$('.ev');
    panels.forEach(p => hideStrokes(p));
    const reveal = (p, trig) => {
      const tl = gsap.timeline({ scrollTrigger: trig });
      tl.from($$('.ev-name .w', p), { yPercent: 60, opacity: 0, rotation: 4, stagger: .08, duration: 1, ease: 'expo.out' }, 0)
        .from([$('.ev-tag', p), $('.ev-meta', p), $('.ev-btns', p)], { y: 30, opacity: 0, stagger: .08, duration: .9, ease: 'power3.out' }, .15)
        .to(drawables(p), { strokeDashoffset: 0, duration: 1.6, stagger: .06, ease: 'power2.inOut' }, 0)
        .from($('.ring-orbit', p), { scale: .4, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0);
    };
    panels.forEach(p => {
      gsap.to($('.ring-orbit', p), { rotation: 360, duration: 50, ease: 'none', repeat: -1 });
      if (fine) {
        const art = $('.ev-art svg', p);
        p.addEventListener('pointerenter', () => gsap.to(art, { scale: 1.06, rotation: 6, duration: 1, ease: 'expo.out' }));
        p.addEventListener('pointerleave', () => gsap.to(art, { scale: 1, rotation: 0, x: 0, y: 0, duration: 1, ease: 'expo.out' }));
        p.addEventListener('pointermove', e => { const r = p.getBoundingClientRect(); gsap.to(art, { x: ((e.clientX - r.left) / r.width - .5) * 30, y: ((e.clientY - r.top) / r.height - .5) * 30, duration: .8, ease: 'power3' }); });
      }
    });
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => track.scrollWidth - innerWidth;
      const hz = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
        trigger: '.ev-pin', pin: true, start: 'top top', end: () => '+=' + dist(), scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: s => gsap.set('.ev-progress span', { scaleX: s.progress })
      } });
      panels.forEach((p, i) => {
        reveal(p, i === 0 ? { trigger: '.ev-pin', start: 'top 60%' } : { trigger: p, containerAnimation: hz, start: 'left 70%' });
        gsap.fromTo($('.ev-day', p), { xPercent: 20 }, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: hz, start: 'left right', end: 'right left', scrub: true } });
      });
    });
    mm.add('(max-width: 899px)', () => {
      panels.forEach(p => reveal(p, { trigger: p, start: 'top 75%' }));
    });

    // countdown
    gsap.from('.cd-unit', { y: 80, opacity: 0, stagger: .1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#cd-grid', start: 'top 85%' }, onComplete: () => { cdAnimate = true; } });
    gsap.to('.cd-sun svg', { rotation: 120, ease: 'none', scrollTrigger: { trigger: '#countdown', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.cd-note', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '.cd-note', start: 'top 92%' } });

    // rsvp fields
    gsap.from('.rsvp-form > *', { y: 40, opacity: 0, stagger: .07, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.rsvp-form', start: 'top 80%' } });

    // footer
    const endSplit = SplitText.create('.end-names span', { type: 'chars', charsClass: 'char' });
    gsap.from([...endSplit.chars, '.end-names i'], { yPercent: 110, opacity: 0, rotation: 8, stagger: .035, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#end', start: 'top 85%' } });
    gsap.from('.end-kicker', { opacity: 0, y: 20, duration: 1, scrollTrigger: { trigger: '#end', start: 'top 85%' } });
    if (fine) endSplit.chars.forEach(c => c.addEventListener('pointerenter', () => {
      if (gsap.isTweening(c)) return;
      gsap.timeline().to(c, { yPercent: -22, color: getComputedStyle(root).getPropertyValue('--ac'), duration: .3, ease: 'power3.out' }).to(c, { yPercent: 0, color: 'inherit', duration: .9, ease: 'elastic.out(1, .3)' });
    }));

    themes();
    ScrollTrigger.refresh();
  }

  /* ---------------- intro ---------------- */
  async function intro() {
    hideStrokes($('.ld-mandala')); hideStrokes($('#mandala'));
    const num = $('#ld-num'), counter = { v: 0 };
    loaderRings.forEach((g, i) => gsap.to(g, { rotation: i % 2 ? -90 : 90, svgOrigin: '0 0', duration: 6, ease: 'none' }));
    const ld = gsap.timeline()
      .to(drawables($('.ld-mandala')), { strokeDashoffset: 0, duration: 1.8, stagger: .012, ease: 'power2.inOut' }, 0)
      .to(counter, { v: 100, duration: 2.2, ease: 'power2.inOut', onUpdate: () => { num.textContent = pad2(Math.round(counter.v)); } }, 0)
      .from('.ld-word', { opacity: 0, letterSpacing: '.6em', duration: 1.6, ease: 'power3.out' }, .2);
    await Promise.all([document.fonts.ready, new Promise(r => ld.eventCallback('onComplete', r))]);

    // splits after fonts
    const heroChars = $$('.ht').flatMap(h => SplitText.create(h, { type: 'chars', charsClass: 'char' }).chars);
    gsap.set('.hero-mandala', { xPercent: -50, yPercent: -50, x: 0, y: 0 });

    const tl = gsap.timeline();
    tl.to(['.ld-count', '.ld-word'], { opacity: 0, y: -20, duration: .5, ease: 'power2.in' })
      .to('.ld-mandala', { scale: 2.6, opacity: 0, rotation: 60, duration: 1.2, ease: 'expo.in' }, '<')
      .to('.ld-top', { yPercent: -101, duration: 1.2, ease: 'expo.inOut' }, '-=.35')
      .to('.ld-bot', { yPercent: 101, duration: 1.2, ease: 'expo.inOut' }, '<')
      .set('#loader', { display: 'none' })
      .add(() => { document.body.classList.remove('loading'); lenis && lenis.start(); })
      .from(heroChars, { yPercent: 120, rotationX: -90, opacity: 0, filter: 'blur(8px)', transformOrigin: '50% 100%', stagger: .045, duration: 1.4, ease: 'expo.out' }, '-=.85')
      .from('.ht-amp', { scale: 0, rotation: -180, duration: 1.4, ease: 'expo.out' }, '-=1.1')
      .to(drawables($('#mandala')), { strokeDashoffset: 0, duration: 2.6, stagger: .004, ease: 'power2.inOut' }, '-=1.6')
      .from('#mandala .dot', { scale: 0, transformOrigin: '50% 50%', stagger: .004, duration: .6 }, '<.4')
      .from(['.hero-kicker', '.hero-sub', '.hero-foot'], { y: 24, opacity: 0, stagger: .12, duration: 1, ease: 'power3.out' }, '-=2.2')
      .from('#nav', { yPercent: -100, opacity: 0, duration: 1, ease: 'power3.out' }, '<');

    if (!reduced) heroRings.forEach((g, i) => gsap.to(g, { rotation: (i % 2 ? -1 : 1) * 360, svgOrigin: '0 0', duration: 90 + i * 25, ease: 'none', repeat: -1 }));
    if (fine) {
      const svg = $('#mandala'), xTo = gsap.quickTo(svg, 'x', { duration: 1.2, ease: 'power3' }), yTo = gsap.quickTo(svg, 'y', { duration: 1.2, ease: 'power3' });
      $('#hero').addEventListener('pointermove', e => { xTo((e.clientX / innerWidth - .5) * -40); yTo((e.clientY / innerHeight - .5) * -40); });
    }
    if (!reduced) petals();
    proximity(heroChars);
    scenes();
  }
  intro();
})();

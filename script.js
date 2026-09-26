/* =========================================================
   THE PEARL — скрипты
   ========================================================= */

// Ссылка на беседу в Telegram — замени на свою инвайт-ссылку
const TG_LINK = 'https://t.me/';

(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PAPER = '#f1efe8';
  const INK = '#050505';
  let uidCounter = 0;
  const uid = (p) => `${p}${++uidCounter}`;

  // детерминированный рандом, чтобы гравюра была одинаковой
  function rng(seed) {
    return () => {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const f1 = (n) => Math.round(n * 10) / 10;

  /* ---------- ссылки на Telegram ---------- */
  document.querySelectorAll('[data-tg]').forEach((a) => {
    a.href = TG_LINK;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* =========================================================
     ШАР №8 (гравюра)
     ========================================================= */
  function ball8Svg() {
    const u = uid('b8');
    let hatch = '';
    for (let x = -150; x <= 150; x += 7) hatch += `M${x} -150V150`;
    return `
<svg viewBox="-100 -100 200 200" aria-hidden="true">
  <defs>
    <clipPath id="${u}c"><circle r="96"/></clipPath>
    <radialGradient id="${u}g" cx="-38" cy="-44" r="112" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="${u}m"><rect x="-100" y="-100" width="200" height="200" fill="url(#${u}g)"/></mask>
    <radialGradient id="${u}r" cx="46" cy="52" r="70" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle r="96" fill="${INK}"/>
  <g clip-path="url(#${u}c)">
    <path d="${hatch}" stroke="${PAPER}" stroke-width="1.7" transform="rotate(-35)" mask="url(#${u}m)" opacity=".6"/>
    <circle r="96" fill="url(#${u}r)"/>
    <g class="b8-win">
      <circle r="41" fill="${PAPER}"/>
      <circle r="41" fill="none" stroke="${INK}" stroke-width="1.2"/>
      <text y="3" text-anchor="middle" dominant-baseline="middle" font-family="Cormorant Garamond, Times New Roman, serif" font-weight="700" font-size="62" fill="${INK}">8</text>
    </g>
  </g>
  <circle r="96" fill="none" stroke="${PAPER}" stroke-width="1.6"/>
  <path d="M-72 30 A78 78 0 0 0 30 -72" fill="none" stroke="${PAPER}" stroke-width=".8" opacity=".35" transform="rotate(180)"/>
  <ellipse cx="-44" cy="-52" rx="17" ry="9" fill="#fff" transform="rotate(-38 -44 -52)" opacity=".92"/>
  <circle cx="-22" cy="-66" r="3" fill="#fff" opacity=".8"/>
</svg>`;
  }

  /* ---------- остальные шары (для иконок и стола) ---------- */
  // defs для шаров: штриховки и тень
  function ballDefs(p) {
    return `
    <pattern id="${p}dense" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
      <rect width="4" height="4" fill="${PAPER}"/><rect width="1.7" height="4" fill="${INK}"/>
    </pattern>
    <radialGradient id="${p}shade" cx=".36" cy=".32" r=".78">
      <stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/>
    </radialGradient>`;
  }

  // n: 0 — биток (жемчужина), 1..7 — сплошные, 8 — восьмёрка, 9..15 — полосатые
  function ballGroup(n, R, p) {
    const clip = uid('bc');
    let s = `<clipPath id="${clip}"><circle r="${R}"/></clipPath>`;
    if (n === 8) {
      s += `<circle r="${R}" fill="${INK}" stroke="${PAPER}" stroke-width="${R * .07}"/>`;
    } else if (n === 0 || n > 8) {
      s += `<circle r="${R}" fill="${PAPER}"/>`;
      if (n > 8) s += `<rect x="${-R}" y="${-R * .52}" width="${R * 2}" height="${R * 1.04}" fill="url(#${p}dense)" clip-path="url(#${clip})"/>`;
    } else {
      s += `<circle r="${R}" fill="url(#${p}dense)"/>`;
    }
    if (n !== 8) s += `<circle r="${R}" fill="url(#${p}shade)"/>`;
    if (n !== 0) {
      s += `<circle r="${R * .47}" fill="${PAPER}" stroke="${INK}" stroke-width="${R * .04}"/>`;
      s += `<text y="${R * .05}" text-anchor="middle" dominant-baseline="middle" font-family="Cormorant Garamond, Times New Roman, serif" font-weight="700" font-size="${n > 9 ? R * .52 : R * .66}" fill="${INK}">${n}</text>`;
    }
    s += `<ellipse cx="${-R * .4}" cy="${-R * .46}" rx="${R * .2}" ry="${R * .11}" fill="#fff" opacity="${n === 0 || n > 8 ? .95 : .9}" transform="rotate(-38 ${-R * .4} ${-R * .46})"/>`;
    if (n !== 8) s += `<circle r="${R}" fill="none" stroke="${INK}" stroke-width="${R * .04}"/>`;
    return s;
  }

  function ballSvg(n) {
    const p = uid('bs');
    return `<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs>${ballDefs(p)}</defs>${ballGroup(n, 47, p)}</svg>`;
  }

  /* =========================================================
     КАТАНА (процедурная гравюра)
     ========================================================= */
  function buildKatana(seed) {
    const u = uid('k');
    const R = rng(seed || 8);
    const CY = 121;
    const bx0 = 625, bx1 = 1778, TK = 0.935;
    const X = (t) => bx0 + (bx1 - bx0) * t;
    const off = (t) => -40 * t * t;
    const wid = (t) => 34 - 9 * t;
    const S = (t) => CY + off(t) - wid(t) / 2;          // обух
    const E = (t) => CY + off(t) + wid(t) / 2;          // лезвие
    const at = (t, f) => S(t) + wid(t) * f;             // линия внутри клинка
    const tip = [bx1, S(1) + 3];

    // контур клинка
    let blade = `M${X(0)} ${f1(S(0))}`;
    for (let t = 0.02; t <= 0.981; t += 0.02) blade += `L${f1(X(t))} ${f1(S(t))}`;
    blade += `Q${f1(X(.995))} ${f1(S(.995))} ${tip[0]} ${f1(tip[1])}`;
    blade += `Q${f1(X(.992))} ${f1(E(.99))} ${f1(X(TK))} ${f1(E(TK))}`;
    for (let t = TK - 0.02; t >= 0; t -= 0.02) blade += `L${f1(X(t))} ${f1(E(t))}`;
    blade += `L${X(0)} ${f1(E(0))}Z`;

    // хамон — волнистая линия закалки
    const hamonF = (t) => 0.66 + 0.07 * Math.sin(t * 74) + 0.045 * Math.sin(t * 29 + 1.3) + 0.02 * Math.sin(t * 190);
    let hamon = `M${X(0)} ${f1(at(0, hamonF(0)))}`;
    for (let t = 0.006; t <= TK; t += 0.006) hamon += `L${f1(X(t))} ${f1(at(t, hamonF(t)))}`;
    const hk = [X(TK), at(TK, hamonF(TK))];
    hamon += `Q${f1(X(.985))} ${f1(at(.985, .78))} ${f1(X(.992))} ${f1(at(.992, .42))}`;
    // закалённая кромка (область ниже хамона)
    let ha = hamon;
    ha += `L${tip[0]} ${f1(tip[1])}Q${f1(X(.992))} ${f1(E(.99))} ${f1(X(TK))} ${f1(E(TK))}`;
    for (let t = TK - 0.02; t >= 0; t -= 0.02) ha += `L${f1(X(t))} ${f1(E(t))}`;
    ha += `L${X(0)} ${f1(E(0))}Z`;

    // синоги (ребро), ёкотэ
    let ridge = `M${X(0)} ${f1(at(0, .34))}`;
    for (let t = 0.02; t <= TK; t += 0.02) ridge += `L${f1(X(t))} ${f1(at(t, .34))}`;
    ridge += `L${tip[0]} ${f1(tip[1])}`;
    const yokote = `M${f1(X(TK))} ${f1(at(TK, .34))}L${f1(X(TK) + 4)} ${f1(E(TK))}`;

    // дол (бохи)
    let hi = `M${X(0.01)} ${f1(at(0.01, .16))}`;
    for (let t = 0.03; t <= 0.72; t += 0.02) hi += `L${f1(X(t))} ${f1(at(t, .16))}`;

    // штриховка синоги-дзи (плотная, продольная)
    let hatchA = '';
    for (let i = 0; i < 9; i++) {
      const fr = 0.03 + i * 0.034;
      let t = R() * 0.05;
      while (t < TK) {
        const len = 0.05 + R() * 0.22;
        const t2 = Math.min(TK, t + len);
        hatchA += `M${f1(X(t))} ${f1(at(t, fr))}`;
        for (let tt = t + 0.03; tt < t2; tt += 0.03) hatchA += `L${f1(X(tt))} ${f1(at(tt, fr + (R() - .5) * .006))}`;
        t = t2 + 0.01 + R() * 0.04;
      }
    }
    // редкие тёмные потёки в дзи
    let hatchB = '';
    for (let i = 0; i < 26; i++) {
      const t = R() * 0.88;
      const len = 0.02 + R() * 0.09;
      const fr = 0.38 + R() * 0.2;
      hatchB += `M${f1(X(t))} ${f1(at(t, fr))}L${f1(X(t + len / 2))} ${f1(at(t + len / 2, fr + .015))}L${f1(X(t + len))} ${f1(at(t + len, fr))}`;
    }
    // диагональные «сколы» как на гравюре
    let cuts = '';
    for (let i = 0; i < 16; i++) {
      const t = 0.04 + R() * 0.85;
      const x = X(t);
      const a = at(t, R() * .3), b = at(t, .5 + R() * .35);
      cuts += `M${f1(x)} ${f1(a)}L${f1(x - 6 - R() * 16)} ${f1(b)}`;
    }

    // цуба — лепестковая гарда в ракурсе 3/4
    const tsubaPath = (cx, cy, rx, ry, k) => {
      let d = '';
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        const r = 1 + k * Math.cos(4 * a) + 0.02 * Math.cos(12 * a);
        const x = cx + Math.cos(a) * rx * r, y = cy + Math.sin(a) * ry * r;
        d += (i ? 'L' : 'M') + f1(x) + ' ' + f1(y);
      }
      return d + 'Z';
    };
    // завитки-«облака» на лице цубы
    let swirls = '';
    [[553, 58, 1], [548, 92, -1], [556, 150, 1], [549, 184, -1], [560, 205, 1], [562, 38, -1]].forEach(([sx, sy, dir]) => {
      let d = '';
      for (let i = 0; i <= 36; i++) {
        const a = (i / 36) * Math.PI * 3.2 * dir;
        const r = 12 * (1 - i / 44);
        d += (i ? 'L' : 'M') + f1(sx + Math.cos(a) * r * 0.55) + ' ' + f1(sy + Math.sin(a) * r);
      }
      swirls += d;
    });
    let tsubaHatch = '';
    for (let y = 20; y < 230; y += 4.5) tsubaHatch += `M520 ${y}L610 ${y + 26}`;

    // рукоять: ромбы оплётки
    let diamonds = '', twists = '', dots = '';
    for (let i = 0; i < 9; i++) {
      const cx = 92 + i * 49;
      diamonds += `M${cx - 21} ${CY}L${cx} ${CY - 20}L${cx + 21} ${CY}L${cx} ${CY + 20}Z`;
      const tx = cx + 24.5;
      if (i < 8) twists += `M${tx - 7} ${CY - 13}L${tx + 7} ${CY + 13}M${tx - 2} ${CY - 22}L${tx + 1} ${CY - 16}M${tx - 1} ${CY + 16}L${tx + 2} ${CY + 22}`;
      dots += `<circle cx="${cx}" cy="${CY}" r="2.4"/><circle cx="${cx - 6}" cy="${CY - 3}" r="1.2"/><circle cx="${cx + 5}" cy="${CY + 4}" r="1.3"/><circle cx="${cx + 2}" cy="${CY - 7}" r=".9"/>`;
    }
    let tsukaHatch = '';
    for (let x = 60; x < 525; x += 4) tsukaHatch += `M${x} ${CY + 8}L${x - 12} ${CY + 24}`;

    let habakiHatch = '';
    for (let x = 580; x < 624; x += 4.5) habakiHatch += `M${x} 101L${x + 8} 143`;

    // три слоя: лента (сзади, анимируется), сам меч (статичный), блик (поверх)
    const VB = '-280 -30 2080 340';
    return {
      id: u,
      svg: `
<svg class="k-rib" viewBox="${VB}" aria-hidden="true">
  <path class="k-ribbon" d="" fill="${PAPER}"/>
  <path class="k-ribbon-h" d="" stroke="${INK}" stroke-width="1.1" fill="none" opacity=".85"/>
</svg>
<svg class="k-fx" viewBox="${VB}" aria-hidden="true">
  <defs>
    <clipPath id="${u}blx"><path d="${blade}"/></clipPath>
    <linearGradient id="${u}gl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <g clip-path="url(#${u}blx)">
    <rect x="-400" y="0" width="260" height="260" fill="url(#${u}gl)" opacity=".9">
      <animate attributeName="x" values="200;2100;2100" keyTimes="0;.45;1" dur="6s" repeatCount="indefinite"/>
    </rect>
  </g>
</svg>
<svg class="k-main" viewBox="${VB}" aria-hidden="true">
  <defs>
    <clipPath id="${u}bl"><path d="${blade}"/></clipPath>
    <clipPath id="${u}ts"><rect x="60" y="98" width="462" height="46" rx="4"/></clipPath>
    <clipPath id="${u}tb"><path d="${tsubaPath(556, 120, 30, 100, .07)}"/></clipPath>
    <clipPath id="${u}hb"><path d="M576 99L626 ${f1(S(0))}L626 ${f1(E(0))}L576 143Z"/></clipPath>
    <linearGradient id="${u}tsg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".9"/>
    </linearGradient>
    <mask id="${u}tsm"><rect x="0" y="98" width="530" height="46" fill="url(#${u}tsg)"/></mask>
    <linearGradient id="${u}bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#bdbab1"/><stop offset=".35" stop-color="#e9e7e0"/><stop offset="1" stop-color="#fff"/>
    </linearGradient>
  </defs>

  <!-- касира -->
  <path d="M62 97L42 97Q22 99 22 120Q22 141 42 143L62 143Z" fill="${INK}" stroke="${PAPER}" stroke-width="2"/>
  <path d="M30 108Q36 120 30 132M40 102Q48 120 40 138M50 100Q57 120 50 140" stroke="${PAPER}" stroke-width="1.2" fill="none" opacity=".7"/>

  <!-- цука (рукоять) -->
  <rect x="60" y="98" width="462" height="46" rx="4" fill="${PAPER}"/>
  <g clip-path="url(#${u}ts)">
    <path d="${diamonds}" fill="${INK}"/>
    <g fill="${PAPER}" opacity=".85">${dots}</g>
    <path d="${twists}" stroke="${INK}" stroke-width="1.4" fill="none"/>
    <path d="${tsukaHatch}" stroke="${INK}" stroke-width="1.2" mask="url(#${u}tsm)"/>
    <path d="M60 101H522" stroke="#fff" stroke-width="2" opacity=".9"/>
  </g>
  <rect x="60" y="98" width="462" height="46" rx="4" fill="none" stroke="${INK}" stroke-width="1.5"/>

  <!-- фути -->
  <rect x="520" y="95" width="24" height="52" rx="2" fill="${INK}" stroke="${PAPER}" stroke-width="1.8"/>
  <path d="M526 100V142M532 100V142M538 100V142" stroke="${PAPER}" stroke-width=".9" opacity=".55"/>

  <!-- цуба -->
  <path d="${tsubaPath(564, 121, 30, 100, .07)}" fill="${PAPER}"/>
  <path d="${tsubaPath(556, 120, 30, 100, .07)}" fill="${INK}" stroke="${PAPER}" stroke-width="2.4"/>
  <g clip-path="url(#${u}tb)">
    <path d="${tsubaHatch}" stroke="${PAPER}" stroke-width="1" opacity=".38"/>
    <path d="${tsubaPath(556, 120, 23, 84, .06)}" fill="none" stroke="${PAPER}" stroke-width="1.2" opacity=".85"/>
    <path d="${swirls}" fill="none" stroke="${PAPER}" stroke-width="1.5" stroke-linecap="round"/>
  </g>
  <rect x="547" y="93" width="6" height="56" fill="${PAPER}"/>
  <rect x="568" y="94" width="6" height="54" fill="${PAPER}"/>

  <!-- хабаки -->
  <path d="M576 99L626 ${f1(S(0))}L626 ${f1(E(0))}L576 143Z" fill="${PAPER}"/>
  <path d="${habakiHatch}" stroke="${INK}" stroke-width="1.1" clip-path="url(#${u}hb)" opacity=".8"/>
  <path d="M576 99L626 ${f1(S(0))}L626 ${f1(E(0))}L576 143Z" fill="none" stroke="${INK}" stroke-width="1.2"/>

  <!-- клинок -->
  <path d="${blade}" fill="url(#${u}bg)"/>
  <g clip-path="url(#${u}bl)">
    <path d="${ha}" fill="#fff"/>
    <path d="${hatchA}" stroke="${INK}" stroke-width="1" fill="none" opacity=".72"/>
    <path d="${hatchB}" stroke="${INK}" stroke-width="1.6" fill="none" opacity=".4" stroke-linecap="round"/>
    <path d="${cuts}" stroke="${INK}" stroke-width="1.3" fill="none" opacity=".55" stroke-linecap="round"/>
    <path d="${hi}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>
    <path d="${ridge}" stroke="${INK}" stroke-width="1" fill="none" opacity=".7"/>
    <path d="${yokote}" stroke="${INK}" stroke-width="1" fill="none" opacity=".7"/>
    <path d="${hamon}" stroke="${INK}" stroke-width=".9" fill="none" opacity=".55"/>
  </g>
  <path d="${blade}" fill="none" stroke="${PAPER}" stroke-width="1.2"/>
</svg>`,
    };
  }

  // анимированная лента-сагэо
  function ribbonUpdater(container) {
    const body = container.querySelector('.k-ribbon');
    const hatch = container.querySelector('.k-ribbon-h');
    let lastT = -1;
    return (time, wind = 1) => {
      if (time - lastT < 32 && lastT >= 0) return;   // ~30 fps достаточно для ткани
      lastT = time;
      const ph = time * 0.0022;
      const N = 44;
      const top = [], bot = [];
      let h = '';
      for (let i = 0; i <= N; i++) {
        const q = i / N;
        const x = 34 - q * 290;
        const y = 138 + 96 * q * q + Math.sin(q * 6.4 - ph) * 26 * q * wind + Math.sin(q * 13 - ph * 1.7) * 5 * q;
        const w = Math.max(2.5, (17 - 6 * q) * Math.abs(Math.cos(q * 4.6 - ph * 0.8)));
        top.push([x, y - w / 2]);
        bot.push([x, y + w / 2]);
        if (i % 2 === 0 && w > 5) h += `M${f1(x)} ${f1(y - w / 2 + 1)}L${f1(x - 3)} ${f1(y + w / 2 - 1)}`;
      }
      let d = `M${f1(top[0][0])} ${f1(top[0][1])}`;
      for (let i = 1; i <= N; i++) d += `L${f1(top[i][0])} ${f1(top[i][1])}`;
      for (let i = N; i >= 0; i--) d += `L${f1(bot[i][0])} ${f1(bot[i][1])}`;
      body.setAttribute('d', d + 'Z');
      hatch.setAttribute('d', h);
    };
  }

  /* ---------- рендер шаров на странице ---------- */
  document.querySelectorAll('[data-ball8]').forEach((el) => { el.innerHTML = ball8Svg(); });
  document.querySelectorAll('[data-ball]').forEach((el) => { el.innerHTML = ballSvg(+el.dataset.ball); });

  // интро: одинаковое содержимое в обеих половинах
  const intro = document.getElementById('intro');
  const tpl = document.getElementById('introTpl');
  intro.querySelectorAll('.intro-inner').forEach((inner) => {
    inner.appendChild(tpl.content.cloneNode(true));
    inner.querySelectorAll('[data-ball8]').forEach((el) => { el.innerHTML = ball8Svg(); });
  });

  // катаны
  const heroK = document.getElementById('heroKatana');
  const introBladeEl = document.getElementById('introBlade');
  heroK.innerHTML = buildKatana(8).svg;
  introBladeEl.innerHTML = buildKatana(88).svg;
  const heroRibbon = ribbonUpdater(heroK);
  const introRibbon = ribbonUpdater(introBladeEl);
  heroRibbon(0); introRibbon(0);

  /* =========================================================
     ИНТРО: удар на весь экран
     ========================================================= */
  const introTop = intro.querySelector('.intro-top');
  const introBot = intro.querySelector('.intro-bot');
  const introCut = document.getElementById('introCut');
  const ANG = -28 * Math.PI / 180;
  let introRunning = false;
  let skipIntro = false;

  const easeInOutCubic = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const easeInOutQuart = (k) => (k < .5 ? 8 * k * k * k * k : 1 - Math.pow(-2 * k + 2, 4) / 2);
  const easeOutExpo = (k) => (k === 1 ? 1 : 1 - Math.pow(2, -10 * k));
  // каждый запуск интро получает свой номер: пропуск или повтор гасит старую цепочку
  let introRun = 0;
  const cancelled = (run) => run !== introRun || skipIntro;
  const wait = (ms, run) => new Promise((r) => { const t0 = performance.now(); const f = (n) => { if (cancelled(run) || n - t0 >= ms) r(); else requestAnimationFrame(f); }; requestAnimationFrame(f); });
  const tween = (ms, ease, fn, run) => new Promise((r) => {
    const t0 = performance.now();
    const f = (n) => {
      if (cancelled(run)) { r(); return; }
      const k = Math.min(1, (n - t0) / ms);
      fn(ease(k), n);
      if (k < 1) requestAnimationFrame(f); else r();
    };
    requestAnimationFrame(f);
  });

  function setCutClip() {
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2;
    const tn = Math.tan(-ANG);
    const y0 = cy + tn * cx, y1 = cy - tn * (W - cx);
    introTop.style.clipPath = `polygon(0 0, ${W}px 0, ${W}px ${y1}px, 0 ${y0}px)`;
    introBot.style.clipPath = `polygon(0 ${y0}px, ${W}px ${y1}px, ${W}px ${H}px, 0 ${H}px)`;
  }

  function resetIntro() {
    intro.classList.remove('is-done', 'is-on');
    intro.style.animation = 'none';
    intro.style.opacity = '';
    introTop.style.transform = introBot.style.transform = '';
    introCut.style.opacity = '';
    introCut.style.transform = 'rotate(-28deg) scaleX(0)';
    introBladeEl.style.transform = 'translate(-50%, -50%) rotate(-28deg) translateX(-200vmax)';
    setCutClip();
  }

  function finishIntro() {
    intro.classList.add('is-done');
    root.classList.remove('intro-lock');
    root.classList.add('is-ready');
    introRunning = false;
  }

  async function playIntro() {
    if (introRunning) return;
    introRunning = true;
    skipIntro = false;
    const run = ++introRun;
    resetIntro();
    root.classList.add('intro-lock');
    void intro.offsetWidth;
    intro.classList.add('is-on');

    await wait(1250, run);
    if (cancelled(run)) return;

    // клинок пролетает по диагонали, за остриём остаётся разрез
    const vmax = Math.max(innerWidth, innerHeight) / 100;
    const bladeW = 130 * vmax;
    const cutL = 260 * vmax;
    const from = -200 * vmax, to = 200 * vmax;
    const ty = bladeW * (68.5 / 2080);   // острие ровно по линии разреза
    await tween(620, easeInOutCubic, (k, now) => {
      const d = from + (to - from) * k;
      introBladeEl.style.transform = `translate(-50%, -50%) rotate(-28deg) translateX(${d}px) translateY(${ty}px)`;
      const tipPos = d + bladeW * 0.49;
      const sc = Math.max(0, Math.min(1, (tipPos + cutL / 2) / cutL));
      // левый край линии закреплён, правый следует за остриём
      introCut.style.transform = `rotate(-28deg) translateX(${-(1 - sc) * cutL / 2}px) scaleX(${sc})`;
      introRibbon(now, 2.2);
    }, run);
    if (cancelled(run)) return;
    introCut.style.transform = 'rotate(-28deg) scaleX(1)';

    // короткая дрожь от удара
    await tween(220, (k) => k, (k) => {
      const s = (1 - k) * 6;
      const jx = (Math.random() - .5) * s, jy = (Math.random() - .5) * s;
      introTop.style.transform = introBot.style.transform = `translate(${jx}px, ${jy}px)`;
    }, run);
    await wait(120, run);
    if (cancelled(run)) return;

    // половинки разъезжаются вдоль и поперёк разреза
    const dx = Math.cos(ANG), dy = Math.sin(ANG);         // вдоль линии (вверх-вправо)
    const nx = Math.sin(ANG), ny = -Math.cos(ANG);        // нормаль вверх
    const push = Math.hypot(innerWidth, innerHeight) * 0.75;
    let started = false;
    await tween(1150, easeInOutQuart, (k) => {
      const slide = 70 * k, sep = push * k;
      introTop.style.transform = `translate(${dx * slide + nx * sep}px, ${dy * slide + ny * sep}px) rotate(${-2.5 * k}deg)`;
      introBot.style.transform = `translate(${-dx * slide - nx * sep}px, ${-dy * slide - ny * sep}px) rotate(${-2.5 * k}deg)`;
      introCut.style.opacity = String(1 - Math.min(1, k * 2.4));
      if (!started && k > 0.18) { started = true; root.classList.add('is-ready'); heroDraw(); }
    }, run);
    if (cancelled(run)) return;
    finishIntro();
    if (!started) heroDraw();
  }

  const skip = () => { if (introRunning) { skipIntro = true; finishIntro(); heroDraw(); } };
  intro.addEventListener('click', skip);
  addEventListener('keydown', (e) => { if (introRunning && (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); skip(); } });
  addEventListener('resize', () => { if (introRunning) setCutClip(); });

  document.getElementById('replayIntro').addEventListener('click', () => {
    scrollTo({ top: 0, behavior: 'instant' });
    heroDrawn = 0;
    playIntro();
  });

  /* =========================================================
     HERO: катана, параллакс, лента
     ========================================================= */
  let heroDrawn = 0;       // 0..1 прогресс «выхода» клинка
  let heroDrawStart = 0;
  function heroDraw(instant) {
    if (instant || reduceMotion) { heroDrawn = 1; return; }
    heroDrawStart = performance.now();
    heroDrawn = 0.0001;
  }

  const mouse = { x: innerWidth / 2, y: innerHeight / 2, tx: 0, ty: 0, sx: 0, sy: 0, active: false };
  addEventListener('pointermove', (e) => {
    mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
    mouse.tx = (e.clientX / innerWidth - .5);
    mouse.ty = (e.clientY / innerHeight - .5);
  }, { passive: true });

  // размеры кэшируем, чтобы не дёргать раскладку каждый кадр
  const metrics = { vw: innerWidth, vh: innerHeight, kw: heroK.offsetWidth, docMax: 1 };
  function measure() {
    metrics.vw = innerWidth;
    metrics.vh = innerHeight;
    metrics.kw = heroK.offsetWidth;
    metrics.docMax = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  }
  addEventListener('resize', measure);
  addEventListener('load', measure);
  new ResizeObserver(measure).observe(document.body);

  function heroFrame(now, sy) {
    const { vw, vh, kw } = metrics;
    mouse.sx += (mouse.tx - mouse.sx) * 0.05;
    mouse.sy += (mouse.ty - mouse.sy) * 0.05;
    if (sy > vh * 1.3) return;                       // hero вне экрана — не тратим кадры

    let drawK = 1;
    if (heroDrawn > 0 && heroDrawn < 1) {
      heroDrawn = Math.min(1, (now - heroDrawStart) / 1500);
      drawK = easeOutExpo(heroDrawn);
    } else if (heroDrawn === 0) drawK = 0;

    const baseAng = vh > vw * 1.15 ? 122 : 152;       // на телефоне клинок круче, как на картинке
    const sc = Math.min(sy, vh * 1.2);
    const kx = -(1 - drawK) * kw * 0.55 + sc * 0.45 - mouse.sx * 30;
    const rot = baseAng + mouse.sy * 2.5 + sc * 0.008;
    heroK.style.transform = `translate(-50%, -50%) rotate(${rot.toFixed(3)}deg) scaleY(-1) translateX(${kx.toFixed(1)}px)`;
    heroK.style.opacity = drawK;
    heroRibbon(now, 1);
  }

  /* =========================================================
     ШАР 8 «смотрит» на курсор
     ========================================================= */
  const lookers = [...document.querySelectorAll('[data-ball8]')]
    .map((el) => ({ el, win: el.querySelector('.b8-win'), m: 0, a: 0, r: null, look: el.hasAttribute('data-look') || el.classList.contains('nav-ball') }))
    .filter((b) => b.win && b.look);

  function lookRead() {
    for (const b of lookers) b.r = b.el.getBoundingClientRect();
  }
  function lookWrite(now) {
    for (const b of lookers) {
      const r = b.r;
      if (!r || r.bottom < -50 || r.top > metrics.vh + 50) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let px = mouse.x, py = mouse.y;
      if (!mouse.active) { // на тач-устройствах шар плавно «блуждает»
        px = cx + Math.cos(now * 0.0007) * r.width;
        py = cy + Math.sin(now * 0.0011) * r.height * 0.8;
      }
      const vx = px - cx, vy = py - cy;
      const tm = Math.min(1, Math.hypot(vx, vy) / (r.width * 1.6 + 120));
      const ta = Math.atan2(vy, vx);
      b.m += (tm - b.m) * 0.08;
      let da = ta - b.a; da = Math.atan2(Math.sin(da), Math.cos(da));
      b.a += da * 0.1;
      const ox = Math.cos(b.a) * b.m * 38, oy = Math.sin(b.a) * b.m * 38;
      const deg = b.a * 180 / Math.PI;
      b.win.setAttribute('transform', `translate(${f1(ox)} ${f1(oy)}) rotate(${f1(deg)}) scale(${(1 - 0.32 * b.m).toFixed(3)} 1) rotate(${f1(-deg)})`);
    }
  }

  /* ---------- боковая линия-прогресс ---------- */
  const railBall = document.getElementById('railBall');
  function railFrame(sy) {
    const p = Math.min(1, sy / metrics.docMax);
    railBall.style.transform = `translateY(${(p * (metrics.vh * 0.34 - 11)).toFixed(1)}px)`;
  }

  function loop(now) {
    // сначала все чтения, потом записи
    const sy = scrollY;
    lookRead();
    heroFrame(now, sy);
    lookWrite(now);
    railFrame(sy);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* =========================================================
     REVEAL при скролле
     ========================================================= */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-reveal], .slash').forEach((el) => io.observe(el));

  /* =========================================================
     БЕСЕДА: переписка появляется по очереди
     ========================================================= */
  const tgBody = document.getElementById('tgBody');
  const tgStatus = document.getElementById('tgStatus');
  const people = {
    'Мира': { i: 'М', cls: 'is-solid' },
    'Тимур': { i: 'Т', cls: 'is-hatch' },
    'Лёня': { i: 'Л', cls: '' },
    'Вика': { i: 'В', cls: 'is-solid' },
  };
  const script = [
    ['Мира', 'кто сегодня на бильярд? 🎱', '19:02'],
    ['Тимур', 'я. беру кий и плохое настроение — верну хорошим', '19:03'],
    ['Лёня', 'в восемь у входа. опоздавшие ставят чай', '19:05'],
    ['Мира', 'у нас новенькие, не пугайте их 🤍', '19:06'],
    ['Вика', 'привет! можно с вами?', '19:08'],
    ['Тимур', 'нужно. добро пожаловать в семью', '19:08'],
    [null, 'и я иду 🎱', '19:09'],
  ];
  // эмодзи 🎱 заменяем на свой ч/б шарик, чтобы не было цвета
  const esc = (s) => s
    .replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
    .replace(/🎱/g, '<i class="e8" aria-label="шар восемь"></i>');
  const ava = (p) => `<span class="msg-ava ${p.cls}"><b>${p.i}</b></span>`;
  function msgHtml(who, text, time) {
    if (!who) return `<div class="msg is-me"><div class="msg-bubble">${esc(text)}<span class="msg-time">${time}</span></div></div>`;
    const p = people[who];
    return `<div class="msg">${ava(p)}<div class="msg-bubble"><span class="msg-name">${who}</span>${esc(text)}<span class="msg-time">${time}</span></div></div>`;
  }
  let chatPlayed = false;
  async function playChat() {
    if (chatPlayed) return;
    chatPlayed = true;
    for (const [who, text, time] of script) {
      if (reduceMotion) { tgBody.insertAdjacentHTML('beforeend', msgHtml(who, text, time)); continue; }
      if (who) {
        const p = people[who];
        tgStatus.textContent = `${who} печатает…`;
        tgBody.insertAdjacentHTML('beforeend', `<div class="msg msg-typing">${ava(p)}<div class="msg-bubble"><i></i><i></i><i></i></div></div>`);
        await new Promise((r) => setTimeout(r, 700 + text.length * 18));
        tgBody.lastElementChild.remove();
      } else {
        await new Promise((r) => setTimeout(r, 700));
      }
      tgBody.insertAdjacentHTML('beforeend', msgHtml(who, text, time));
      tgStatus.textContent = 'беседа';
      await new Promise((r) => setTimeout(r, 450));
    }
  }
  new IntersectionObserver((entries, obs) => {
    if (entries.some((e) => e.isIntersecting)) { playChat(); obs.disconnect(); }
  }, { threshold: 0.35 }).observe(document.querySelector('.tg'));

  /* =========================================================
     СЕМЬЯ: бильярдный стол
     ========================================================= */
  (function table() {
    const svg = document.getElementById('table');
    const NS = 'http://www.w3.org/2000/svg';
    const W = 1000, H = 560, M = 48, BR = 19;
    const minX = M + BR, maxX = W - M - BR, minY = M + BR, maxY = H - M - BR;
    const pockets = [[M + 2, M + 2], [W / 2, M - 6], [W - M - 2, M + 2], [M + 2, H - M - 2], [W / 2, H - M + 6], [W - M - 2, H - M - 2]];
    const CAPTURE = 27;
    const p = uid('tb');
    const status = document.getElementById('tableStatus');
    const DEFAULT_MSG = 'Кликни по столу — ударь битком';

    // стол
    let felt = '';
    for (let y = M + 6; y < H - M; y += 9) felt += `M${M} ${y}H${W - M}`;
    let rails = '';
    for (let i = -H; i < W + H; i += 7) rails += `M${i} 0L${i + H} ${H}`;
    const sights = [];
    [1, 2, 3, 5, 6, 7].forEach((k) => { sights.push([M + (W - 2 * M) * k / 8, M / 2 - 1]); sights.push([M + (W - 2 * M) * k / 8, H - M / 2 + 1]); });
    [1, 2, 3].forEach((k) => { sights.push([M / 2 - 1, M + (H - 2 * M) * k / 4]); sights.push([W - M / 2 + 1, M + (H - 2 * M) * k / 4]); });

    svg.innerHTML = `
      <defs>${ballDefs(p)}
        <clipPath id="${p}rail"><path fill-rule="evenodd" d="M0 0H${W}V${H}H0Z M${M} ${M}V${H - M}H${W - M}V${M}Z"/></clipPath>
        <radialGradient id="${p}lamp" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      </defs>
      <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="26" fill="${INK}" stroke="${PAPER}" stroke-width="1.5"/>
      <g clip-path="url(#${p}rail)"><path d="${rails}" stroke="${PAPER}" stroke-width="1" opacity=".22"/></g>
      <rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="#080808" stroke="${PAPER}" stroke-width="1.5"/>
      <path d="${felt}" stroke="${PAPER}" stroke-width=".6" opacity=".05"/>
      <rect x="${M}" y="${M}" width="${W - 2 * M}" height="${H - 2 * M}" fill="url(#${p}lamp)"/>
      <line x1="${M + (W - 2 * M) * .25}" y1="${M}" x2="${M + (W - 2 * M) * .25}" y2="${H - M}" stroke="${PAPER}" stroke-width=".8" opacity=".18" stroke-dasharray="3 6"/>
      <circle cx="${M + (W - 2 * M) * .75}" cy="${H / 2}" r="3" fill="${PAPER}" opacity=".35"/>
      ${sights.map(([x, y]) => `<path d="M${x} ${y - 4}L${x + 4} ${y}L${x} ${y + 4}L${x - 4} ${y}Z" fill="${PAPER}"/>`).join('')}
      ${pockets.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="25" fill="#000" stroke="${PAPER}" stroke-width="1.5"/><circle cx="${x}" cy="${y}" r="17" fill="none" stroke="${PAPER}" stroke-width=".6" opacity=".35"/>`).join('')}
      <text x="${W / 2}" y="${H / 2}" text-anchor="middle" dominant-baseline="central" font-family="Noto Serif JP, serif" font-weight="900" font-size="150" letter-spacing="30" fill="${PAPER}" opacity=".045">真珠</text>
      <g id="${p}aim" style="display:none">
        <line id="${p}aimLine" stroke="${PAPER}" stroke-width="1.2" stroke-dasharray="4 7" opacity=".7"/>
        <circle id="${p}ghost" r="${BR}" fill="none" stroke="${PAPER}" stroke-width="1" stroke-dasharray="3 4" opacity=".6"/>
        <g id="${p}cue">
          <rect x="${BR + 6}" y="-4" width="460" height="8" rx="4" fill="${PAPER}"/>
          <rect x="${BR + 6}" y="-4" width="12" height="8" rx="3" fill="#8f8c84"/>
          <rect x="${BR + 300}" y="-5" width="166" height="10" rx="5" fill="${INK}" stroke="${PAPER}" stroke-width="1.2"/>
          <path d="M${BR + 312} -5V5M${BR + 322} -5V5M${BR + 332} -5V5" stroke="${PAPER}" stroke-width="1" opacity=".6"/>
        </g>
      </g>
      <g id="${p}balls"></g>
    `;
    const layer = svg.querySelector(`#${p}balls`);
    const aim = svg.querySelector(`#${p}aim`);
    const aimLine = svg.querySelector(`#${p}aimLine`);
    const ghost = svg.querySelector(`#${p}ghost`);
    const cueStick = svg.querySelector(`#${p}cue`);

    // пирамида: 8 в центре третьего ряда
    const rack = [[1], [9, 2], [10, 8, 3], [11, 7, 14, 4], [5, 13, 15, 6, 12]];
    const apexX = M + (W - 2 * M) * .75 - 34, apexY = H / 2;
    const CUE_START = [M + (W - 2 * M) * .25, H / 2];
    const balls = [];

    function makeBall(n) {
      const g = document.createElementNS(NS, 'g');
      g.innerHTML = ballGroup(n, BR, p);
      layer.appendChild(g);
      return { n, g, x: 0, y: 0, vx: 0, vy: 0, in: false, sink: 0, sx: 0, sy: 0 };
    }
    const cue = makeBall(0);
    balls.push(cue);
    rack.forEach((row) => row.forEach((n) => balls.push(makeBall(n))));

    function doRack() {
      const gap = BR * 2 + 0.6;
      let k = 1;
      rack.forEach((row, ri) => {
        row.forEach((n, i) => {
          const b = balls[k++];
          b.x = apexX + ri * gap * Math.sqrt(3) / 2;
          b.y = apexY + (i - (row.length - 1) / 2) * gap;
          b.vx = b.vy = 0; b.in = false; b.sink = 0;
          b.g.style.opacity = '';
        });
      });
      cue.x = CUE_START[0]; cue.y = CUE_START[1]; cue.vx = cue.vy = 0; cue.in = false; cue.sink = 0; cue.g.style.opacity = '';
      render();
      status.textContent = DEFAULT_MSG;
      eightDown = false;
    }

    function render() {
      for (const b of balls) {
        if (b.in && b.sink >= 1) { b.g.style.opacity = '0'; continue; }
        if (b.in) {
          const s = 1 - b.sink * 0.6;
          b.g.setAttribute('transform', `translate(${f1(b.x)} ${f1(b.y)}) scale(${s.toFixed(3)})`);
          b.g.style.opacity = String(1 - b.sink);
        } else {
          b.g.setAttribute('transform', `translate(${f1(b.x)} ${f1(b.y)})`);
        }
      }
    }

    let running = false;
    let last = 0;
    let eightDown = false;
    const moving = () => balls.some((b) => (!b.in && (b.vx || b.vy)) || (b.in && b.sink < 1));

    function potted() { return balls.filter((b) => b.in && b.n !== 0).length; }

    function step(dt) {
      const live = balls.filter((b) => !b.in);
      for (const b of live) {
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < minX) { b.x = minX; b.vx = -b.vx * 0.78; }
        if (b.x > maxX) { b.x = maxX; b.vx = -b.vx * 0.78; }
        if (b.y < minY) { b.y = minY; b.vy = -b.vy * 0.78; }
        if (b.y > maxY) { b.y = maxY; b.vy = -b.vy * 0.78; }
      }
      for (let i = 0; i < live.length; i++) {
        for (let j = i + 1; j < live.length; j++) {
          const a = live[i], c = live[j];
          const dx = c.x - a.x, dy = c.y - a.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < 4 * BR * BR) {
            const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
            const ov = (2 * BR - d) / 2;
            a.x -= nx * ov; a.y -= ny * ov; c.x += nx * ov; c.y += ny * ov;
            const rel = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny;
            if (rel > 0) {
              const imp = rel * 0.97;
              a.vx -= imp * nx; a.vy -= imp * ny; c.vx += imp * nx; c.vy += imp * ny;
            }
          }
        }
      }
      for (const b of live) {
        const sp = Math.hypot(b.vx, b.vy);
        if (sp > 0) {
          const ns = Math.max(0, sp * Math.exp(-0.9 * dt) - 90 * dt);
          if (ns < 4) { b.vx = b.vy = 0; } else { b.vx *= ns / sp; b.vy *= ns / sp; }
        }
        for (const [px, py] of pockets) {
          if (Math.hypot(b.x - px, b.y - py) < CAPTURE) {
            b.in = true; b.sink = 0; b.sx = px; b.sy = py; b.vx = b.vy = 0;
            onPot(b);
            break;
          }
        }
      }
      for (const b of balls) {
        if (b.in && b.sink < 1) {
          b.sink = Math.min(1, b.sink + dt * 4);
          b.x += (b.sx - b.x) * Math.min(1, dt * 14);
          b.y += (b.sy - b.y) * Math.min(1, dt * 14);
        }
      }
    }

    function onPot(b) {
      if (b.n === 8) {
        eightDown = true;
        status.textContent = potted() >= 15
          ? 'Чисто! Восьмёрка — последней, как положено. Твой ход: вступай в беседу.'
          : 'Восьмёрка ушла раньше времени. Бывает — жми «Собрать».';
      } else if (b.n === 0) {
        status.textContent = 'Биток в лузе — вернём его на место.';
      } else if (!eightDown) {
        status.textContent = `В лузах: ${potted()} из 15`;
      }
    }

    function respawnCue() {
      if (!cue.in) return;
      let x = CUE_START[0], y = CUE_START[1];
      const free = (x, y) => balls.every((b) => b === cue || b.in || Math.hypot(b.x - x, b.y - y) > BR * 2.2);
      let tries = 0;
      while (!free(x, y) && tries++ < 40) { y = CUE_START[1] + ((tries % 2) ? 1 : -1) * Math.ceil(tries / 2) * BR * 2.3; y = Math.max(minY, Math.min(maxY, y)); }
      cue.x = x; cue.y = y; cue.in = false; cue.sink = 0; cue.g.style.opacity = '';
    }

    function frame(now) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const SUB = 6;
      for (let i = 0; i < SUB; i++) step(dt / SUB);
      render();
      if (moving()) requestAnimationFrame(frame);
      else { running = false; respawnCue(); render(); }
    }
    function run() {
      if (running) return;
      running = true;
      last = performance.now();
      requestAnimationFrame(frame);
    }

    function toSvg(e) {
      const pt = svg.createSVGPoint();
      pt.x = e.clientX; pt.y = e.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    function shoot(tx, ty, power) {
      if (running || cue.in) return;
      const dx = tx - cue.x, dy = ty - cue.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = power || Math.max(420, Math.min(2600, d * 4.2));
      cue.vx = dx / d * sp; cue.vy = dy / d * sp;
      aim.style.display = 'none';
      if (!eightDown && potted() === 0) status.textContent = 'Хороший удар.';
      run();
    }

    svg.addEventListener('pointermove', (e) => {
      if (running || cue.in || e.pointerType === 'touch') { aim.style.display = 'none'; return; }
      const pt = toSvg(e);
      const dx = pt.x - cue.x, dy = pt.y - cue.y;
      const d = Math.hypot(dx, dy);
      if (d < BR) { aim.style.display = 'none'; return; }
      aim.style.display = '';
      aimLine.setAttribute('x1', cue.x); aimLine.setAttribute('y1', cue.y);
      aimLine.setAttribute('x2', pt.x); aimLine.setAttribute('y2', pt.y);
      ghost.setAttribute('cx', pt.x); ghost.setAttribute('cy', pt.y);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI + 180;
      const pull = Math.min(60, d * 0.08);
      cueStick.setAttribute('transform', `translate(${f1(cue.x)} ${f1(cue.y)}) rotate(${f1(ang)}) translate(${f1(pull)} 0)`);
    });
    svg.addEventListener('pointerleave', () => { aim.style.display = 'none'; });
    svg.addEventListener('click', (e) => { const pt = toSvg(e); shoot(pt.x, pt.y); });

    document.getElementById('btnBreak').addEventListener('click', () => {
      if (running) return;
      if (potted() > 0 || eightDown || cue.x !== CUE_START[0] || cue.y !== CUE_START[1]) doRack();
      shoot(apexX, apexY + (Math.random() - .5) * 4, 2700);
    });
    document.getElementById('btnRack').addEventListener('click', () => { if (!running) doRack(); });

    doRack();
  })();

  /* =========================================================
     СТАРТ
     ========================================================= */
  if (reduceMotion) {
    finishIntro();
    heroDraw(true);
  } else {
    playIntro();
  }
})();

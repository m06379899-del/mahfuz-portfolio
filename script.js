/* Mahfuz Ahmed – portfolio script.
   Change your details in CONTENT only. Goo button: Venom Button by exteestudio (MIT), see collab/LICENSE. */
const CONTENT = {
  name: "Mahfuz Ahmed",
  role: "Student",
  year: "2026",
  tagline: "A curious mind, driven by technology, creativity, and the ambition to build something extraordinary.",
  strap: "CODE • CREATE • BUILD • MAHFUZ AHMED • ",
  skills: ["Programming", "Web Development", "Problem Solving", "Artificial Intelligence", "UI/UX Design", "Innovation"],
  tools: ["VS Code", "Python", "HTML", "CSS", "JavaScript", "GitHub", "Termux"],
  projectsNote: "Projects I am building right now. Repository and demo links will be added when they are ready.",
  projects: [
    { title: "Student Learning Platform", status: "In Development", art: "dash",
      desc: "An AI-powered educational platform for students featuring textbook PDF question answering, MCQs, notices, bookmarks, and progress tracking.",
      tech: ["AI", "PDF Q&A", "MCQs", "Notices", "Bookmarks", "Progress tracking"], link: "https://sohojshekha.netlify.app/", linkText: "Live Demo ↗" },
    { title: "QuizRun", status: "In Development", art: "runner",
      desc: "An AI-powered educational endless runner game where students learn through MCQ questions generated from uploaded PDFs.",
      tech: ["AI", "PDF upload", "MCQ", "Game"], link: "", linkText: "" },
    { title: "JARVIS", status: "In Development", art: "voice",
      desc: "A Python-based AI voice assistant with Gemini API integration, voice input, voice output, and SQLite memory.",
      tech: ["Python", "Gemini API", "SQLite", "Voice input", "Voice output"], link: "", linkText: "" }
  ],
  steps: [
    { t: "Idea", d: "Spot a problem worth solving." },
    { t: "Plan & design", d: "Sketch the screens and pick the tools." },
    { t: "Build & test", d: "Write the code, run it, fix what breaks." },
    { t: "Polish & share", d: "Refine the details, then publish it." }
  ],
  aboutTitle: "I turn ideas into things that work.",
  about: "I am a student passionate about technology, programming, and innovation. I enjoy exploring new ideas, learning new skills, and solving problems through creativity and technology. My goal is to become a successful software engineer and build meaningful digital solutions that make a difference in the world.",
  strengths: ["Problem Solving", "Creativity", "Fast Learner"],
  contactTitle: "Let’s build something great together.",
  email: "m06379899@gmail.com",
  whatsapp: "+8801918828694",
  socials: [
    { name: "Facebook", url: "https://www.facebook.com/mahfuj.ahmed.52331", icon: "facebook" },
    { name: "Instagram", url: "https://www.instagram.com/lwlt9899/", icon: "instagram" },
    { name: "GitHub", url: "https://github.com/m06379899-del", icon: "github" },
    { name: "YouTube", url: "https://www.youtube.com/@Mahfuz-p8f", icon: "youtube" }
  ],
  goo: "Let’s Connect",
  goo3d: false,  /* false = light glossy button (safe). true = heavy 3D goo button, needs a good graphics card */
  env: true,     /* true = 3D particle environment behind the site. false = switch it off */
  tilt: { card: 0.5, env: 1 },  /* phone-tilt strength, set separately: 1 = normal, 0 = off, 1.5 = stronger (max 2). 0.5 = subtle, realistic card swing */
  sound: { files: {} }        /* sounds are built in. To use your own file for one sound: { click: "assets/sounds/click.mp3" } */
};

/* =====================================================================
   ONE shared device-orientation system.
   The ID card and the 3D environment both subscribe to it, so the browser has a
   single deviceorientation listener and there is a single permission flow.
   Each subscriber keeps its own baseline, mapping and strength (CONTENT.tilt).
   ===================================================================== */
const Orient = (() => {
  const DOE = window.DeviceOrientationEvent;
  const needsPermission = !!(DOE && typeof DOE.requestPermission === 'function');   /* iPhone / iPad */
  const subs = new Set(), watchers = new Set();
  let state = !DOE ? 'unsupported' : needsPermission ? 'prompt' : 'granted', listening = false, pending = null;
  const notify = () => watchers.forEach(fn => fn(state));
  const onEvt = e => {
    if (e.beta == null || e.gamma == null) return;
    if (state === 'prompt') { state = 'granted'; notify(); }      /* events are flowing, so motion was already allowed */
    subs.forEach(fn => fn(e.beta, e.gamma));
  };
  const sync = () => {                                            /* listener only while someone needs it and the tab is visible */
    const want = (state === 'granted' || state === 'prompt') && subs.size > 0 && !document.hidden;
    if (want && !listening) { listening = true; addEventListener('deviceorientation', onEvt, { passive: true }); }
    else if (!want && listening) { listening = false; removeEventListener('deviceorientation', onEvt); }
  };
  document.addEventListener('visibilitychange', sync);
  function request() {                                            /* never called automatically: only from a tap */
    if (state !== 'prompt') return Promise.resolve(state);
    if (pending) return pending;
    let p; try { p = Promise.resolve(DOE.requestPermission()); } catch (e) { p = Promise.reject(e); }
    pending = p.then(r => { state = r === 'granted' ? 'granted' : 'denied'; }, () => { state = 'denied'; })
      .then(() => { pending = null; sync(); notify(); return state; });
    return pending;
  }
  return {
    supported: !!DOE, needsPermission, get state() { return state; }, request,
    watch: fn => { watchers.add(fn); },
    subscribe(fn) { subs.add(fn); sync(); return () => { subs.delete(fn); sync(); }; },
    info: () => ({ state, subscribers: subs.size, listening })
  };
})();

(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const C = CONTENT, clamp = (v, a, b) => Math.min(b, Math.max(a, v)), lerp = (a, b, t) => a + (b - a) * t;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
const safe = fn => { try { return fn(); } catch (e) {} };
const h = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

/* ---------- fill the page from CONTENT ---------- */
$$('[data-c]').forEach(el => { el.textContent = C[el.dataset.c] ?? ''; });
$('#card-id').textContent = `ID · ${C.year} · MA-01`;
$('#foot').textContent = `© ${C.year} ${C.name}`;
C.tools.forEach(t => $('#tools').append(h('li', '', t)));
for (let i = 0; i < 4; i++) C.skills.forEach(s => $('#strip').append(h('span', '', s)));
C.strengths.forEach(s => $('#strengths').append(h('li', '', s)));
C.steps.forEach(s => { const li = h('li'); li.append(h('b', '', s.t), h('p', '', s.d)); $('#steps').append(li); });
const ART = {
  runner: '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><line class="m" x1="0" y1="142" x2="320" y2="142"/><circle class="af" cx="77" cy="92" r="9"/><rect class="af" x="64" y="104" width="26" height="38" rx="7"/><path class="m" d="M100 118q16-40 34 0" stroke-dasharray="3 5"/><rect class="mf" x="196" y="118" width="22" height="24" rx="4"/><rect class="mf" x="252" y="124" width="18" height="18" rx="4"/><g class="o"><rect x="168" y="26" width="62" height="26" rx="8"/><rect x="238" y="26" width="62" height="26" rx="8"/><rect x="168" y="60" width="62" height="26" rx="8"/><rect x="238" y="60" width="62" height="26" rx="8"/></g><text x="192" y="43">A</text><text x="262" y="43">B</text><text x="192" y="77">C</text><text x="262" y="77">D</text></svg>',
  voice: '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="af"><rect x="54" y="80" width="10" height="20" rx="5"/><rect x="72" y="66" width="10" height="48" rx="5"/><rect x="90" y="50" width="10" height="80" rx="5"/><rect x="108" y="70" width="10" height="40" rx="5"/><rect x="126" y="36" width="10" height="108" rx="5"/><rect x="144" y="60" width="10" height="60" rx="5"/><rect x="162" y="76" width="10" height="28" rx="5"/><rect x="180" y="52" width="10" height="76" rx="5"/><rect x="198" y="68" width="10" height="44" rx="5"/><rect x="216" y="82" width="10" height="16" rx="5"/><rect x="234" y="62" width="10" height="56" rx="5"/><rect x="252" y="78" width="10" height="24" rx="5"/></g><text x="54" y="162">$ jarvis --listen</text></svg>',
  dash: '<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g class="o"><rect x="40" y="26" width="108" height="128" rx="10"/><rect x="166" y="26" width="114" height="56" rx="10"/><rect x="166" y="94" width="114" height="60" rx="10"/></g><path class="af" d="M130 26h10v26l-5-4-5 4z"/><g class="mf"><rect x="54" y="48" width="70" height="6" rx="3"/><rect x="54" y="64" width="80" height="6" rx="3"/><rect x="54" y="80" width="62" height="6" rx="3"/><rect x="54" y="96" width="76" height="6" rx="3"/><rect x="54" y="112" width="52" height="6" rx="3"/></g><rect class="mf" x="180" y="48" width="86" height="8" rx="4"/><rect class="af" x="180" y="48" width="58" height="8" rx="4"/><rect class="mf" x="180" y="64" width="86" height="8" rx="4"/><rect class="af" x="180" y="64" width="34" height="8" rx="4"/><circle class="af" cx="190" cy="124" r="6"/><circle class="mf" cx="212" cy="124" r="6"/><circle class="mf" cx="234" cy="124" r="6"/><rect class="mf" x="180" y="138" width="86" height="6" rx="3"/></svg>'
};
C.projects.forEach(p => {
  const a = h('article', 'card'), t = h('div', 'thumb'), b = h('div', 'card-body'), ul = h('ul', 'tech');
  const url = p.link && /^https:\/\//.test(p.link) ? p.link : '';          /* only real https links become clickable */
  const ext = (el, label) => { el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer'; el.setAttribute('aria-label', label + ' (opens in a new tab)'); return el; };
  t.insertAdjacentHTML('beforeend', ART[p.art] || ''); t.append(h('span', 'status', p.status));
  if (url) { t.classList.add('has-link'); const tl = ext(h('a', 'thumb-link'), p.title + ', live preview'); tl.tabIndex = -1; tl.setAttribute('aria-hidden', 'true'); t.append(tl); }   /* preview image is clickable (the title link is the keyboard / screen-reader one) */
  p.tech.forEach(x => ul.append(h('li', '', x)));
  const title = h('h3'); if (url) title.append(ext(h('a', 'card-title-link', p.title), p.title)); else title.textContent = p.title;
  b.append(title, ul, h('p', '', p.desc));
  if (url) {
    const label = (p.linkText || 'Live Demo').replace(/\s*↗\s*$/, ''), btn = ext(h('a', 'card-btn'), label + ': ' + p.title);
    btn.append(h('span', '', label), h('span', 'arrow', '↗')); btn.lastChild.setAttribute('aria-hidden', 'true'); b.append(btn);
  } else b.append(h('p', 'card-foot', 'Repository link coming soon'));
  a.append(t, b); $('#rail').append(a);
});
const rail = $('#rail'), stepW = () => (rail.firstElementChild ? rail.firstElementChild.offsetWidth : 300) + 18;
$('#prev').onclick = () => rail.scrollBy({ left: -stepW(), behavior: 'smooth' });
$('#next').onclick = () => rail.scrollBy({ left: stepW(), behavior: 'smooth' });

/* contact */
const mail = 'mailto:' + C.email;
$('#email-link').href = mail; $('#email-link').textContent = C.email;
const waDigits = (C.whatsapp || '').replace(/\D/g, '');
if (waDigits) { $('#wa-link').href = 'https://wa.me/' + waDigits; $('#wa-link').textContent = C.whatsapp; }
else $('#wa-link').closest('.row').style.display = 'none';   /* no number set: hide the row instead of linking to an empty wa.me */
$('#copy').onclick = async function () {
  try { await navigator.clipboard.writeText(C.email); }
  catch (e) { const t = h('textarea'); t.value = C.email; document.body.append(t); t.select(); safe(() => document.execCommand('copy')); t.remove(); }
  this.textContent = 'Copied'; setTimeout(() => { this.textContent = 'Copy'; }, 1600);
  document.dispatchEvent(new CustomEvent('ma:success'));   /* the sound system listens for this */
};
const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.6" cy="6.4" r="1.3"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
};
C.socials.forEach(s => {
  const li = h('li'), a = h('a'); a.href = s.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', s.name); a.insertAdjacentHTML('beforeend', ICONS[s.icon] || '');
  a.append(document.createTextNode(s.name)); li.append(a); $('#socials').append(li);
});

/* ---------- scroll: progress line, nav hide, process timeline ---------- */
const nav = $('#nav'), tl = $('#timeline'), progressEl = $('#progress'), processEl = $('#process'), stepLis = $$('#steps li');
let lastY = scrollY, tick = false;
function onScroll() {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    progressEl.style.setProperty('--p', max > 0 ? y / max : 0);
    nav.classList.toggle('hide', y > lastY && y > 120); lastY = y;
    const r = processEl.getBoundingClientRect(), p = clamp((innerHeight * .85 - r.top) / (r.height * .9), 0, 1);
    tl.style.setProperty('--tilt', (reduce ? 0 : 18 * (1 - clamp(p * 2.2, 0, 1))) + 'deg');
    tl.style.setProperty('--ph', p);
    stepLis.forEach((li, i) => li.classList.toggle('on', p > i / 4 + .02));
  });
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Effect 1: hanging, stretchy ID card (Verlet rope) ---------- */
const lan = $('#lanyard'), card = $('#card'), strapLine = $('#strap-line'), strapPath = $('#strap-path');
$('#strap-tp').textContent = C.strap.repeat(2);
const N = 12, G = .55, DAMP = .982, MAXV = 16;
let pts = [], seg = 20, ax = 0, ay = 0, cw = 250, ch = 360, pinned = false, running = false, drag = null, rest = 0;
/* tilt state: springs for the 3D tilt (rx, ry) and a gravity angle (ga) that swings the lanyard */
const T = { rx: 0, ry: 0, vx: 0, vy: 0, tx: 0, ty: 0, ga: 0, gt: 0 };
let heroVisible = true;
function tiltStep() {
  const K = .055, D = .2;                       /* spring stiffness and damping: soft + heavily damped, so the card settles like a real badge */
  T.vx += (T.tx - T.rx) * K - T.vx * D; T.rx += T.vx;
  T.vy += (T.ty - T.ry) * K - T.vy * D; T.ry += T.vy;
  T.ga += (T.gt - T.ga) * .12;
}
const tiltCalm = () => Math.abs(T.tx - T.rx) + Math.abs(T.ty - T.ry) + Math.abs(T.vx) + Math.abs(T.vy) + Math.abs(T.gt - T.ga) * 40 < .02;

function layout(drop) {
  const lr = lan.getBoundingClientRect(), gr = $('.hero-grid').getBoundingClientRect(), wide = innerWidth > 900;
  cw = card.offsetWidth; ch = card.offsetHeight;
  ax = clamp(wide ? gr.left - lr.left + gr.width * .78 : lr.width * .72, cw / 2 + 12, lr.width - cw / 2 - 12); ay = 0;
  const L = wide ? clamp(lr.height - ch - 120, 150, 250) : Math.max(120, lr.height - ch - 40);
  seg = L / N; pinned = !drop; rest = 0;
  const base = drop ? -(L + ch + 60) : 0;
  pts = Array.from({ length: N + 1 }, (_, i) => ({ x: ax, y: base + i * seg, px: ax, py: base + i * seg }));
  render();
}
function step() {
  const n = pts.length;
  for (let i = pinned ? 1 : 0; i < n; i++) {
    if (drag && i === n - 1) continue;
    const p = pts[i]; let vx = (p.x - p.px) * DAMP + G * Math.sin(T.ga), vy = (p.y - p.py) * DAMP + G * Math.cos(T.ga); const s = Math.hypot(vx, vy);
    if (s > MAXV) { vx *= MAXV / s; vy *= MAXV / s; }
    p.px = p.x; p.py = p.y; p.x += vx; p.y += vy;
  }
  if (!pinned && pts[0].y >= ay) pinned = true;
  if (drag) { const l = pts[n - 1]; l.px = l.x; l.py = l.y; l.x = drag.x; l.y = drag.y; }
  for (let k = 0; k < 10; k++) {
    if (pinned) { pts[0].x = ax; pts[0].y = ay; }
    for (let i = 0; i < n - 1; i++) {
      const a = pts[i], b = pts[i + 1], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6;
      if (d <= seg) continue;               /* only pulls when stretched, never pushes */
      const f = (d - seg) / d, aF = i === 0 && pinned, bF = drag && i + 1 === n - 1;
      if (aF && bF) continue;
      if (aF) { b.x -= dx * f; b.y -= dy * f; }
      else if (bF) { a.x += dx * f; a.y += dy * f; }
      else { a.x += dx * f / 2; a.y += dy * f / 2; b.x -= dx * f / 2; b.y -= dy * f / 2; }
    }
  }
}
function render() {
  const n = pts.length, l = pts[n - 1], pr = pts[n - 2];
  const ang = Math.atan2(-(l.x - pr.x), l.y - pr.y) * 180 / Math.PI;
  card.style.transform = `translate3d(${l.x - cw / 2}px,${l.y}px,0) rotate(${ang}deg) perspective(900px) rotateX(${T.rx.toFixed(2)}deg) rotateY(${T.ry.toFixed(2)}deg)`;
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < n - 1; i++) d += `Q${pts[i].x} ${pts[i].y} ${(pts[i].x + pts[i + 1].x) / 2} ${(pts[i].y + pts[i + 1].y) / 2}`;
  d += `L${l.x} ${l.y}`; strapLine.setAttribute('d', d); strapPath.setAttribute('d', d);
}
function loop() {
  if (!running) return;
  if (!heroVisible && !drag) { running = false; return; }   /* save battery when the card is off screen */
  tiltStep(); step(); render();
  let m = 0; for (const p of pts) m += Math.abs(p.x - p.px) + Math.abs(p.y - p.py);
  if (!drag && pinned && m < .06 && tiltCalm()) { if (++rest > 40) { running = false; return; } } else rest = 0;
  requestAnimationFrame(loop);
}
const wake = () => { if (!running && (heroVisible || drag)) { running = true; rest = 0; requestAnimationFrame(loop); } };
const lp = e => { const r = lan.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
card.addEventListener('pointerdown', e => {
  if (reduce) return; e.preventDefault(); card.setPointerCapture(e.pointerId);
  const p = lp(e), l = pts[pts.length - 1]; drag = { x: l.x, y: l.y, ox: p.x - l.x, oy: p.y - l.y }; wake();
});
card.addEventListener('pointermove', e => {
  if (!drag) return; const p = lp(e);
  drag.x = clamp(p.x - drag.ox, cw / 2, lan.clientWidth - cw / 2); drag.y = clamp(p.y - drag.oy, 0, lan.clientHeight - ch);
});
const release = () => {
  if (!drag) return; const l = pts[pts.length - 1]; let vx = (l.x - l.px) * .6, vy = (l.y - l.py) * .6; const s = Math.hypot(vx, vy);
  if (s > MAXV * .6) { vx *= MAXV * .6 / s; vy *= MAXV * .6 / s; }
  l.px = l.x - vx; l.py = l.y - vy; drag = null; wake();
};
card.addEventListener('pointerup', release); card.addEventListener('pointercancel', release);
/* ---------- gyroscope (phones) + mouse (desktop) tilt, on top of the rope physics ---------- */
(function () {
  if (reduce) return;
  let bb = null, bg = null, unsub = null, btn = null;
  const strength = () => clamp(C.tilt && C.tilt.card != null ? C.tilt.card : 1, 0, 2);
  const onOrient = (beta, gamma) => {                              /* data comes from the shared Orient system */
    if (bb == null) { bb = beta; bg = gamma; }
    bb += (beta - bb) * .012; bg += (gamma - bg) * .012;           /* slow baseline: the card eases back to rest when the phone is still */
    const k = strength(), db = clamp(beta - bb, -40, 40), dg = clamp(gamma - bg, -40, 40);
    T.tx = -db * .6 * k;                   /* forward / backward tilt */
    T.ty = dg * .5 * k;                    /* left / right tilt, 3D turn */
    T.gt = dg * Math.PI / 180 * .9 * k;    /* the lanyard swings the way the phone leans */
    wake();
  };
  const attach = () => { if (!unsub) unsub = Orient.subscribe(onOrient); };
  const detach = () => { if (unsub) { unsub(); unsub = null; bb = bg = null; T.tx = T.ty = T.gt = 0; wake(); } };
  const sync = () => { (touch && heroVisible && !document.hidden) ? attach() : detach(); };
  const ui = () => {                       /* the button exists on iPhone only and disappears once motion is allowed */
    if (!btn) return;
    if (Orient.state === 'granted') { btn.remove(); btn = null; }
    else if (Orient.state === 'denied') { btn.textContent = 'Motion blocked'; btn.disabled = true; }
  };
  const ask = () => { Orient.request().then(ui); };
  if (touch && Orient.supported && Orient.needsPermission) {       /* iOS asks for permission, and only after a tap */
    btn = h('button', 'motion-btn', 'Tap to enable motion'); btn.type = 'button'; btn.onclick = ask; lan.append(btn);
    card.addEventListener('pointerdown', () => { if (Orient.state === 'prompt') ask(); });
    Orient.watch(ui);
  }
  if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; sync(); wake(); }).observe($('#hero'));
  document.addEventListener('visibilitychange', sync);
  if (!touch) {                            /* desktop fallback: the card turns toward the mouse */
    addEventListener('pointermove', e => {
      if (e.pointerType === 'touch' || !heroVisible) return;
      T.ty = (e.clientX / innerWidth - .5) * 28; T.tx = -(e.clientY / innerHeight - .5) * 20; wake();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { T.tx = T.ty = 0; wake(); });
  }
  sync();
})();
layout(!reduce);
let lastW = innerWidth, rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; layout(false); } }, 200); });

/* ---------- loader hand-off: the ID card drops as the loader starts to leave ---------- */
(function () {
  let dropped = false; const drop = () => { if (dropped) return; dropped = true; if (!reduce) wake(); };
  const ML = window.MALoader;
  if (ML) { ML.app(); ML.revealed.then(drop); }          /* tells the loader that scripts are ready */
  else { const el = $('#loader'); if (el) el.remove(); drop(); }   /* no loader script: never block the page */
  setTimeout(drop, 9000);
})();

/* ---------- Effect 2: superhero mask reveal ---------- */
const rv = $('#reveal'), cur = $('#cur'), rs = { x: 0, y: 0, cx: 0, cy: 0, r: 0, t: 0, run: false, down: false };
function rvLoop() {
  rs.cx = lerp(rs.cx, rs.x, .18); rs.cy = lerp(rs.cy, rs.y, .18); rs.r = lerp(rs.r, rs.t, .18);
  rv.style.setProperty('--mx', rs.cx + 'px'); rv.style.setProperty('--my', rs.cy + 'px');
  rv.style.setProperty('--r', Math.max(0, rs.r) + 'px'); rv.style.setProperty('--ro', rs.r > 1 ? 1 : 0);
  if (Math.abs(rs.cx - rs.x) < .1 && Math.abs(rs.cy - rs.y) < .1 && Math.abs(rs.r - rs.t) < .1) {
    rs.run = false; if (rs.t === 0) rv.style.setProperty('--r', '0px');
  } else requestAnimationFrame(rvLoop);
}
const rvWake = () => { if (!rs.run) { rs.run = true; requestAnimationFrame(rvLoop); } };
const rvPos = e => { const b = rv.getBoundingClientRect(); rs.x = e.clientX - b.left; rs.y = e.clientY - b.top; };
const rvSize = () => rv.clientWidth * (rs.down ? .32 : .2);
rv.addEventListener('pointerenter', e => { rvPos(e); if (e.pointerType !== 'touch') { rs.cx = rs.x; rs.cy = rs.y; rs.t = rvSize(); cur.classList.add('hide'); rvWake(); } });
rv.addEventListener('pointermove', e => { rvPos(e); if (e.pointerType !== 'touch' || rs.down) { rs.t = rvSize(); rvWake(); } });
rv.addEventListener('pointerdown', e => {
  rs.down = true; rvPos(e); if (e.pointerType === 'touch') { rs.cx = rs.x; rs.cy = rs.y; }
  rv.setPointerCapture(e.pointerId); rs.t = rvSize(); rvWake();
});
const rvUp = e => { rs.down = false; rs.t = e.pointerType === 'touch' ? 0 : rvSize(); rvWake(); };
rv.addEventListener('pointerup', rvUp); rv.addEventListener('pointercancel', rvUp);
rv.addEventListener('pointerleave', () => { if (rs.down) return; rs.t = 0; cur.classList.remove('hide'); rvWake(); });

/* ---------- Effect 4: cursor follower ring ---------- */
if (!touch && !reduce) {
  const [halo, ring, dot] = $$('i', cur); let mx = -100, my = -100, rx = mx, ry = my, hx = mx, hy = my, run = false, first = true, hov = false;
  const draw = () => {
    rx = lerp(rx, mx, .2); ry = lerp(ry, my, .2); hx = lerp(hx, mx, .12); hy = lerp(hy, my, .12);
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; halo.style.transform = `translate3d(${hx}px,${hy}px,0)`;
    if (Math.abs(rx - mx) + Math.abs(ry - my) + Math.abs(hx - mx) + Math.abs(hy - my) > .3) requestAnimationFrame(draw); else run = false;
  };
  addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return; mx = e.clientX; my = e.clientY;
    if (first) { first = false; rx = hx = mx; ry = hy = my; }
    if (!run) { run = true; requestAnimationFrame(draw); }
    const on = !!(e.target.closest && e.target.closest('a,button,video,#card,.card'));
    if (on !== hov) { hov = on; cur.classList.toggle('hov', on); }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => cur.classList.add('hide'));
  document.documentElement.addEventListener('pointerenter', () => { if (!rv.matches(':hover')) cur.classList.remove('hide'); });
}

/* ---------- Effect 3: 3D "Let's Connect" goo button ---------- */
const goo = $('#goo');
$('#goo-label').textContent = C.goo; $('#goo-link').href = mail;
function loadGoo() {
  const f = h('iframe'); f.id = 'goo-frame'; f.title = ''; f.tabIndex = -1; f.setAttribute('aria-hidden', 'true');
  f.src = 'collab/venom.html?label=' + encodeURIComponent(C.goo);
  let ready = false;
  const post = (kind, e) => {
    const b = f.getBoundingClientRect();
    if (f.contentWindow) f.contentWindow.postMessage({ type: 'pointer', kind, x: e.clientX - b.left, y: e.clientY - b.top, w: b.width, h: b.height }, '*');
  };
  const move = e => { if (ready) post('move', e); };
  const click = e => { if (ready && e.target.closest('#goo-link')) post('click', e); };
  const drop = slow => {
    removeEventListener('message', onMsg); removeEventListener('pointermove', move); removeEventListener('click', click);
    f.remove(); goo.classList.remove('on-3d'); if (slow) safe(() => localStorage.setItem('goo-slow', '1'));
  };
  const speedTest = () => {   /* 5 frames; if the page runs slow with the 3D on, keep the light CSS pill */
    const ts = []; let last = performance.now();
    (function n(now) {
      ts.push(now - last); last = now;
      if (ts.length < 6) return requestAnimationFrame(n);
      ts.shift(); ts.sort((a, b) => a - b); if (ts[2] > 24) drop(true);
    })(last);
  };
  function onMsg(e) {
    if (e.source !== f.contentWindow || !e.data) return;
    if (e.data.type === 'ready' && !ready) { ready = true; goo.classList.add('on-3d'); speedTest(); }
  }
  addEventListener('message', onMsg); addEventListener('pointermove', move, { passive: true }); addEventListener('click', click);
  document.body.append(f);
  setTimeout(() => { if (!ready) drop(false); }, 8000);   /* no answer from the 3D page: keep the CSS pill */
}
function gpuOk() {   /* only allow the 3D button on a real graphics card, never on software rendering */
  try {
    const gl = document.createElement('canvas').getContext('webgl2'); if (!gl) return false;
    const x = gl.getExtension('WEBGL_debug_renderer_info'), r = x ? String(gl.getParameter(x.UNMASKED_RENDERER_WEBGL)) : '';
    return !/swiftshader|llvmpipe|software|basic render/i.test(r) && (navigator.hardwareConcurrency || 4) >= 4;
  } catch (e) { return false; }
}
if (C.goo3d && !touch && !reduce && innerWidth > 900 && safe(() => localStorage.getItem('goo-slow')) !== '1' && gpuOk()) {
  const near = e => {   /* load the heavy 3D page only when the mouse comes close to the button */
    const b = $('#goo-link').getBoundingClientRect();
    if (Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2)) < 260) { removeEventListener('pointermove', near); loadGoo(); }
  };
  addEventListener('pointermove', near, { passive: true });
}
})();

/* =====================================================================
   3D ENVIRONMENT: floating depth particles, network lines and soft light.
   Decorative only. It sits behind all content (z-index -1, pointer-events none)
   and never touches the ID card, lanyard or the Spider-Man reveal.
   Switch off with  env: false  in CONTENT.
   ===================================================================== */
(() => {
'use strict';
try {
if (CONTENT.env === false) return;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const touch = matchMedia('(hover: none), (pointer: coarse)').matches;
const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 8) <= 4;
const saveData = !!(navigator.connection && navigator.connection.saveData);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* --- DOM: glows + light beam + fog + canvas + vignette (all decorative) --- */
const env = document.createElement('div');
env.id = 'env'; env.setAttribute('aria-hidden', 'true');
env.innerHTML = '<i class="env-glow ga"></i><i class="env-glow gb"></i><i class="env-beam"></i><i class="env-fog"></i><canvas id="env-canvas"></canvas><i class="env-vig"></i>';
document.body.prepend(env);
const cv = env.querySelector('canvas'), ctx = cv.getContext('2d');
const gA = env.querySelector('.ga'), gB = env.querySelector('.gb'), beam = env.querySelector('.env-beam');
if (!ctx) { env.remove(); return; }

/* --- soft glow sprite, drawn once and reused for every particle --- */
const sprite = document.createElement('canvas'); sprite.width = sprite.height = 64;
{ const g = sprite.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(225,235,255,1)'); gr.addColorStop(.16, 'rgba(120,165,255,.9)');
  gr.addColorStop(.45, 'rgba(37,99,235,.3)'); gr.addColorStop(1, 'rgba(37,99,235,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64); }

/* --- scenes: the light moves smoothly when you reach another section --- */
const SCENES = [
  { ax: 78, ay: 20, bx: 8,  by: 86, bm: 64, br: 18,  i: 1 },    /* hero */
  { ax: 18, ay: 30, bx: 86, by: 72, bm: 30, br: -14, i: .85 },  /* projects */
  { ax: 72, ay: 55, bx: 14, by: 20, bm: 76, br: 22,  i: .8 },   /* process */
  { ax: 24, ay: 70, bx: 82, by: 24, bm: 20, br: -20, i: .9 },   /* about */
  { ax: 58, ay: 42, bx: 30, by: 82, bm: 50, br: 10,  i: 1 }     /* contact */
];
const SECS = ['#hero', '#work', '#process', '#about', '#contact'].map(s => document.querySelector(s));
const S = Object.assign({}, SCENES[0]); let target = 0;
const pickScene = () => {
  const mid = innerHeight * .5; let best = 0, bd = 1e9;
  SECS.forEach((el, i) => { if (!el) return; const r = el.getBoundingClientRect();
    const d = (r.top <= mid && r.bottom >= mid) ? 0 : Math.min(Math.abs(r.top - mid), Math.abs(r.bottom - mid));
    if (d < bd) { bd = d; best = i; } });
  return best;
};

/* --- state --- */
let W = 0, H = 0, dpr = 1, q = (saveData || reduce) ? 0 : 3, N = 0, MAXN = 0, D = 130;
let PX, PY, PZ, VX, VY, PH, PF, SX, SY;
const MAXP = 260, PI_ = new Int16Array(MAXP), PJ_ = new Int16Array(MAXP), PA_ = new Float32Array(MAXP);
let mx = 0, my = 0, gx = 0, gy = 0, gz = 0, camX = 0, camY = 0, scrollS = scrollY, scrollDirty = true;
const GS = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 };   /* spring for the phone tilt: smooth start, soft settle */
let CX = 0, CY = 0, CZ = 0;                                /* final camera: mouse + auto drift + phone tilt */
const dbg = {}; env.cam = dbg;                             /* read-only snapshot, handy for testing */
let raf = 0, running = false, last = 0, slow = 0, qtimer = 0, resizeT = 0;
let minDt = (touch || lowEnd || (navigator.hardwareConcurrency || 4) < 8) ? 33 : 16;   /* frame gap in ms: 16 = 60 fps, 33 = 30 fps */

function build(n) {
  N = n; PX = new Float32Array(n); PY = new Float32Array(n); PZ = new Float32Array(n); VX = new Float32Array(n);
  VY = new Float32Array(n); PH = new Float32Array(n); PF = new Float32Array(n); SX = new Float32Array(n); SY = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const z = .18 + Math.pow(Math.random(), 1.5) * .82;            /* depth: .18 far ... 1 near */
    PX[i] = Math.random() * W; PY[i] = Math.random() * H; PZ[i] = z; PH[i] = Math.random() * 6.28; PF[i] = .6 + Math.random() * .9;   /* own ambient speed per point */
    VX[i] = (Math.random() - .5) * 12 * (.4 + z); VY[i] = -(2 + Math.random() * 7) * (.4 + z);   /* px per second */
  }
}
function size() {
  W = innerWidth; H = innerHeight;
  dpr = (touch || lowEnd) ? 1 : Math.min(devicePixelRatio || 1, 1.5);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  const area = W * H;
  MAXN = touch ? clamp(Math.round(area / 14000), 22, 34) : clamp(Math.round(area / 24000), 28, 86);
  if (lowEnd) MAXN = Math.round(MAXN * .7);
  D = touch ? 105 : clamp(W * .1, 100, 165);
  const f = reduce ? .65 : q === 3 ? 1 : q === 2 ? (touch ? .75 : 1) : .55;
  build(Math.max(16, Math.round(MAXN * f)));
  const gs = Math.max(W, H);
  gA.style.width = gA.style.height = (gs * .9) + 'px'; gB.style.width = gB.style.height = (gs * .7) + 'px';
  beam.style.width = (gs * .34) + 'px'; beam.style.height = (gs * 1.7) + 'px'; beam.style.top = (-gs * .3) + 'px';
}

/* --- one frame of movement --- */
function update(dt, now) {
  const m = 40, WW = W + 2 * m, HH = H + 2 * m;
  const autoX = Math.sin(now * .00013) * (touch ? .35 : .12), autoY = Math.cos(now * .00011) * (touch ? .3 : .1);
  const k = Math.min(1, dt / 16) * .05;
  camX += (clamp(mx + autoX, -.8, .8) - camX) * k; camY += (clamp(my + autoY, -.8, .8) - camY) * k;   /* mouse + drift, unchanged */
  const fs = Math.min(dt, 64) / 16.67;                           /* phone tilt: damped spring (about 0.8 damping, no wobble) */
  GS.vx += ((gx - GS.x) * .03 - GS.vx * .28) * fs; GS.x += GS.vx * fs;
  GS.vy += ((gy - GS.y) * .03 - GS.vy * .28) * fs; GS.y += GS.vy * fs;
  GS.vz += ((gz - GS.z) * .03 - GS.vz * .28) * fs; GS.z += GS.vz * fs;
  CX = camX + GS.x; CY = camY + GS.y; CZ = GS.z;
  dbg.x = CX; dbg.y = CY; dbg.z = CZ; dbg.tx = gx; dbg.ty = gy; dbg.tz = gz;
  scrollS += (scrollY - scrollS) * Math.min(1, dt / 16) * .1;
  const f = dt / 1000;
  for (let i = 0; i < N; i++) {
    let x = PX[i] + VX[i] * f, y = PY[i] + VY[i] * f;
    if (x > W + m) x = -m; else if (x < -m) x = W + m;
    if (y < -m) y = H + m; else if (y > H + m) y = -m;
    PX[i] = x; PY[i] = y;
    const z = PZ[i];
    let sx = x + Math.sin(now * .0005 * PF[i] + PH[i]) * 8 * z + CX * 70 * z;
    let sy = y + Math.cos(now * .0004 * PF[i] + PH[i]) * 6 * z + CY * 45 * z - scrollS * .22 * z;
    const dz = 1 + CZ * .07 * z; sx = (sx - W / 2) * dz + W / 2; sy = (sy - H / 2) * dz + H / 2;   /* forward / back: near points move more, like real depth */
    SX[i] = ((sx + m) % WW + WW) % WW - m; SY[i] = ((sy + m) % HH + HH) % HH - m;
  }
}
function applyScene(dt) {
  if (scrollDirty) { scrollDirty = false; target = pickScene(); }
  const T = SCENES[target], k = Math.min(1, dt * .0035);
  for (const key in T) S[key] += (T[key] - S[key]) * k;       /* smooth transition between sections */
  gA.style.transform = `translate3d(${(S.ax / 100 * W - parseFloat(gA.style.width) / 2 - CX * 36).toFixed(1)}px,${(S.ay / 100 * H - parseFloat(gA.style.height) / 2 - CY * 26).toFixed(1)}px,0)`;
  gB.style.transform = `translate3d(${(S.bx / 100 * W - parseFloat(gB.style.width) / 2 - CX * 20).toFixed(1)}px,${(S.by / 100 * H - parseFloat(gB.style.height) / 2 - CY * 14).toFixed(1)}px,0)`;
  beam.style.transform = `translate3d(${(S.bm / 100 * W - parseFloat(beam.style.width) / 2 + CX * 14).toFixed(1)}px,0,0) rotate(${(S.br + CX * 3).toFixed(2)}deg) perspective(1400px) rotateX(${(-CY * 5).toFixed(2)}deg) rotateY(${(CX * 6).toFixed(2)}deg)`;
  env.style.setProperty('--ei', S.i.toFixed(3));
}
function draw() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  if (q >= 2 || reduce) {                                       /* network lines between near neighbours */
    let np = 0; const D2 = D * D;
    for (let i = 0; i < N && np < MAXP; i++) for (let j = i + 1; j < N && np < MAXP; j++) {
      const dx = SX[i] - SX[j], dy = SY[i] - SY[j], d2 = dx * dx + dy * dy;
      if (d2 >= D2 || Math.abs(PZ[i] - PZ[j]) > .4) continue;
      PI_[np] = i; PJ_[np] = j; PA_[np++] = (1 - Math.sqrt(d2) / D) * (PZ[i] + PZ[j]) * .5;
    }
    ctx.lineWidth = .8;
    for (let b = 0; b < 3; b++) {
      ctx.strokeStyle = b === 0 ? 'rgba(37,99,235,.12)' : b === 1 ? 'rgba(37,99,235,.22)' : 'rgba(80,130,250,.34)';
      ctx.beginPath(); let any = false;
      for (let p = 0; p < np; p++) { const a = PA_[p]; if ((a < .25 ? 0 : a < .5 ? 1 : 2) !== b) continue;
        ctx.moveTo(SX[PI_[p]], SY[PI_[p]]); ctx.lineTo(SX[PJ_[p]], SY[PJ_[p]]); any = true; }
      if (any) ctx.stroke();
    }
  }
  for (let i = 0; i < N; i++) {                                 /* glowing points, bigger and brighter when nearer */
    const z = PZ[i], node = i % 7 === 0, r = (2 + z * z * 9) * (node ? 1.5 : 1) * (1 + CZ * .2 * z);
    ctx.globalAlpha = Math.min(1, (.2 + .55 * z) * (node ? 1.25 : 1));
    ctx.drawImage(sprite, SX[i] - r, SY[i] - r, r * 2, r * 2);
  }
  ctx.globalAlpha = 1;
}

/* --- loop: runs only while the tab is visible, capped fps, and steps down quality if the device struggles --- */
function frame(now) {
  if (!running) return; raf = requestAnimationFrame(frame);
  const el = now - last; if (el < minDt - 2) return;
  last = now; const dt = Math.min(el, 64);
  if (el > minDt * 1.35) slow++; else slow = Math.max(0, slow - 1);
  if (slow > 40) { slow = 0; downgrade(); if (!running) return; }
  update(dt, now); applyScene(dt); draw();
}
function start() { if (running || q === 0 || reduce) return; running = true; last = performance.now(); env.classList.remove('paused'); env.dataset.state = 'running'; raf = requestAnimationFrame(frame); }
function stop(state) { running = false; cancelAnimationFrame(raf); raf = 0; env.classList.add('paused'); env.dataset.state = state || 'paused'; }
function downgrade() {
  q = Math.max(0, q - 1); env.dataset.q = q; minDt = 33; size();   /* step 1: 30 fps, step 2: fewer points and no lines, step 3: still picture */
  if (q === 0) { stop('static'); tilt(false); staticFrame(); }
}
function staticFrame() {                                       /* one still picture, no animation */
  update(16, 0); target = pickScene(); Object.assign(S, SCENES[target]); applyScene(1000); draw();
}
env.dataset.q = q;
size(); env.dataset.state = 'starting';

/* --- input: mouse parallax, optional phone tilt (never asks for permission) --- */
const onMove = e => { if (e.pointerType === 'touch') return; mx = e.clientX / W - .5; my = e.clientY / H - .5; };
const onLeave = () => { mx = my = 0; };
const onScroll = () => { scrollDirty = true; if (!running && (q === 0 || reduce)) kickStatic(); };
let sq = 0; function kickStatic() { if (sq) return; sq = requestAnimationFrame(() => { sq = 0; staticFrame(); }); }
let bb = null, bg = null, unsubTilt = null;
const onTilt = (beta, gamma) => {                              /* data comes from the shared Orient system */
  if (bb == null) { bb = beta; bg = gamma; }
  bb += (beta - bb) * .02; bg += (gamma - bg) * .02;           /* slow baseline: the scene settles when the phone is still */
  const k = clamp(CONTENT.tilt && CONTENT.tilt.env != null ? CONTENT.tilt.env : 1, 0, 2);
  gx = clamp((gamma - bg) / 20, -1, 1) * .5 * k;               /* left / right */
  gy = clamp((beta - bb) / 20, -1, 1) * .5 * k;                /* forward / back: slide */
  gz = clamp((beta - bb) / 25, -1, 1) * k;                     /* forward / back: depth */
};
const tiltOn = touch && !reduce && Orient.supported;
function tilt(on) {                                            /* never asks for permission; uses data only when it is available */
  if (!tiltOn) return;
  if (on && q > 0 && !unsubTilt) unsubTilt = Orient.subscribe(onTilt);
  else if (!on && unsubTilt) { unsubTilt(); unsubTilt = null; bb = bg = null; gx = gy = gz = 0; }
}
function listen(on) {
  if (!touch) { const f = on ? addEventListener : removeEventListener; f('pointermove', onMove, { passive: true }); document.documentElement[on ? 'addEventListener' : 'removeEventListener']('pointerleave', onLeave); }
  tilt(on);
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(() => { size(); if (!running) staticFrame(); }, 150); });
const onVis = () => {
  if (document.hidden) { listen(false); if (running) stop('paused'); }
  else { listen(true); if (q > 0 && !reduce) start(); }
};
document.addEventListener('visibilitychange', onVis);
document.addEventListener('ma:terminal-open', () => { if (running) stop('paused'); });      /* the terminal window is open: rest the background */
document.addEventListener('ma:terminal-close', () => { if (!running && q > 0 && !reduce && !document.hidden) start(); });
addEventListener('pagehide', () => { stop('off'); listen(false); });

/* start after the first paint so the page itself loads first */
let booted = false;
const boot = () => {
  if (booted) return; booted = true;
  listen(!document.hidden);
  if (q === 0 || reduce) { env.dataset.state = 'static'; staticFrame(); } else if (!document.hidden) start();
  requestAnimationFrame(() => env.classList.add('on'));
};
if (window.MALoader) MALoader.revealed.then(() => setTimeout(boot, 250)); else setTimeout(boot, 700);   /* heavy work starts after the loader */
setTimeout(boot, 9000);
} catch (err) { const e = document.getElementById('env'); if (e) e.remove(); }
})();

/* =====================================================================
   SOUND SYSTEM. Off by default, only starts after a deliberate click on the
   sound control, never autoplays, never needed to use the site.
   - Sounds are synthesised here with the Web Audio API (original, no files, no licences).
   - To use your own file for any sound: put it in assets/sounds/ and list it in
     CONTENT.sound.files, for example { click: "assets/sounds/click.mp3" }.
     If a file is missing or cannot be decoded, the built-in sound plays instead.
   - Other code can call MASound.play('success') or dispatch the events
     'ma:success' (form sent, copied) and 'ma:terminal' (command executed).
   ===================================================================== */
const MASound = (() => {
'use strict';
const KEY = 'ma-sound-v1', FILES = (CONTENT.sound && CONTENT.sound.files) || {};
const CATS = { ui: 'Clicks & navigation', cards: 'Project cards', id: 'ID card', move: 'Page transitions', fb: 'Success & terminal' };
const MAX_VOICES = 5, ANY_GAP = 30, ESSENTIAL = ['click', 'nav'];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const AC = window.AudioContext || window.webkitAudioContext;
let failed = false, ctx = null, master = null, active = 0, lastAny = 0;
const last = {}, bufs = {};

/* ---------- tiny synth helpers (each sound = a few short soft partials) ---------- */
const noiseCache = new WeakMap();
const noise = c => { let b = noiseCache.get(c); if (!b) { b = c.createBuffer(1, c.sampleRate, c.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noiseCache.set(c, b); } return b; };
const env = (c, g, t, gain, dur, att) => { g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(gain, t + att); g.gain.exponentialRampToValueAtTime(.0001, t + dur); };
function tone(c, o, t, f0, f1, dur, gain, type, att) {
  const osc = c.createOscillator(), g = c.createGain(); osc.type = type || 'sine';
  osc.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(c, g, t, gain, dur, att || .004); osc.connect(g); g.connect(o); osc.start(t); osc.stop(t + dur + .03);
}
function hiss(c, o, t, f0, f1, dur, gain, q, type, att) {
  const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = noise(c);
  f.type = type || 'bandpass'; f.Q.value = q || 1; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  env(c, g, t, gain, dur, att || .004); s.connect(f); f.connect(g); g.connect(o); s.start(t); s.stop(t + dur + .03);
}

/* ---------- the sound library: cat = preference group, cd = cooldown (ms), len = length (s) ---------- */
const LIB = {
  click:      { cat: 'ui',    cd: 60,  len: .1,  fn(c, t, o) { tone(c, o, t, 1100, 620, .05, .10); tone(c, o, t, 2200, 1500, .022, .03, 'triangle'); } },
  nav:        { cat: 'ui',    cd: 90,  len: .14, fn(c, t, o) { tone(c, o, t, 640, 860, .09, .09); tone(c, o, t + .012, 1280, 1500, .07, .03); } },
  cardHover:  { cat: 'cards', cd: 160, len: .06, fn(c, t, o) { tone(c, o, t, 1500, 1350, .035, .022); } },
  cardOpen:   { cat: 'cards', cd: 120, len: .22, fn(c, t, o) { tone(c, o, t, 420, 630, .16, .09); tone(c, o, t + .02, 840, 1260, .12, .035); } },
  idGrab:     { cat: 'id',    cd: 150, len: .16, fn(c, t, o) { tone(c, o, t, 190, 110, .11, .16); hiss(c, o, t, 900, 700, .03, .05, 1.2); } },
  idRelease:  { cat: 'id',    cd: 200, len: .32, fn(c, t, o) { hiss(c, o, t, 1400, 350, .26, .09, .9, 'bandpass', .03); tone(c, o, t, 140, 100, .12, .05); } },
  transition: { cat: 'move',  cd: 900, len: .55, fn(c, t, o) { hiss(c, o, t, 300, 900, .45, .045, .8, 'bandpass', .12); tone(c, o, t, 220, 330, .4, .03, 'sine', .1); } },
  success:    { cat: 'fb',    cd: 400, len: .8,  fn(c, t, o) { tone(c, o, t, 659.25, 0, .5, .10, 'sine', .006); tone(c, o, t + .09, 987.77, 0, .6, .08, 'sine', .006); tone(c, o, t + .18, 1318.5, 0, .7, .05, 'sine', .006); } },
  terminal:   { cat: 'fb',    cd: 120, len: .2,  fn(c, t, o) { tone(c, o, t, 1800, 1700, .02, .05, 'triangle'); tone(c, o, t + .06, 1800, 1700, .02, .05, 'triangle'); tone(c, o, t + .06, 520, 600, .1, .06); } },
  terminalKey:{ cat: 'fb',    cd: 40,  len: .03, fn(c, t, o) { hiss(c, o, t, 3500, 3000, .012, .03, 1, 'highpass'); tone(c, o, t, 1600, 1400, .015, .02, 'triangle'); } }
};

/* ---------- saved preferences ---------- */
function load() {
  let s = {}; try { s = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) {}
  const cats = {}; for (const k in CATS) cats[k] = !(s.cats && s.cats[k] === false);
  return { on: s.on === true, vol: Number.isFinite(s.vol) ? clamp(s.vol, 0, 100) : 60, cats };
}
const cfg = load();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} };
const gainFor = v => Math.pow(v / 100, 2) * .9;          /* perceptual curve: the slider feels even */
const supported = () => !!AC && !failed;

/* ---------- one shared audio context, created only after a user gesture ---------- */
function ensure() {
  if (ctx) return ctx; if (!AC || failed) return null;
  try {
    ctx = new AC({ latencyHint: 'interactive' });
    master = ctx.createGain(); master.gain.value = gainFor(cfg.vol);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000;       /* keeps everything soft */
    const cp = ctx.createDynamicsCompressor(); cp.threshold.value = -18; cp.knee.value = 24; cp.ratio.value = 6; cp.attack.value = .003; cp.release.value = .2;
    master.connect(lp); lp.connect(cp); cp.connect(ctx.destination);
  } catch (e) { ctx = null; failed = true; ui.render(); return null; }
  return ctx;
}
function loadFile(name) {                                 /* optional custom file: loads once, falls back silently */
  const url = FILES[name]; if (!url || bufs[name] !== undefined || !ctx) return; bufs[name] = 'loading';
  fetch(url).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
    .then(ab => new Promise((res, rej) => ctx.decodeAudioData(ab, res, rej)))
    .then(b => { bufs[name] = b; }, () => { bufs[name] = null; });
}
function playFile(name, t) {
  const b = bufs[name]; if (!FILES[name]) return false;
  if (b === undefined) { loadFile(name); return false; }
  if (!b || b === 'loading') return false;
  const s = ctx.createBufferSource(); s.buffer = b; s.connect(master); s.start(t); return true;
}
function play(name) {
  try {
    if (!cfg.on || cfg.vol <= 0) return;
    const d = LIB[name]; if (!d || !cfg.cats[d.cat]) return;
    const now = performance.now();
    if (now - (last[name] || 0) < d.cd || (d.cat !== 'fb' && now - lastAny < ANY_GAP) || active >= MAX_VOICES) return;   /* cooldowns + voice limit */
    const c = ensure(); if (!c) return;
    last[name] = lastAny = now; active++; setTimeout(() => { active--; }, d.len * 1000 + 120);
    const fire = () => { const t = c.currentTime + .005; if (!playFile(name, t)) d.fn(c, t, master); };
    if (c.state !== 'running') { c.resume ? c.resume().then(fire, () => {}) : fire(); }   /* suspended: the sound plays as soon as the context wakes */
    else fire();
  } catch (e) {}
}
function setOn(on) {
  cfg.on = !!on && supported(); save();
  if (cfg.on) {
    const c = ensure();
    if (c) { ESSENTIAL.forEach(loadFile); (c.resume ? c.resume() : Promise.resolve()).then(() => play('click'), () => {}); }
  } else if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  ui.render();
}
const unlock = () => { if (cfg.on && supported()) { const c = ensure(); if (c && c.state === 'suspended') c.resume().catch(() => {}); } };
addEventListener('pointerdown', unlock, { capture: true, passive: true });
addEventListener('keydown', unlock, { capture: true, passive: true });
document.addEventListener('visibilitychange', () => {       /* silent and idle in a hidden tab */
  if (!ctx) return; if (document.hidden) { if (ctx.state === 'running') ctx.suspend().catch(() => {}); } else if (cfg.on) ctx.resume().catch(() => {});
});

/* ---------- the control panel ---------- */
const ui = (() => {
  let root, btn, panel, sw, vol, volv, live, built = false;
  const ICON_ON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  const ICON_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  function build() {
    if (built) return; built = true;
    root = document.createElement('div'); root.id = 'snd';
    const cats = Object.keys(CATS).map(k => `<label class="snd-check"><input type="checkbox" data-cat="${k}"><span>${CATS[k]}</span></label>`).join('');
    root.innerHTML =
      '<button type="button" id="snd-btn" class="snd-btn" aria-haspopup="dialog" aria-expanded="false" aria-controls="snd-panel"><span class="snd-ico"></span><span class="snd-dot" aria-hidden="true"></span><span class="snd-state"></span></button>' +
      '<div id="snd-panel" class="snd-panel" role="dialog" aria-label="Sound settings" hidden>' +
        '<div class="snd-row"><span id="snd-sl">Sound</span><button type="button" id="snd-sw" class="snd-sw" role="switch" aria-checked="false" aria-labelledby="snd-sl"><i></i></button></div>' +
        '<div class="snd-vol"><label for="snd-vol">Volume</label><input id="snd-vol" type="range" min="0" max="100" step="5"><output id="snd-volv" for="snd-vol"></output></div>' +
        '<fieldset class="snd-cats"><legend>Play sounds for</legend>' + cats + '</fieldset>' +
        '<p class="snd-note">Off by default. Your choice is saved on this device. Nothing on the site needs sound.</p>' +
      '</div><div class="sr-only" id="snd-live" role="status" aria-live="polite"></div>';
    document.body.append(root);
    btn = root.querySelector('#snd-btn'); panel = root.querySelector('#snd-panel'); sw = root.querySelector('#snd-sw');
    vol = root.querySelector('#snd-vol'); volv = root.querySelector('#snd-volv'); live = root.querySelector('#snd-live');
    btn.onclick = () => toggle(panel.hidden);
    sw.onclick = () => { setOn(!cfg.on); live.textContent = cfg.on ? 'Sound on' : 'Sound off'; };
    vol.oninput = () => { cfg.vol = +vol.value; if (master) master.gain.setTargetAtTime(gainFor(cfg.vol), ctx.currentTime, .02); label(); };
    vol.onchange = () => { save(); play('click'); };           /* a small preview at the new volume */
    root.querySelectorAll('[data-cat]').forEach(i => { i.onchange = () => { cfg.cats[i.dataset.cat] = i.checked; save(); }; });
    document.addEventListener('pointerdown', e => { if (!panel.hidden && !root.contains(e.target)) toggle(false); }, true);
    root.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { toggle(false); btn.focus(); } });
    render();
  }
  const label = () => { volv.textContent = cfg.vol + '%'; vol.setAttribute('aria-valuetext', cfg.vol + ' percent'); };
  function toggle(open) { panel.hidden = !open; btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
  function render() {
    if (!built) return;
    const ok = supported(), on = ok && cfg.on;
    root.classList.toggle('on', on); root.classList.toggle('na', !ok);
    btn.querySelector('.snd-ico').innerHTML = on ? ICON_ON : ICON_OFF;
    btn.querySelector('.snd-state').textContent = !ok ? 'Sound unavailable' : on ? 'Sound on' : 'Sound off';
    btn.setAttribute('aria-label', !ok ? 'Sound settings: sound is not available in this browser' : 'Sound settings, sound is ' + (on ? 'on' : 'off'));
    sw.setAttribute('aria-checked', on ? 'true' : 'false'); sw.disabled = !ok;
    vol.value = cfg.vol; label();
    root.querySelectorAll('[data-cat]').forEach(i => { i.checked = cfg.cats[i.dataset.cat]; });
  }
  return { build, render };
})();

/* ---------- where sounds are triggered (one delegated listener, one sound per interaction) ---------- */
document.addEventListener('click', e => {
  if (!cfg.on) return; const t = e.target; if (!t.closest || t.closest('#snd')) return;
  if (t.closest('.card')) return play('cardOpen');
  const el = t.closest('a,button,[role="button"]'); if (!el) return;
  if (el.id === 'copy') return;                          /* it plays the success chime when the copy worked */
  play(el.closest('#nav') ? 'nav' : 'click');
});
document.addEventListener('pointerover', e => {                  /* soft tick when the mouse enters a project card (never on touch) */
  if (!cfg.on || e.pointerType !== 'mouse') return; const c = e.target.closest && e.target.closest('.card');
  if (c && !(e.relatedTarget && c.contains(e.relatedTarget))) play('cardHover');
});
document.addEventListener('ma:success', () => play('success'));    /* form sent, email copied */
document.addEventListener('ma:terminal', () => play('terminal'));  /* a terminal command was executed */
document.addEventListener('ma:terminal-key', () => play('terminalKey'));
const cardEl = document.getElementById('card');
if (cardEl) {                                                     /* ID card: soft thock on grab, light swing on release */
  let sx = 0, sy = 0, moved = false, held = false;
  cardEl.addEventListener('pointerdown', e => { held = true; moved = false; sx = e.clientX; sy = e.clientY; play('idGrab'); });
  cardEl.addEventListener('pointermove', e => { if (held && Math.hypot(e.clientX - sx, e.clientY - sy) > 8) moved = true; });
  const up = () => { if (held && moved) play('idRelease'); held = false; };
  cardEl.addEventListener('pointerup', up); cardEl.addEventListener('pointercancel', up);
}
(function () {                                                     /* gentle sound when a new section becomes the main one */
  if (!('IntersectionObserver' in window)) return; let cur = null, tm = 0, first = true;
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting || en.target === cur) return; cur = en.target;
    if (first) { first = false; return; }
    clearTimeout(tm); tm = setTimeout(() => { if (!document.getElementById('loader')) play('transition'); }, 260);
  }), { rootMargin: '-45% 0px -45% 0px' });
  ['#hero', '#work', '#process', '#about', '#contact'].forEach(s => { const el = document.querySelector(s); if (el) io.observe(el); });
})();

/* ---------- test hook: render a sound offline and measure it (nothing is played) ---------- */
async function measure(name) {
  const d = LIB[name]; if (!d) return null;                 /* unknown sound name: nothing to render */
  const oc = new OfflineAudioContext(1, 44100, 44100), g = oc.createGain(); g.gain.value = gainFor(100); g.connect(oc.destination);
  d.fn(oc, .005, g); const x = (await oc.startRendering()).getChannelData(0); let pk = 0, sq = 0, end = 0, bad = false;
  for (let i = 0; i < x.length; i++) { const a = Math.abs(x[i]); if (a !== a) bad = true; if (a > pk) pk = a; sq += a * a; if (a > .002) end = i; }
  return { peak: +pk.toFixed(3), rms: +Math.sqrt(sq / x.length).toFixed(4), seconds: +(end / 44100).toFixed(2), nan: bad };
}
const start = () => ui.build();
if (window.MALoader) { MALoader.done.then(start); setTimeout(start, 9000); } else start();
return { play, setOn, measure, names: Object.keys(LIB), get enabled() { return cfg.on; }, get volume() { return cfg.vol; }, get supported() { return supported(); }, get voices() { return active; }, get gain() { return master ? +master.gain.value.toFixed(3) : null; }, get state() { return ctx ? ctx.state : 'none'; } };
})();

/* ---------- feedback form (Netlify Forms): AJAX submit, inline success/error ---------- */
(function () {
  const form = document.getElementById('feedback');
  if (!form) return;
  const msg = form.querySelector('.fb-msg'), btn = form.querySelector('#fb-send');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true; msg.hidden = true;
    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch('/', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body });
      if (!res.ok) throw 0;
      form.querySelectorAll('input,textarea').forEach(f => { if (f.type !== 'hidden') f.value = ''; });
      msg.textContent = 'Thank you! Your feedback has been received.'; msg.className = 'fb-msg ok'; msg.hidden = false;
    } catch {
      msg.textContent = 'Sorry, it did not send. Please try again or use the email above.'; msg.className = 'fb-msg err'; msg.hidden = false;
    } finally { btn.disabled = false; }
  });
})();

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
    { title: "QuizRun", status: "In Development", art: "runner",
      desc: "An AI-powered educational endless runner game where students learn through MCQ questions generated from uploaded PDFs.",
      tech: ["AI", "PDF upload", "MCQ", "Game"], link: "", linkText: "" },
    { title: "JARVIS", status: "In Development", art: "voice",
      desc: "A Python-based AI voice assistant with Gemini API integration, voice input, voice output, and SQLite memory.",
      tech: ["Python", "Gemini API", "SQLite", "Voice input", "Voice output"], link: "", linkText: "" },
    { title: "Student Learning Platform", status: "In Development", art: "dash",
      desc: "An AI-powered educational platform for students featuring textbook PDF question answering, MCQs, notices, bookmarks, and progress tracking.",
      tech: ["AI", "PDF Q&A", "MCQs", "Notices", "Bookmarks", "Progress tracking"], link: "", linkText: "" }
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
  goo: "Let’s Connect"
};

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
  t.insertAdjacentHTML('beforeend', ART[p.art] || ''); t.append(h('span', 'status', p.status));
  p.tech.forEach(x => ul.append(h('li', '', x)));
  b.append(h('h3', '', p.title), ul, h('p', '', p.desc));
  if (p.link) { const l = h('a', '', p.linkText || 'View project'); l.href = p.link; l.target = '_blank'; l.rel = 'noopener noreferrer'; b.append(l); }
  else b.append(h('p', 'card-foot', 'Repository link coming soon'));
  a.append(t, b); $('#rail').append(a);
});
const rail = $('#rail'), stepW = () => (rail.firstElementChild ? rail.firstElementChild.offsetWidth : 300) + 18;
$('#prev').onclick = () => rail.scrollBy({ left: -stepW(), behavior: 'smooth' });
$('#next').onclick = () => rail.scrollBy({ left: stepW(), behavior: 'smooth' });

/* contact */
const mail = 'mailto:' + C.email;
$('#email-link').href = mail; $('#email-link').textContent = C.email;
$('#wa-link').href = 'https://wa.me/' + C.whatsapp.replace(/\D/g, ''); $('#wa-link').textContent = C.whatsapp;
$('#copy').onclick = async function () {
  try { await navigator.clipboard.writeText(C.email); }
  catch (e) { const t = h('textarea'); t.value = C.email; document.body.append(t); t.select(); safe(() => document.execCommand('copy')); t.remove(); }
  this.textContent = 'Copied'; setTimeout(() => { this.textContent = 'Copy'; }, 1600);
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
const nav = $('#nav'), tl = $('#timeline'); let lastY = scrollY, tick = false;
function onScroll() {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    tick = false;
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.setProperty('--p', max > 0 ? y / max : 0);
    nav.classList.toggle('hide', y > lastY && y > 120); lastY = y;
    const r = $('#process').getBoundingClientRect(), p = clamp((innerHeight * .85 - r.top) / (r.height * .9), 0, 1);
    tl.style.setProperty('--tilt', (reduce ? 0 : 18 * (1 - clamp(p * 2.2, 0, 1))) + 'deg');
    tl.style.setProperty('--ph', p);
    $$('#steps li').forEach((li, i) => li.classList.toggle('on', p > i / 4 + .02));
  });
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();

/* ---------- Effect 1: hanging, stretchy ID card (Verlet rope) ---------- */
const lan = $('#lanyard'), card = $('#card'), strapLine = $('#strap-line'), strapPath = $('#strap-path');
$('#strap-tp').textContent = C.strap.repeat(8);
const N = 12, G = .55, DAMP = .982, MAXV = 16;
let pts = [], seg = 20, ax = 0, ay = 0, cw = 250, ch = 360, pinned = false, running = false, drag = null, rest = 0;
/* tilt state: springs for the 3D tilt (rx, ry) and a gravity angle (ga) that swings the lanyard */
const T = { rx: 0, ry: 0, vx: 0, vy: 0, tx: 0, ty: 0, ga: 0, gt: 0 };
let heroVisible = true;
function tiltStep() {
  const K = .08, D = .17;                       /* spring stiffness and damping */
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
  const DOE = window.DeviceOrientationEvent, needsPerm = !!(DOE && typeof DOE.requestPermission === 'function');
  let bb = null, bg = null, listening = false, enabled = false, pending = false, btn = null;
  const onOrient = e => {
    if (e.beta == null || e.gamma == null) return;
    if (bb == null) { bb = e.beta; bg = e.gamma; }
    bb += (e.beta - bb) * .012; bg += (e.gamma - bg) * .012;     /* slow baseline: the card eases back to rest when the phone is still */
    const db = clamp(e.beta - bb, -40, 40), dg = clamp(e.gamma - bg, -40, 40);
    T.tx = -db * .6;                       /* forward / backward tilt */
    T.ty = dg * .5;                        /* left / right tilt, 3D turn */
    T.gt = dg * Math.PI / 180 * .9;        /* the lanyard swings the way the phone leans */
    wake();
  };
  const attach = () => { if (!listening) { listening = true; addEventListener('deviceorientation', onOrient, { passive: true }); } };
  const detach = () => { if (listening) { listening = false; removeEventListener('deviceorientation', onOrient); bb = bg = null; T.tx = T.ty = T.gt = 0; wake(); } };
  const sync = () => { (enabled && heroVisible && !document.hidden) ? attach() : detach(); };
  async function enable() {
    if (enabled || pending) return; pending = true;
    try {
      if (needsPerm) { const r = await DOE.requestPermission(); if (r !== 'granted') { if (btn) { btn.textContent = 'Motion blocked'; btn.disabled = true; } return; } }
      enabled = true; if (btn) btn.remove(); sync();
    } catch (e) { if (btn) { btn.textContent = 'Motion unavailable'; btn.disabled = true; } }
    finally { pending = false; }
  }
  if (touch && DOE) {
    if (needsPerm) {                       /* iOS asks for permission, and only after a tap */
      btn = h('button', 'motion-btn', 'Tap to enable motion'); btn.type = 'button'; btn.onclick = enable; lan.append(btn);
      card.addEventListener('pointerdown', () => { if (!enabled) enable(); });
    } else { enabled = true; sync(); }     /* Android and others: no prompt needed */
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
})();
layout(!reduce);
let lastW = innerWidth, rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; layout(false); } }, 200); });

/* ---------- loader (timecode) then release the card ---------- */
(function () {
  const t0 = performance.now(), DUR = 800, tc = $('#timecode'); let done = false;
  const finish = () => { if (done) return; done = true; $('#loader').classList.add('done'); if (!reduce) wake(); };
  (function f(now) {
    const t = clamp((now - t0) / DUR, 0, 1);
    tc.textContent = '00:00:00:' + String(Math.floor(t * DUR / 1000 * 24)).padStart(2, '0');
    t < 1 ? requestAnimationFrame(f) : setTimeout(finish, 120);
  })(t0);
  setTimeout(finish, 1800);
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
if (!touch && !reduce && innerWidth > 900 && safe(() => localStorage.getItem('goo-slow')) !== '1') {
  setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(loadGoo) : loadGoo()), 3500);
}
})();

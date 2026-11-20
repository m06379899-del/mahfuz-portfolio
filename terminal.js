/* =====================================================================
   MAHFUZ TERMINAL
   A frontend-only simulation. It never runs real commands: every command is a plain
   JavaScript function in the registry below. No eval(), no new Function(), and user
   text is only ever shown with textContent / text nodes (never as HTML).

   Add a command:   def('name', 'short description', (args) => [ ...lines ]);
   Hidden command:  def('name', '', fn, { hidden: true });
   Open from code:  MTerm.open();   MTerm.run('help');
   Sound:           uses the site's existing sound system through the events
                    'ma:terminal' (command run), 'ma:terminal-key' (key) and 'ma:success' (copy).
   Data (name, skills, projects, contact...) is read from CONTENT in script.js.
   ===================================================================== */
(() => {
'use strict';
if (window.MTerm) return;                                   /* never start twice */
const C = (typeof CONTENT !== 'undefined' && CONTENT) || {};
const rmq = matchMedia('(prefers-reduced-motion: reduce)');
const narrow = () => matchMedia('(max-width: 560px)').matches;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const emit = n => { try { document.dispatchEvent(new CustomEvent(n)); } catch (e) {} };

const CFG = { title: 'MAHFUZ TERMINAL', user: 'mahfuz', host: 'portfolio', version: '1.0', maxLines: 400, maxInput: 200, historyMax: 100, themeKey: 'ma-term-theme' };
const THEMES = { cyber: 'electric blue + neon green (default)', matrix: 'all green, hacker style', amber: 'warm amber', ice: 'cool ice blue' };
const NAME = C.name || 'Mahfuz Ahmed';
const social = n => (C.socials || []).find(s => s.name === n);
const GITHUB = (social('GitHub') && social('GitHub').url) || 'https://github.com/m06379899-del';
const safeUrl = u => { try { const x = new URL(u, location.href); return ['https:', 'mailto:', 'tel:'].indexOf(x.protocol) > -1 ? x.href : null; } catch (e) { return null; } };

/* ---------- line helpers: a line is { parts: [...], cls?, type? } ---------- */
const ln = (...parts) => ({ parts });
const BLANK = ln();
const tx = (t, c) => ({ t: String(t), c });
const dim = t => tx(t, 'dim'), acc = t => tx(t, 'acc'), hi = t => tx(t, 'hi'), ok = t => tx(t, 'ok'), warn = t => tx(t, 'warn'), err = t => tx(t, 'err');
const link = (t, href) => ({ t: String(t), href });

/* ---------- command registry (Map, so names like "constructor" or "__proto__" can never match) ---------- */
const CMDS = new Map();
const def = (name, desc, fn, opts) => CMDS.set(name, { desc, fn, hidden: !!(opts && opts.hidden) });
const publicNames = () => [...CMDS].filter(([, c]) => !c.hidden).map(([n]) => n).sort();

/* ---------- state ---------- */
let built = false, state = 'closed', closeTimer = 0, lastFocus = null, first = true, token = 0, chain = Promise.resolve(), pending = 0;
let launcher, term, out, inp, mirrorB, mirrorA, sugg, live, toast, openCtl = null, toastTimer = 0;
const hist = []; let hIdx = -1, draft = '';
let mx = null;                                              /* running matrix animation */
let konami = [];
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const reduced = () => rmq.matches;
const started = performance.now();

/* ---------- ASCII art ---------- */
const FIG = {
  M: [' __  __ ', '|  \\/  |', '| |\\/| |', '| |  | |', '|_|  |_|'],
  A: ['    _    ', '   / \\   ', '  / _ \\  ', ' / ___ \\ ', '/_/   \\_\\'],
  H: [' _   _ ', '| | | |', '| |_| |', '|  _  |', '|_| |_|'],
  F: [' _____ ', '|  ___|', '| |_   ', '|  _|  ', '|_|    '],
  U: [' _   _ ', '| | | |', '| | | |', '| |_| |', ' \\___/ '],
  Z: [' _____', '|__  /', '  / / ', ' / /_ ', '/____|']
};
const BANNER = [0, 1, 2, 3, 4].map(i => 'MAHFUZ'.split('').map(ch => FIG[ch][i]).join(''));
const LOGO = ['███╗   ███╗ █████╗ ', '████╗ ████║██╔══██╗', '██╔████╔██║███████║', '██║╚██╔╝██║██╔══██║', '██║ ╚═╝ ██║██║  ██║', '╚═╝     ╚═╝╚═╝  ╚═╝'];
const COFFEE = ['    ( (', '     ) )', '  ........', '  |      |]', '  \\      /', '   `----\'', '', '  fresh, hot, and bug-free (probably).'];

const bannerLines = () => [BLANK, ...BANNER.map(r => ({ parts: [tx(r, 'acc')] })), BLANK,
  ln(hi(CFG.title), dim('  v' + CFG.version)), ln(dim('Welcome. A tiny simulated shell for exploring my portfolio.')),
  ln(dim('Type '), ok('help'), dim(' to see what I can do.')), BLANK];

/* ---------- commands ---------- */
def('help', 'Show all available commands', () => {
  const rows = [...CMDS].filter(([, c]) => !c.hidden).sort((a, b) => a[0].localeCompare(b[0])).map(([n, c]) => ln('  ', tx(n.padEnd(10), 'acc'), c.desc));
  return [ln(hi('Available commands')), BLANK, ...rows, BLANK, ln(hi('Keys')),
    ln('  ', ok('↑ ↓'), dim(' history   '), ok('Tab'), dim(' autocomplete   '), ok('Ctrl+L'), dim(' clear   '), ok('Ctrl+C'), dim(' cancel')),
    ln('  ', ok('Esc'), dim(' close   '), ok('Ctrl+`'), dim(' open / close the terminal   '), ok('Shift+Tab'), dim(' reaches the window buttons')),
    BLANK, ln(dim('Tip: a few commands are not listed here. Curious people find them.'))];
});
def('about', 'Display information about me', () => [ln(hi('About me')), BLANK, { type: C.about || 'A student who loves building things with code.' }, BLANK]);
def('whoami', 'Show developer identity', () => [ln(hi(NAME)),
  ln(dim('role      '), C.role || 'Student'), ln(dim('focus     '), (C.skills || []).slice(0, 3).join(' · ')),
  ln(dim('goal      '), 'Software engineer'), ln(dim('user      '), 'uid=1000(' + CFG.user + ') gid=1000(builders)'), BLANK,
  ln(dim(C.tagline || ''))]);
def('skills', 'Display my technical skills', () => [ln(hi('Focus areas')), ...(C.skills || []).map(s => ln('  ', acc('▸ '), s)), BLANK,
  ln(hi('Tools')), ln('  ', (C.tools || []).join('  ·  ')), BLANK, ln(hi('Strengths')), ln('  ', (C.strengths || []).join('  ·  ')), BLANK]);
def('projects', 'Display my portfolio projects', () => {
  const rows = [];
  (C.projects || []).forEach((p, i) => {
    rows.push(ln(acc('[' + (i + 1) + '] '), hi(p.title), '  ', warn(p.status || '')));
    rows.push(ln('    ', p.desc || ''));
    rows.push(ln('    ', dim('stack: '), (p.tech || []).join(', ')));
    rows.push(ln('    ', p.link ? link(p.linkText || 'open project', p.link) : dim('repository link: coming soon')));
    rows.push(BLANK);
  });
  return rows.length ? [ln(hi('Projects')), BLANK, ...rows] : [ln('No projects yet.')];
});
def('github', 'Open my GitHub profile', () => {
  let opened = false;
  try { const href = safeUrl(GITHUB); if (href) { const w = window.open(href, '_blank', 'noopener,noreferrer'); opened = !!w || w === null; } } catch (e) {}
  return [ln(ok('→ '), 'Opening GitHub in a new tab...'), ln('  ', link(GITHUB.replace(/^https:\/\//, ''), GITHUB)), ln(dim('(If nothing opened, your browser blocked the pop-up: use the link above.)'))];
});
def('contact', 'Display contact information', () => {
  const rows = [ln(hi('Contact')), BLANK];
  if (C.email) rows.push(ln(dim('email      '), link(C.email, 'mailto:' + C.email)));
  if (C.whatsapp) rows.push(ln(dim('whatsapp   '), link(C.whatsapp, 'https://wa.me/' + C.whatsapp.replace(/\D/g, ''))));
  (C.socials || []).forEach(s => rows.push(ln(dim(s.name.toLowerCase().padEnd(11)), link(s.url.replace(/^https:\/\/(www\.)?/, ''), s.url))));
  rows.push(BLANK); return rows;
});
def('clear', 'Clear terminal output', () => { clearOut(); return null; });
def('date', 'Display current date and time', () => {
  const d = new Date(), tz = (Intl.DateTimeFormat().resolvedOptions() || {}).timeZone || '';
  return [ln(d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })), ln(acc(d.toLocaleTimeString()), dim('  ' + tz))];
});
def('neofetch', 'Display a system-style profile', () => {
  const mins = Math.max(1, Math.round((performance.now() - started) / 60000));
  const info = [ln(hi(CFG.user), dim('@'), hi(CFG.host)), ln(dim('--------------------')),
    ln(acc('Name     '), NAME), ln(acc('Role     '), C.role || 'Student'), ln(acc('OS       '), 'PortfolioOS (web)'),
    ln(acc('Shell    '), 'mterm ' + CFG.version), ln(acc('Focus    '), (C.skills || []).slice(0, 2).join(', ')),
    ln(acc('Tools    '), (C.tools || []).slice(0, 4).join(', ')), ln(acc('Theme    '), term.dataset.theme),
    ln(acc('Display  '), innerWidth + 'x' + innerHeight), ln(acc('Uptime   '), mins + (mins === 1 ? ' min' : ' mins')),
    ln(acc('Sound    '), (typeof MASound !== 'undefined' && MASound.enabled) ? 'on' : 'off')];
  if (narrow()) return [BLANK, ...LOGO.map(r => ({ parts: [tx(r, 'logo')] })), BLANK, ...info, BLANK];
  const rows = [BLANK], n = Math.max(LOGO.length, info.length);
  for (let i = 0; i < n; i++) rows.push(ln(tx((LOGO[i] || ''.padEnd(19)).padEnd(21), 'logo'), ...(info[i] ? info[i].parts : [])));
  rows.push(BLANK); return rows;
});
def('banner', 'Show terminal welcome banner', () => bannerLines());
def('history', 'Show previous commands', () => hist.length ? hist.map((h, i) => ln(dim(String(i + 1).padStart(4) + '  '), h)) : [ln(dim('No commands yet.'))]);
def('echo', 'Print custom text', args => [ln(args.slice(0, 500))]);
def('theme', 'Change terminal theme', args => {
  const want = args.trim().toLowerCase();
  if (!want) return [ln(hi('Themes')), ...Object.keys(THEMES).map(k => ln('  ', k === term.dataset.theme ? ok('● ') : dim('○ '), tx(k.padEnd(8), 'acc'), dim(THEMES[k]))), BLANK, ln(dim('Use: '), ok('theme <name>'))];
  if (!Object.prototype.hasOwnProperty.call(THEMES, want)) return [ln(err('Unknown theme: '), want.slice(0, 40)), ln(dim('Available: ' + Object.keys(THEMES).join(', ')))];
  applyTheme(want, true); return [ln(ok('✓ '), 'Theme set to ', acc(want))];
});
def('matrix', 'Show a Matrix-inspired visual animation', () => { startMatrix(); return null; });
def('exit', 'Close the terminal', () => { setTimeout(() => close(), reduced() ? 0 : 450); return [ln(dim('Closing terminal... see you soon.'))]; });
/* hidden commands (easter eggs) */
def('sudo', '', args => /\brm\b/i.test(args)
  ? [ln(err('Nice try. '), 'This is a simulation: nothing here can delete anything, and my files are safe.')]
  : [ln(dim('[sudo] password for visitor: ********')), ln(err('Permission denied: '), 'visitor is not in the sudoers file. This incident will be reported to the coffee machine.')], { hidden: true });
def('coffee', '', () => [BLANK, ...COFFEE.map(r => ({ parts: [tx(r, 'warn')] })), BLANK], { hidden: true });
def('secret', '', () => [ln(ok('▌secret unlocked')), BLANK, { type: 'You found it. Ship small things, learn loudly, and never stop building. The best portfolio is a pile of finished projects. - M.' }, BLANK], { hidden: true });
def('konami', '', () => { konamiFx(); return [ln(ok('↑ ↑ ↓ ↓ ← → ← → B A')), ln(hi('KONAMI CODE ACCEPTED'), dim('  +30 lives, +1 coffee'))]; }, { hidden: true });

/* ---------- rendering (text nodes only) ---------- */
function renderLine(l) {
  const row = el('div', 't-line' + (l.cls ? ' ' + l.cls : ''));
  (l.parts || []).forEach(p => {
    if (typeof p === 'string') { row.append(document.createTextNode(p)); return; }
    const href = p.href ? safeUrl(p.href) : null;
    if (p.href) {
      const a = el('a', 't-link', p.t);
      if (href) { a.href = href; if (href.indexOf('http') === 0) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } } row.append(a);
    } else row.append(p.c ? el('span', 't-' + p.c, p.t) : document.createTextNode(p.t));
  });
  return row;
}
const toBottom = () => { out.scrollTop = out.scrollHeight; };
function addRow(row) {
  if (!reduced()) row.classList.add('t-in');
  out.append(row);
  while (out.children.length > CFG.maxLines) out.firstChild.remove();
  toBottom();
}
async function typeInto(row, text, tok) {
  const node = document.createTextNode(''); row.append(node);
  if (reduced()) { node.data = text; return; }
  for (let i = 0; i < text.length; i += 3) { if (tok !== token) { node.data = text; return; } node.data = text.slice(0, i + 3); toBottom(); await sleep(10); }
  node.data = text;
}
async function print(lines, tok) {
  const gap = reduced() ? 0 : Math.min(26, Math.max(5, 600 / Math.max(1, lines.length)));
  for (const l of lines) {
    if (tok !== token) return;
    if (l.type != null) { const row = el('div', 't-line'); addRow(row); await typeInto(row, l.type, tok); }
    else addRow(renderLine(l));
    if (gap) await sleep(gap);
  }
}
function echoCommand(raw) {
  const row = el('div', 't-line t-cmd');
  row.append(el('span', 't-pu', CFG.user), el('span', 't-ph', '@' + CFG.host), document.createTextNode(':~$ '));
  row.append(document.createTextNode(raw)); addRow(row);
}
function clearOut() { token++; stopMatrix(); out.replaceChildren(); }

/* ---------- running commands (one at a time, in order) ---------- */
function parse(raw) {
  const m = raw.trim().match(/^(\S+)(?:\s+([\s\S]*))?$/);
  return m ? { name: m[1].toLowerCase(), args: m[2] || '' } : null;
}
function lev(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
function unknown(name) {
  let best = null, bd = 3; publicNames().forEach(n => { const d = lev(name, n); if (d < bd) { bd = d; best = n; } });
  const rows = [ln(err('Hmm, '), "I don't know the command ", hi("'" + name.slice(0, 40) + "'"), '.')];
  rows.push(best ? ln(dim('Did you mean '), ok(best), dim('? Or type '), ok('help'), dim(' to see everything.')) : ln(dim('Type '), ok('help'), dim(' to see what I can do.')));
  return rows;
}
function run(raw) {
  raw = String(raw == null ? '' : raw).slice(0, CFG.maxInput);
  pending++; term.setAttribute('aria-busy', 'true');
  chain = chain.then(() => exec(raw)).catch(() => {}).then(() => { if (--pending <= 0) { pending = 0; term.removeAttribute('aria-busy'); } });
  return chain;
}
async function exec(raw) {
  stopMatrix();
  const p = parse(raw);
  if (!raw.trim()) { echoCommand(''); return; }
  echoCommand(raw); const tok = token;
  if (hist[hist.length - 1] !== raw.trim()) { hist.push(raw.trim()); if (hist.length > CFG.historyMax) hist.shift(); }
  hIdx = -1; draft = '';
  emit('ma:terminal');
  const spin = el('div', 't-line t-dim t-run', 'working'); if (!reduced()) { out.append(spin); toBottom(); await sleep(150); spin.remove(); }
  const c = CMDS.get(p.name);
  let lines;
  try { lines = c ? c.fn(p.args) : unknown(p.name); } catch (e) { lines = [ln(err('Something went wrong running that command.'))]; }
  if (lines) await print(lines, tok);
  live.textContent = '';
}

/* ---------- matrix rain (cleans itself up) ---------- */
function startMatrix() {
  stopMatrix();
  if (reduced()) { addRow(renderLine(ln(dim('Matrix animation is off because you prefer reduced motion.')))); return; }
  const cv = el('canvas', 't-matrix'); cv.setAttribute('aria-hidden', 'true'); const wrap = el('div', 't-line'); wrap.append(cv); addRow(wrap);
  const w = Math.max(200, out.clientWidth - 32), h = 180, dpr = Math.min(devicePixelRatio || 1, 2); cv.width = w * dpr; cv.height = h * dpr;
  const g = cv.getContext('2d'); if (!g) { wrap.remove(); return; }
  g.scale(dpr, dpr);
  const size = 14, cols = Math.floor(w / size), drops = Array.from({ length: cols }, () => Math.random() * (h / size)), chars = '01<>[]{}/\\|+-=*#$@%&';
  const t0 = performance.now(); let last = 0;
  const m = { cv, wrap, raf: 0 }; mx = m;
  const accent = getComputedStyle(term).getPropertyValue('--t-prompt').trim() || '#39ff88';
  const frame = now => {
    if (mx !== m) return; m.raf = requestAnimationFrame(frame);
    if (now - last < 45) return; last = now;
    g.fillStyle = 'rgba(2,6,4,.16)'; g.fillRect(0, 0, w, h); g.font = size + 'px monospace';
    for (let i = 0; i < cols; i++) {
      g.fillStyle = Math.random() > .96 ? '#fff' : accent;
      g.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, drops[i] * size);
      if (drops[i] * size > h && Math.random() > .975) drops[i] = 0; drops[i] += 1;
    }
    if (now - t0 > 7000) stopMatrix();
  };
  m.raf = requestAnimationFrame(frame);
}
function stopMatrix() {
  if (!mx) return; const m = mx; mx = null; cancelAnimationFrame(m.raf);
  if (m.wrap && m.wrap.isConnected) { m.wrap.replaceChildren(); m.wrap.append(document.createTextNode('[matrix ended]')); m.wrap.classList.add('t-dim'); }
}
function konamiFx() {
  if (reduced()) return; term.classList.remove('t-konami'); void term.offsetWidth; term.classList.add('t-konami');
  setTimeout(() => term.classList.remove('t-konami'), 2700);
}

/* ---------- theme ---------- */
function applyTheme(name, save) {
  if (!Object.prototype.hasOwnProperty.call(THEMES, name)) name = 'cyber';
  term.dataset.theme = name; if (save) { try { localStorage.setItem(CFG.themeKey, name); } catch (e) {} }
}

/* ---------- input: cursor mirror, suggestions, history, autocomplete ---------- */
function syncMirror() {
  const v = inp.value, a = inp.selectionStart == null ? v.length : inp.selectionStart;
  mirrorB.textContent = v.slice(0, a); mirrorA.textContent = v.slice(a);
}
function chip(label, cls) { const b = el('button', 't-chip' + (cls ? ' ' + cls : ''), label); b.type = 'button'; b.tabIndex = -1; return b; }
function renderSugg() {
  const v = inp.value, low = v.toLowerCase(), list = [];
  let mode = 'quick';
  if (!v.trim()) ['help', 'about', 'skills', 'projects', 'contact', 'clear'].forEach(n => list.push(n));
  else if (/^theme\s+/.test(low)) { mode = 'arg'; const a = low.replace(/^theme\s+/, ''); Object.keys(THEMES).filter(t => t.indexOf(a) === 0).forEach(t => list.push('theme ' + t)); }
  else if (!/\s/.test(v)) { mode = 'fill'; publicNames().filter(n => n.indexOf(low) === 0).forEach(n => list.push(n)); }
  sugg.replaceChildren();
  list.slice(0, 8).forEach((n, i) => {
    const b = chip(n, mode !== 'quick' && i === 0 ? 't-lead' : ''); b.setAttribute('aria-label', (mode === 'quick' ? 'Run ' : 'Use ') + n);
    b.addEventListener('click', () => { if (mode === 'quick') { run(n); } else { inp.value = n + ' '; syncMirror(); renderSugg(); } inp.focus({ preventScroll: true }); });
    sugg.append(b);
  });
}
function setValue(v) { inp.value = v; syncMirror(); renderSugg(); requestAnimationFrame(() => { inp.setSelectionRange(v.length, v.length); syncMirror(); }); }
function complete() {
  const v = inp.value; if (!v) return;
  const m = v.match(/^(\S*)(\s+)?([\s\S]*)$/), head = m[1].toLowerCase(), hasSpace = !!m[2], tail = (m[3] || '').toLowerCase();
  let cands, prefix = '';
  if (!hasSpace) cands = publicNames().filter(n => n.indexOf(head) === 0);
  else if (head === 'theme') { cands = Object.keys(THEMES).filter(t => t.indexOf(tail) === 0); prefix = 'theme '; }
  else return;
  if (!cands.length) return;
  const common = cands.reduce((a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return a.slice(0, i); });
  const typed = hasSpace ? tail : head;
  if (cands.length === 1) setValue(prefix + cands[0] + (hasSpace ? '' : ' '));
  else if (common.length > typed.length) setValue(prefix + common);
  else { const row = el('div', 't-line t-dim', cands.join('   ')); echoCommand(v); addRow(row); }
}
function historyStep(dir) {
  if (!hist.length) return;
  if (hIdx === -1) { if (dir > 0) return; draft = inp.value; hIdx = hist.length - 1; }
  else { hIdx += dir; if (hIdx >= hist.length) { hIdx = -1; setValue(draft); return; } if (hIdx < 0) hIdx = 0; }
  setValue(hist[hIdx]);
}
function onKey(e) {
  if (e.isComposing) return;
  const k = e.key;
  konami.push(k.length === 1 ? k.toLowerCase() : k); if (konami.length > KONAMI.length) konami.shift();
  if (konami.length === KONAMI.length && konami.every((x, i) => x === KONAMI[i])) { konami = []; setTimeout(() => run('konami'), 0); }
  if (mx && k !== 'Shift' && k !== 'Control' && k !== 'Escape') stopMatrix();   /* any key ends the matrix; Esc is handled by the window (first Esc = stop matrix, next Esc = close) */
  if (k === 'Enter') { e.preventDefault(); const v = inp.value; setValue(''); run(v); return; }
  if (k === 'ArrowUp') { e.preventDefault(); historyStep(-1); return; }
  if (k === 'ArrowDown') { e.preventDefault(); historyStep(1); return; }
  if (k === 'Tab' && !e.shiftKey) { e.preventDefault(); complete(); return; }
  if (e.ctrlKey && !e.altKey && !e.metaKey) {
    const c = k.toLowerCase();
    if (c === 'l') { e.preventDefault(); clearOut(); return; }
    if (c === 'u') { e.preventDefault(); setValue(''); return; }
    if (c === 'c' && !window.getSelection().toString()) { e.preventDefault(); token++; stopMatrix(); echoCommand(inp.value + '^C'); setValue(''); return; }
  }
  if (k.length === 1 && !e.ctrlKey && !e.metaKey) emit('ma:terminal-key');
}
const onInput = () => { syncMirror(); renderSugg(); if (hIdx !== -1 && inp.value !== hist[hIdx]) hIdx = -1; };

/* ---------- window controls, focus, keyboard viewport ---------- */
const bigVisible = s => s === 'open' || s === 'max';
function setState(next) {
  const prev = state; state = next;
  term.classList.toggle('min', next === 'min'); term.classList.toggle('max', next === 'max');
  launcher.setAttribute('aria-expanded', bigVisible(next) || next === 'min' ? 'true' : 'false');
  const minBtn = term.querySelector('.tl-min'), maxBtn = term.querySelector('.tl-max');
  minBtn.setAttribute('aria-label', next === 'min' ? 'Restore terminal' : 'Minimize terminal');
  maxBtn.setAttribute('aria-label', next === 'max' ? 'Restore terminal size' : 'Maximize terminal');
  if (bigVisible(prev) !== bigVisible(next)) emit(bigVisible(next) ? 'ma:terminal-open' : 'ma:terminal-close');
}
function trap(e) {
  if (e.key !== 'Tab' || e.defaultPrevented) return;
  const f = [...term.querySelectorAll('button:not([tabindex="-1"]), [tabindex="0"], input')].filter(n => n.offsetParent !== null || n === inp);
  if (!f.length) return; const i = f.indexOf(document.activeElement);
  if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
  else if (!e.shiftKey && (i === f.length - 1 || i === -1)) { e.preventDefault(); f[0].focus(); }
}
function bindOpen() {
  openCtl = new AbortController(); const sig = { signal: openCtl.signal };
  document.addEventListener('selectionchange', () => { if (document.activeElement === inp) syncMirror(); }, sig);
  term.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); if (mx) stopMatrix(); else close(); }
    else trap(e);
  }, sig);
  const vv = window.visualViewport;
  if (vv) {                                                  /* phone keyboards: keep the window above the keyboard */
    const upd = () => { term.style.setProperty('--kb', Math.max(0, innerHeight - (vv.height + vv.offsetTop)) + 'px'); term.style.setProperty('--vvh', vv.height + 'px'); };
    vv.addEventListener('resize', upd, sig); vv.addEventListener('scroll', upd, sig); upd();
  }
}
function open() {
  if (!built) return;
  if (state === 'min') { setState('open'); inp.focus({ preventScroll: true }); return; }
  if (state !== 'closed') { inp.focus({ preventScroll: true }); return; }
  clearTimeout(closeTimer); lastFocus = document.activeElement;
  term.hidden = false; void term.offsetWidth; term.classList.add('open'); setState('open'); bindOpen();
  if (first) { first = false; chain = chain.then(() => print(bannerLines(), token)); }
  inp.focus({ preventScroll: true }); syncMirror(); renderSugg();
}
function close() {
  if (state === 'closed') return;
  stopMatrix(); token++; term.classList.remove('open'); setState('closed');
  if (openCtl) { openCtl.abort(); openCtl = null; }
  term.style.removeProperty('--kb'); term.style.removeProperty('--vvh');
  closeTimer = setTimeout(() => { if (state === 'closed') { term.hidden = true; term.classList.remove('min', 'max', 't-konami'); } }, reduced() ? 0 : 300);
  const back = (lastFocus && lastFocus.isConnected && lastFocus !== document.body) ? lastFocus : launcher; (back || launcher).focus({ preventScroll: true });
}
const toggle = () => { if (state === 'closed') open(); else if (state === 'min') open(); else close(); };

function transcript() { return [...out.children].map(r => r.textContent).join('\n').replace(/\n{3,}/g, '\n\n').trim(); }
async function copyOut() {
  const text = transcript(); let okc = false;
  try { await navigator.clipboard.writeText(text); okc = true; }
  catch (e) { try { const t = el('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.append(t); t.select(); okc = document.execCommand('copy'); t.remove(); } catch (e2) {} }
  toast.textContent = okc ? 'Copied' : 'Copy failed'; toast.classList.add('on'); live.textContent = okc ? 'Terminal output copied' : 'Could not copy';
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.classList.remove('on'); live.textContent = ''; }, 1600);
  if (okc) emit('ma:success');
}

/* ---------- build the DOM once (static markup only: no user data goes through innerHTML) ---------- */
function build() {
  if (built) return; built = true;
  document.body.insertAdjacentHTML('beforeend',
    '<button type="button" id="term-open" aria-haspopup="dialog" aria-expanded="false" aria-controls="term" title="Open terminal (Ctrl + `)">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7l5 5-5 5"/><path d="M12 17h7"/></svg><span class="term-open-label">Terminal</span><span class="term-open-dot" aria-hidden="true"></span></button>' +
    '<section id="term" class="term" role="dialog" aria-modal="false" aria-labelledby="term-title" data-theme="cyber" hidden>' +
      '<header class="term-bar"><div class="term-lights">' +
        '<button type="button" class="tl tl-close" data-g="×" aria-label="Close terminal"></button>' +
        '<button type="button" class="tl tl-min" data-g="–" aria-label="Minimize terminal"></button>' +
        '<button type="button" class="tl tl-max" data-g="+" aria-label="Maximize terminal"></button></div>' +
        '<div class="term-title" id="term-title"></div>' +
        '<div class="term-tools"><span class="term-toast" aria-hidden="true"></span><button type="button" class="term-copy" aria-label="Copy terminal output"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg></button></div></header>' +
      '<div class="term-body"><div class="term-out" id="term-out" role="log" aria-live="polite" aria-relevant="additions" aria-label="Terminal output" tabindex="0"></div>' +
        '<div class="term-sugg" id="term-sugg" aria-label="Command suggestions"></div>' +
        '<div class="term-line"><label class="term-prompt" for="term-in"><span class="t-pu"></span><span class="t-ph"></span><span class="t-pd">:~</span><span class="t-ps">$</span></label>' +
          '<div class="term-field"><span class="term-mirror" aria-hidden="true"><span class="t-b"></span><i class="t-cur"></i><span class="t-a"></span></span>' +
          '<input id="term-in" class="term-input" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="send" inputmode="text" aria-label="Terminal command. Type help for commands." /></div></div></div>' +
      '<div class="t-sr" role="status" aria-live="polite" id="term-live"></div></section>');
  launcher = document.getElementById('term-open'); term = document.getElementById('term'); out = document.getElementById('term-out');
  inp = document.getElementById('term-in'); sugg = document.getElementById('term-sugg'); live = document.getElementById('term-live'); toast = term.querySelector('.term-toast');
  mirrorB = term.querySelector('.t-b'); mirrorA = term.querySelector('.t-a');
  term.querySelector('.term-title').append(document.createTextNode(CFG.title.split(' ')[0] + ' '), el('b', '', CFG.title.split(' ')[1]));
  term.querySelector('.t-pu').textContent = CFG.user; term.querySelector('.t-ph').textContent = '@' + CFG.host;
  inp.maxLength = CFG.maxInput;
  let saved = null; try { saved = localStorage.getItem(CFG.themeKey); } catch (e) {} applyTheme(saved || 'cyber', false);

  launcher.addEventListener('click', toggle);
  term.querySelector('.tl-close').addEventListener('click', close);
  term.querySelector('.tl-min').addEventListener('click', () => { if (state === 'min') setState('open'); else setState('min'); if (state !== 'min') inp.focus({ preventScroll: true }); });
  term.querySelector('.tl-max').addEventListener('click', () => { setState(state === 'max' ? 'open' : 'max'); inp.focus({ preventScroll: true }); });
  term.querySelector('.term-bar').addEventListener('click', e => { if (state === 'min' && !e.target.closest('button')) { setState('open'); inp.focus({ preventScroll: true }); } });
  term.querySelector('.term-copy').addEventListener('click', copyOut);
  term.querySelector('.term-body').addEventListener('click', e => {      /* tap anywhere in the window to type (but never steal a text selection or a link) */
    if (e.target.closest('a,button')) return; if (window.getSelection().toString()) return; inp.focus({ preventScroll: true });
  });
  inp.addEventListener('keydown', onKey); inp.addEventListener('input', onInput);
  inp.addEventListener('focus', syncMirror); inp.addEventListener('keyup', syncMirror); inp.addEventListener('click', syncMirror);
  /* one global shortcut: Ctrl + ` (or Cmd + `) opens or closes the terminal */
  document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === '`' || e.code === 'Backquote')) { e.preventDefault(); toggle(); } });
  syncMirror(); requestAnimationFrame(() => launcher.classList.add('show'));
}

window.MTerm = Object.freeze({
  open, close, toggle, run,
  get state() { return state; },
  get commands() { return publicNames(); },
  debug: () => ({ lines: out ? out.children.length : 0, history: hist.length, matrix: !!mx, openListeners: !!openCtl, pending })
});
const start = () => build();
if (window.MALoader) { MALoader.done.then(start); setTimeout(start, 9000); } else if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();

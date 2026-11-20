/* Mahfuz's AI Portfolio Assistant — chat widget (self-contained, no dependencies). */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const WELCOME_EN = "Hi! I'm **Mahfuz's AI Portfolio Assistant**. Ask me anything about Mahfuz — his projects, coding journey, or interest in AI. You can talk to me in **Bangla** or **English**!";
const WELCOME_BN = "হাই! আমি **মাহফুজের AI পোর্টফোলিও অ্যাসিস্ট্যান্ট**। মাহফুজের প্রজেক্ট, কোডিং জার্নি বা AI-তে আগ্রহ নিয়ে যেকোনো প্রশ্ন করুন। আপনি **বাংলা** বা **ইংরেজি** — যেকোনো ভাষায় কথা বলতে পারেন!";
const SUGGESTIONS = [
  { en: 'Who is Mahfuz?', bn: 'মাহফুজ কে?' },
  { en: 'Tell me about his coding journey.', bn: 'ওর কোডিং জার্নি বলো' },
  { en: 'What projects has he built?', bn: 'ওর কী কী প্রজেক্ট আছে?' },
  { en: 'What is JARVIS?', bn: 'JARVIS কী?' },
  { en: 'What are his future goals?', bn: 'ওর ভবিষ্যৎ পরিকল্পনা কী?' }
];
const ERR_BN = 'দুঃখিত, একটা সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।';
const ERR_EN = 'Sorry, something went wrong. Please try again in a moment.';

/* ---------- safe mini-markdown ---------- */
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function md(src) {
  const codeBlocks = [];
  let text = esc(src.trim());
  /* fenced code blocks */
  text = text.replace(/```([\w-]*)\n?([\s\S]*?)(?:```|$)/g, (_, lang, code) => {
    codeBlocks.push(`<pre><code>${code.replace(/\n+$/, '')}</code></pre>`);
    return `\u0000CB${codeBlocks.length - 1}\u0000`;
  });
  /* inline code */
  text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>');
  /* links (https only) */
  text = text.replace(/\[([^\]]{1,80})\]\((https?:\/\/[^\s)]{1,200})\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  /* bold / italic */
  text = text.replace(/\*\*([^*\n](?:[^*\n]*[^*\n])?)\*\*/g, '<b>$1</b>');
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,!?)]|$)/g, '$1<i>$2</i>');
  /* block-level: split into blocks, build lists and paragraphs */
  const lines = text.split('\n');
  let out = '', list = null;
  const flush = () => { if (list) { out += `<${list.tag}>${list.items.map(i => `<li>${i}</li>`).join('')}</${list.tag}>`; list = null; } };
  for (const raw of lines) {
    const line = raw.trim();
    const ul = line.match(/^[-•]\s+(.+)/), ol = line.match(/^\d+[.)]\s+(.+)/), h = line.match(/^#{1,6}\s+(.+)/);
    if (ul || ol) {
      const tag = ul ? 'ul' : 'ol';
      if (!list || list.tag !== tag) { flush(); list = { tag, items: [] }; }
      list.items.push((ul || ol)[1]);
    } else if (!line) {
      flush();
    } else if (h) {
      flush(); out += `<p><b>${h[1]}</b></p>`;
    } else {
      flush();
      if (out.endsWith('</p>')) out = out.slice(0, -4) + '<br>' + line + '</p>';
      else out += `<p>${line}</p>`;
    }
  }
  flush();
  /* restore code blocks */
  out = out.replace(/\u0000CB(\d+)\u0000/g, (_, i) => codeBlocks[+i]);
  return out || '<p>…</p>';
}

/* ---------- build UI ---------- */
const SPARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.7a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.7-1.9a2 2 0 0 0 1.3-1.3z"/></svg>';
const BOT = '<svg class="ai-bot" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6.2V3.4"/><circle class="tip" cx="12" cy="2.6" r="1.2"/><rect x="4.5" y="6.2" width="15" height="13" rx="4.5"/><circle class="eye" cx="9.3" cy="12" r="1.7" stroke="none"/><circle class="eye r" cx="14.7" cy="12" r="1.7" stroke="none"/><path d="M9.5 16h5"/><path d="M2.2 11.5v3M21.8 11.5v3"/></svg>';
const COPY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>';

const root = document.createElement('div');
root.innerHTML = `
<button id="ai-fab" aria-label="Open Mahfuz's AI assistant" aria-expanded="false" aria-controls="ai-panel">
  <span class="ai-ring" aria-hidden="true"></span>
  ${BOT}<span class="ai-dot" aria-hidden="true"></span>
</button>
<section id="ai-panel" role="dialog" aria-label="Mahfuz's AI Portfolio Assistant" aria-hidden="true">
  <header class="ai-head">
    <div class="ai-avatar" aria-hidden="true">${BOT}</div>
    <div class="ai-id"><b>Mahfuz's AI Assistant</b><span>ONLINE</span></div>
    <button class="ai-head-btn" id="ai-clear" aria-label="Clear conversation">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6"/></svg>
    </button>
    <button class="ai-head-btn" id="ai-close" aria-label="Close chat">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </header>
  <div class="ai-msgs" id="ai-msgs" role="log" aria-live="polite"></div>
  <div class="ai-suggest" id="ai-suggest"></div>
  <div class="ai-input">
    <textarea id="ai-text" rows="1" placeholder="Ask in Bangla or English…" aria-label="Your message"></textarea>
    <button class="ai-send" id="ai-send" aria-label="Send message">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
    </button>
  </div>
</section>`;
document.body.append(root);

const fab = $('#ai-fab'), panel = $('#ai-panel'), msgs = $('#ai-msgs'),
      suggest = $('#ai-suggest'), input = $('#ai-text'), send = $('#ai-send');

/* ---------- state ---------- */
let history = [];        /* [{role:'user'|'assistant', content}] */
let busy = false;
let lastLang = null;     /* 'bn' | 'en' — remembered for error messages */

const isBangla = s => /[ঀ-৿]/.test(s);
const banglishRe = /\b(ami|tumi|apni|she|tar|tar|ke|ki|kothay|kobe|kore|korchhe|bolo|bolen|janina|ase|ache|chilo|hobe|koro|korle|amar|tomar|apnar|er|tay|bhabey|hobe)\b|\b(o|oi)\s+(ki|kemon|kothay)\b/i;
const detectLang = s => isBangla(s) ? 'bn' : (banglishRe.test(s) ? 'bn-latin' : 'en');

/* ---------- rendering ---------- */
const atBottom = () => msgs.scrollHeight - msgs.scrollTop - msgs.clientHeight < 60;
const scrollDown = () => { if (reduce) msgs.scrollTop = msgs.scrollHeight; else msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' }); };

function addRow(role, html) {
  const row = document.createElement('div');
  row.className = 'ai-row ' + (role === 'user' ? 'user' : 'ai');
  if (role !== 'user') {
    const av = document.createElement('div');
    av.className = 'ai-av'; av.setAttribute('aria-hidden', 'true'); av.innerHTML = BOT;
    row.append(av);
  }
  const bubble = document.createElement('div');
  bubble.className = 'ai-bubble';
  bubble.innerHTML = html;
  row.append(bubble);
  msgs.append(row);
  scrollDown();
  return bubble;
}

function addWelcome() {
  const lang = (navigator.language || '').toLowerCase().startsWith('bn') ? 'bn' : 'en';
  addRow('assistant', `<p>${lang === 'bn' ? WELCOME_BN : WELCOME_EN}</p>`);
}

function showSuggestions(show) {
  suggest.hidden = !show;
  if (!show) { suggest.innerHTML = ''; return; }
  const lang = history.some(m => m.role === 'user' && isBangla(m.content)) || lastLang === 'bn' ? 'bn' : 'en';
  suggest.innerHTML = '';
  SUGGESTIONS.forEach(s => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'ai-chip'; b.textContent = lang === 'bn' ? s.bn : s.en;
    b.addEventListener('click', () => { submit(lang === 'bn' ? s.bn : s.en); });
    suggest.append(b);
  });
}

function addCopy(bubble, getText) {
  const meta = document.createElement('div');
  meta.className = 'ai-meta';
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'ai-copy';
  btn.innerHTML = COPY_ICON + '<span>Copy</span>';
  btn.setAttribute('aria-label', 'Copy this response');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(getText());
      btn.querySelector('span').textContent = 'Copied!';
      setTimeout(() => { btn.querySelector('span').textContent = 'Copy'; }, 1600);
    } catch { /* clipboard blocked — silently ignore */ }
  });
  meta.append(btn);
  bubble.append(meta);
}

function addError(text) {
  const lang = lastLang === 'bn' || (history.at(-1)?.role === 'user' && isBangla(history.at(-1).content)) ? 'bn' : 'en';
  const bubble = addRow('assistant', `<p class="err" style="margin:0">${esc(text || (lang === 'bn' ? ERR_BN : ERR_EN))}</p>`);
  bubble.classList.add('err');
}

/* ---------- streaming ---------- */
async function stream(message) {
  busy = true; send.disabled = true;
  const thinking = addRow('assistant', '<span class="ai-typing" aria-label="Assistant is typing"><i></i><i></i><i></i></span>');
const removeThinking = () => thinking.closest('.ai-row')?.remove();
  let target = null, text = '', caret = null, renderedUntil = -1;

  const ensure = () => {
    if (target) return;
    thinking.innerHTML = '';
    target = document.createElement('div');
    caret = document.createElement('span'); caret.className = 'ai-caret'; caret.setAttribute('aria-hidden', 'true');
    target.append(caret);
    thinking.append(target);
  };

  const paint = force => {
    if (!target) return;
    /* re-render markdown at most ~10x/sec while streaming */
    const now = performance.now();
    if (!force && now - renderedUntil < 100) return;
    renderedUntil = now;
    const keep = atBottom();
    target.innerHTML = md(text);
    target.append(caret);
    if (keep) scrollDown();
  };

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message, history: history.slice(-12) })
    });

    if (!res.ok) {
      let msg = '';
      try { msg = (await res.json()).error || ''; } catch { /* generic */ }
      removeThinking();
      addError(msg);
      return;
    }

    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = '';
    let streamErr = null;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        let j; try { j = JSON.parse(line.slice(5)); } catch { continue; }
        if (j.t === 'chunk' && j.v) { ensure(); text += j.v; paint(false); }
        else if (j.t === 'error') streamErr = j.v;
        else if (j.t === 'done') { buf = ''; }
      }
    }

    if (!text && streamErr) { removeThinking(); addError(streamErr); return; }
    if (!text) { removeThinking(); addError(); return; }

    paint(true);
    caret.remove();
    if (streamErr) {
      const warn = document.createElement('p');
      warn.className = 'err'; warn.style.cssText = 'margin:6px 0 0;font-size:12.5px';
      warn.textContent = streamErr;
      thinking.append(warn);
    }
    addCopy(thinking, () => text);
    history.push({ role: 'assistant', content: text });
    scrollDown();

  } catch (e) {
    if (text) {
      paint(true); caret.remove();
      addCopy(thinking, () => text);
      history.push({ role: 'assistant', content: text });
    } else {
      removeThinking();
      addError(navigator.onLine ? '' : (isBangla(message) ? 'ইন্টারনেট সংযোগ নেই।' : 'No internet connection.'));
    }
  } finally {
    busy = false; send.disabled = false;
  }
}

/* ---------- send flow ---------- */
function submit(text) {
  const message = (text ?? input.value).trim();
  if (!message || busy) return;
  input.value = ''; input.style.height = 'auto';
  lastLang = detectLang(message);
  addRow('user', `<p style="margin:0">${esc(message)}</p>`);
  history.push({ role: 'user', content: message });
  showSuggestions(false);
  stream(message);
}

send.addEventListener('click', () => submit());
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); }
});
input.addEventListener('input', () => {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 96) + 'px';
});

/* ---------- open / close / clear ---------- */
function setOpen(open) {
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', String(!open));
  fab.setAttribute('aria-expanded', String(open));
  fab.setAttribute('aria-label', open ? 'Close Mahfuz\'s AI assistant' : 'Open Mahfuz\'s AI assistant');
  if (open) setTimeout(() => input.focus({ preventScroll: true }), 250);
}
fab.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
$('#ai-close').addEventListener('click', () => { setOpen(false); fab.focus(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panel.classList.contains('open')) { setOpen(false); fab.focus(); }
});

$('#ai-clear').addEventListener('click', () => {
  if (busy) return;
  history = []; lastLang = null;
  msgs.innerHTML = '';
  addWelcome();
  showSuggestions(true);
  input.value = ''; input.style.height = 'auto';
  input.focus({ preventScroll: true });
});

/* ---------- boot ---------- */
addWelcome();
showSuggestions(true);
})();

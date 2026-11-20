/* Local dev server: serves the static portfolio and wires /api/chat to the
   same serverless function used in production. Run:  node dev-server.mjs
   Put your key in .env (see .env.example) first. Requires Node 18+. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import handler from './netlify/functions/chat.mjs';

/* minimal .env loader (no dependencies); re-reads on every API call so you can
   paste your key into .env without restarting the server */
async function loadEnv() {
  try {
    const env = await readFile('.env', 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* no .env file */ }
}
await loadEnv();

const ROOT = process.cwd();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.md': 'text/markdown',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (url.pathname === '/api/chat') {
      await loadEnv();
      const body = await new Promise((ok) => {
        let d = ''; req.on('data', c => d += c); req.on('end', () => ok(d));
      });
      const headers = new Headers({ 'x-forwarded-for': req.socket.remoteAddress || 'local' });
      const r = await handler(new Request('http://localhost/api/chat', {
        method: req.method, headers, body: req.method === 'POST' ? body : undefined
      }));
      res.writeHead(r.status, Object.fromEntries(r.headers));
      const buf = r.body ? Buffer.from(await r.arrayBuffer()) : null;
      res.end(buf);
      return;
    }

    let file = normalize(decodeURIComponent(url.pathname)).replace(/^([/\\])+/, '');
    if (!file || file.endsWith('/')) file += 'index.html';
    const path = join(ROOT, file);
    if (!path.startsWith(ROOT) || !existsSync(path)) { res.writeHead(404); res.end('Not found'); return; }
    const data = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    console.error(e);
    res.writeHead(500); res.end('Server error');
  }
});

const PORT = process.env.PORT || 8888;
server.listen(PORT, () => console.log(`Portfolio running at http://localhost:${PORT}`));

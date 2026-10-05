import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safePath = path.resolve(root, `.${requestPath === '/' ? '/index.html' : requestPath}`);
  if (!safePath.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(safePath, (error, data) => {
    if (error) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': mime[path.extname(safePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  });
});
server.listen(4173, '127.0.0.1', () => console.log('Preview running at http://127.0.0.1:4173'));


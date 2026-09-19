import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer-core';

const ROUTES = [
  '/',
  '/about',
  '/who-we-are',
  '/our-work',
  '/request-service',
  '/enterprise-consultation',
  '/join-us',
];

// Route-specific marker that proves real page rendered (not spinner)
const READY_SELECTOR = {
  '/': '.home-hero-bw h1',
  '/about': '.about-page .about-title',
  '/who-we-are': '.founder-card',
  '/our-work': '.work-project-card',
  '/request-service': '.pricing-plans-section',
  '/enterprise-consultation': '.request-service-page',
  '/join-us': '.join-us-page',
};

const PREVIEW_PORT = 4173;
const PREVIEW_HOST = '127.0.0.1';
const PREVIEW_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
const CHROME_PATH = '/usr/bin/google-chrome';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error(`Preview server not ready at ${url} after ${timeout}ms`);
}

async function startPreview() {
  console.log('[prerender] starting vite preview...');
  const proc = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT), '--host', PREVIEW_HOST, '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proc.stdout.on('data', d => process.stdout.write(`[preview] ${d}`));
  proc.stderr.on('data', d => process.stderr.write(`[preview] ${d}`));
  proc.on('error', e => console.error('[preview] spawn error', e));
  await waitForServer(PREVIEW_URL);
  console.log('[prerender] preview ready at', PREVIEW_URL);
  return proc;
}

async function killPreview(proc) {
  if (!proc) return;
  proc.kill('SIGTERM');
  await new Promise(r => setTimeout(r, 500));
  if (!proc.killed) proc.kill('SIGKILL');
}

async function prerender() {
  const previewProc = await startPreview();
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run', '--no-zygote'],
      headless: 'new',
    });
    const distDir = path.resolve('dist');
    console.log('[prerender] dist =', distDir);

    for (const route of ROUTES) {
      const url = `${PREVIEW_URL}${route}`;
      console.log(`[prerender] rendering ${route} -> ${url}`);
      const page = await browser.newPage();
      // Don't cache; ensure fresh render
      await page.setCacheEnabled(false);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });

      // Wait until auth Loading gone and app shell mounted
      try {
        await page.waitForFunction(
          () => !document.querySelector('.shield-loading-screen') && !!document.querySelector('.app-shell'),
          { timeout: 15000 }
        );
      } catch (e) {
        console.warn(`[prerender] warning: Loading screen still present for ${route}:`, e.message);
      }

      const selector = READY_SELECTOR[route];
      if (selector) {
        try {
          await page.waitForSelector(selector, { timeout: 15000, visible: true });
        } catch (e) {
          throw new Error(`Ready selector "${selector}" not found for ${route}: ${e.message}`);
        }
      }

      // Let framer-motion settle (initial -> animate 250-400ms) + lazy chunks and JSON-LD injection
      await new Promise(r => setTimeout(r, 650));
      // Ensure JSON-LD script injected by App.jsx (src/utils/structuredData.js) is present
      try {
        await page.waitForSelector('script#shield-jsonld', { timeout: 5000 });
        // Wait until WebPage URL matches route canonical (ensures route-specific graph)
        await page.waitForFunction(
          (route) => {
            const el = document.getElementById('shield-jsonld');
            if (!el) return false;
            try {
              const data = JSON.parse(el.textContent);
              const graph = data['@graph'] || [data];
              const wp = graph.find(n => n['@type'] === 'WebPage');
              if (!wp) return false;
              const expected = route === '/' ? 'https://shieldintelligence.in/' : `https://shieldintelligence.in${route}`;
              return wp.url === expected || wp['@id'] === `${expected}#webpage` || wp['@id'] === 'https://shieldintelligence.in/#webpage';
            } catch { return false; }
          },
          { timeout: 5000 },
          route
        );
      } catch (e) {
        console.warn(`[prerender] warning: JSON-LD not yet correct for ${route}:`, e.message);
      }

      // Verify not spinner-only
      const rootHasRealContent = await page.evaluate((sel) => {
        const root = document.getElementById('root');
        if (!root) return false;
        const spinnerOnly = root.innerHTML.includes('shield-loading-screen') && !document.querySelector(sel);
        return !spinnerOnly && root.innerHTML.length > 500;
      }, selector);
      if (!rootHasRealContent) {
        console.warn(`[prerender] warning: root content looks spinner-only for ${route}`);
      }

      const html = await page.content();
      // Basic sanity: must contain route-specific text snippet
      const checks = {
        '/': 'SECURE SOFTWARE FOR THE',
        '/about': 'About SHIELD Intelligence',
        '/who-we-are': 'Who We Are',
        '/our-work': 'Green Lawns Public School',
        '/request-service': 'Request a Service',
        '/enterprise-consultation': 'Enterprise Consultation',
        '/join-us': 'Join SHIELD Intelligence',
      };
      const mustContain = checks[route];
      if (mustContain && !html.includes(mustContain)) {
        throw new Error(`Prerendered HTML for ${route} missing expected string "${mustContain}"`);
      }

      // Write to dist/<route>/index.html
      const outPath = route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route.slice(1), 'index.html');
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, html, 'utf8');
      const stat = await fs.stat(outPath);
      console.log(`[prerender] wrote ${outPath} (${(stat.size/1024).toFixed(1)} KB)`);

      await page.close();
    }
    // Generate 404.html for Netlify fallback — capture NotFound rendering via unknown path
    console.log('[prerender] rendering 404 fallback -> /__404_nonexistent__');
    {
      const page = await browser.newPage();
      await page.setCacheEnabled(false);
      await page.goto(`${PREVIEW_URL}/__404_nonexistent__`, { waitUntil: 'networkidle0', timeout: 45000 });
      try {
        await page.waitForFunction(
          () => !document.querySelector('.shield-loading-screen') && !!document.querySelector('.app-shell'),
          { timeout: 15000 }
        );
      } catch {}
      try {
        await page.waitForSelector('.notfound-page', { timeout: 15000, visible: true });
      } catch (e) {
        throw new Error(`404 ready selector not found: ${e.message}`);
      }
      await new Promise(r => setTimeout(r, 650));
      // 404 should have noindex meta and no canonical, and minimal JSON-LD (Org+WebSite only)
      try {
        await page.waitForSelector('script#shield-jsonld', { timeout: 5000 });
        const hasMinimalJsonLd = await page.evaluate(() => {
          const el = document.getElementById('shield-jsonld');
          if (!el) return false;
          try {
            const data = JSON.parse(el.textContent);
            const graph = data['@graph'] || [];
            const hasWebPage = graph.some(n => n['@type'] === 'WebPage');
            return !hasWebPage; // 404 should NOT have WebPage
          } catch { return false; }
        });
        if (!hasMinimalJsonLd) console.warn('[prerender] warning: 404 JSON-LD still has WebPage');
      } catch {}
      const html404 = await page.content();
      if (!html404.includes('404 — SHIELD Access Denied') && !html404.includes('Page Not Found')) {
        throw new Error('404 HTML missing expected NotFound text');
      }
      if (html404.includes('rel="canonical"')) {
        console.warn('[prerender] warning: 404 HTML still contains canonical');
      }
      const out404 = path.join(distDir, '404.html');
      await fs.writeFile(out404, html404, 'utf8');
      const stat404 = await fs.stat(out404);
      console.log(`[prerender] wrote ${out404} (${(stat404.size/1024).toFixed(1)} KB)`);
      await page.close();
    }

    console.log('[prerender] all routes rendered successfully');
  } finally {
    if (browser) await browser.close();
    await killPreview(previewProc);
  }
}

prerender().catch(err => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});

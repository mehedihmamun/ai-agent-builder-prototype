// Drives headless Chrome over the DevTools protocol, puts the prototype in each main-screen state,
// and saves a self-contained static HTML snapshot (all CSS inlined, no scripts) per screen.
// Usage: node capture.mjs <outDir>
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const OUT = process.argv[2];
const APP = "http://localhost:5173";
const KEY = "agent-builder-prototype:v4";
const W = 1440, H = 900;
mkdirSync(OUT, { recursive: true });

const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--disable-gpu", "--remote-debugging-port=9333", `--window-size=${W},${H}`,
  `--user-data-dir=${OUT}/../chrome-cdp`, "--no-first-run", "about:blank",
], { stdio: "ignore" });

let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, { res, rej });
  ws.send(JSON.stringify({ id: i, method, params }));
});
async function evaluate(expr) {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400));
  return r.result.value;
}

for (let t = 0; t < 40; t++) {
  try {
    const list = await (await fetch("http://127.0.0.1:9333/json")).json();
    const page = list.find((p) => p.type === "page");
    if (page) { ws = new WebSocket(page.webSocketDebuggerUrl); break; }
  } catch {}
  await sleep(250);
}
await new Promise((r) => ws.addEventListener("open", r));
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
});
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });
await send("Runtime.enable");

const go = async (path, state) => {
  await send("Page.navigate", { url: APP + "/agents" });
  await sleep(1200);
  await evaluate(`localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(JSON.stringify(state))}); true`);
  await send("Page.navigate", { url: APP + path });
  await sleep(1800);
};
// Click the first element whose text (or aria-label) matches.
const click = (text, sel = "button, [role=button], a") => evaluate(`(() => {
  const els = [...document.querySelectorAll(${JSON.stringify(sel)})];
  const el = els.find(e => (e.getAttribute('aria-label') || '').trim() === ${JSON.stringify(text)} || e.textContent.trim() === ${JSON.stringify(text)})
    || els.find(e => e.textContent.trim().includes(${JSON.stringify(text)}));
  if (!el) throw new Error('not found: ' + ${JSON.stringify(text)});
  el.click(); return true; })()`);

// Static snapshot: inline every stylesheet, drop scripts, freeze animations, keep form values.
const SNAP = `(() => {
  const css = [...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).filter(t => !t.startsWith('@import')).join('\\n'); } catch (e) { return ''; } }).join('\\n');
  // Pin fixed-position layers (overlays, drawers) to their real on-screen box so the converter sizes them right.
  document.querySelectorAll('body *').forEach(el => {
    if (getComputedStyle(el).position === 'fixed') {
      const r = el.getBoundingClientRect();
      el.style.setProperty('position', 'absolute', 'important');
      el.style.setProperty('left', r.left + 'px', 'important'); el.style.setProperty('top', r.top + 'px', 'important');
      el.style.setProperty('right', 'auto', 'important'); el.style.setProperty('bottom', 'auto', 'important');
      el.style.setProperty('width', r.width + 'px', 'important'); el.style.setProperty('height', r.height + 'px', 'important');
    }
  });
  const clone = document.documentElement.cloneNode(true);
  clone.querySelectorAll('script, link, style, noscript').forEach(n => n.remove());
  // The Prototype demo button is not product UI.
  clone.querySelectorAll('.fixed.bottom-4.left-16').forEach(n => n.remove());
  const live = document.querySelectorAll('textarea, input');
  clone.querySelectorAll('textarea, input').forEach((n, i) => {
    const v = live[i].value;
    if (n.tagName === 'TEXTAREA') n.textContent = v; else if (v) n.setAttribute('value', v);
    if (live[i].type === 'checkbox' && live[i].checked) n.setAttribute('checked', '');
  });
  const style = document.createElement('style');
  style.textContent = css + '\\n*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent}\\nhtml,body{width:${W}px;height:${H}px;overflow:hidden}';
  clone.querySelector('head').appendChild(style);
  return '<!doctype html>' + clone.outerHTML;
})()`;
const snap = async (name) => {
  await sleep(500);
  const html = await evaluate(SNAP);
  writeFileSync(`${OUT}/${name}.html`, html);
  console.log("saved", name, Math.round(html.length / 1024) + "KB");
};

const EMPTY = { agents: [], introSeen: true, builds: {} };

const ONLY = process.env.ONLY;
if (!ONLY || ONLY === '1') {
// 1. AI Agents – empty state
await go("/agents", EMPTY);
await snap("01-ai-agents-empty");

// 2. AI Agents – grid (sample agents)
await click("Prototype");
await sleep(400);
await click("Load sample agents");
await sleep(800);
await evaluate("document.activeElement && document.activeElement.blur(); document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape', bubbles: true})); true");
await sleep(400);
await snap("02-ai-agents-grid");

// 3. AI Agents – table
const toggles = await evaluate(`[...document.querySelectorAll('button,[role=radio]')].map(b => b.getAttribute('aria-label')).filter(Boolean).join('|')`);
console.log("toggles:", toggles);
await evaluate(`(() => { const b = [...document.querySelectorAll('button,[role=radio]')].find(b => /table|list/i.test(b.getAttribute('aria-label') || '')); b.click(); return true; })()`);
await sleep(800);
await snap("03-ai-agents-table");

}
if (!ONLY || ONLY === '4') {
// 4. Templates – gallery + details drawer
await go("/templates", EMPTY);
await click("Shopify store management", "*");
await sleep(900);
await snap("04-templates-drawer");

}
if (!ONLY || ONLY === '5') {
// 5. Builder – Builder assistant (new agent, first round of questions)
await go("/agents/new", EMPTY);
await evaluate(`(() => { const t = document.querySelector('textarea'); const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set; set.call(t, 'Help customers of my shoe store with product questions, orders and returns'); t.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
await sleep(300);
await click("Create agent");
await sleep(9000);
await snap("05-builder-assistant");

// 6. Builder – Test Flow (template agent, one test message with log)
await go("/templates", EMPTY);
await click("Shopify store management", "*");
await sleep(800);
await click("Use this template");
await sleep(2000);
await click("Where is my order #1042?");
await sleep(5000);
await snap("06-builder-test-flow");

}
ws.close();
chrome.kill();

// Takes the README screenshots from the live prototype with headless Chrome (DevTools protocol, no extra packages).
// Usage: node scripts/readme-screenshots.mjs [baseUrl] [outDir]
//   default baseUrl https://ai-agent-builder-prototype.vercel.app, outDir ../docs/screenshots
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.argv[2] ?? "https://ai-agent-builder-prototype.vercel.app";
const OUT = process.argv[3] ?? new URL("../../docs/screenshots/", import.meta.url).pathname;
const KEY = "agent-builder-prototype:v4";
const W = 1440, H = 900;
mkdirSync(OUT, { recursive: true });

const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--disable-gpu", "--remote-debugging-port=9334", `--window-size=${W},${H}`,
  `--user-data-dir=/tmp/readme-shots-chrome-${process.pid}`, "--no-first-run", "about:blank",
], { stdio: "ignore" });

let ws, id = 0;
const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++id;
  pending.set(i, { res, rej });
  ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async (expr) => {
  const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 300));
  return r.result.value;
};
let url;
for (let t = 0; t < 40 && !url; t++) {
  try {
    url = (await (await fetch("http://127.0.0.1:9334/json")).json()).find((p) => p.type === "page")?.webSocketDebuggerUrl;
  } catch {}
  if (!url) await sleep(250);
}
// Listen for "open" right away, so the event can't be missed.
ws = new WebSocket(url);
await new Promise((r) => ws.addEventListener("open", r));
ws.addEventListener("message", (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
});
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 1, mobile: false });

const open = async (hash, state) => {
  await send("Page.navigate", { url: `${BASE}/#/agents` });
  await sleep(2500);
  await evaluate(`localStorage.setItem(${JSON.stringify(KEY)}, ${JSON.stringify(JSON.stringify(state))}); true`);
  await send("Page.navigate", { url: `${BASE}/#${hash}` });
  await send("Page.reload", {});
  await sleep(2500);
};
const click = (text, sel = "button") => evaluate(`(() => {
  const el = [...document.querySelectorAll(${JSON.stringify(sel)})].find(e => (e.getAttribute('aria-label') || e.textContent).trim().includes(${JSON.stringify(text)}));
  if (!el) throw new Error('not found: ' + ${JSON.stringify(text)}); el.click(); return true; })()`);
const shot = async (name) => {
  await sleep(600);
  // Hide the prototype-only demo button.
  await evaluate(`document.querySelectorAll('.fixed.bottom-4.left-16').forEach(n => n.style.display = 'none'); true`);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, "base64"));
  console.log("saved", name);
};
const EMPTY = { agents: [], introSeen: true, builds: {} };

await open("/agents", EMPTY);
await shot("01-empty-state");

await click("Prototype"); await sleep(400); await click("Load sample agents"); await sleep(900);
await shot("02-agent-list");

await open("/templates", EMPTY);
await click("Shopify store management"); await sleep(900);
await shot("03-templates");

await open("/agents/new", EMPTY);
await evaluate(`(() => { const t = document.querySelector('textarea'); Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(t, 'Help customers of my Shopify store with order tracking and returns'); t.dispatchEvent(new Event('input', { bubbles: true })); return true; })()`);
await sleep(300); await click("Create agent"); await sleep(10000);
await click("Fill from website"); await sleep(1600);
await shot("04-builder-setup");

// Round 2: open a connect flow.
const inCard = (t) => evaluate(`(() => { const c = document.querySelector('.mx-3.mb-3.overflow-hidden'); const b = [...c.querySelectorAll('button')].find(x => x.textContent.trim() === ${JSON.stringify(t)} && !x.disabled); if (!b) throw new Error('no ' + ${JSON.stringify(t)}); b.click(); return true; })()`);
await inCard("Next"); await sleep(300); await inCard("Next"); await sleep(300); await inCard("Submit"); await sleep(7000);
await inCard("Connect"); await sleep(500); await inCard("I've added it"); await sleep(1500);
await inCard("Connect"); await sleep(500);
await shot("05-builder-channels");

await open("/templates", EMPTY);
await click("Appointment Scheduling"); await sleep(900); await click("Use this template"); await sleep(2500);
await click("Can I book a haircut"); await sleep(5500);
await shot("06-test-flow");

ws.close();
chrome.kill();

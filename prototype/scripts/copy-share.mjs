// Copies the single-file build for sharing:
//  - share/AI-Agent-Builder-Prototype.html  → send to teammates; opens by double-click
//  - share/site/index.html                   → the same page as a static site (Vercel, Netlify, any host)
import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";

const src = new URL("../dist-share/index.html", import.meta.url);
const out = new URL("../../share/", import.meta.url);
const site = new URL("site/", out);
mkdirSync(site, { recursive: true });
copyFileSync(src, new URL("AI-Agent-Builder-Prototype.html", out));
copyFileSync(src, new URL("index.html", site));
// Keep the prototype out of search engines; anyone with the link can still open it.
writeFileSync(new URL("robots.txt", site), "User-agent: *\nDisallow: /\n");
console.log("Saved share/AI-Agent-Builder-Prototype.html and share/site/");

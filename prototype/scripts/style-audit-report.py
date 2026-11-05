"""Turns style-audit.json into a readable HTML report (colors, type, spacing, radius, shadow, sizes, issues).

Usage (from prototype/): python3 -I scripts/style-audit-report.py ../reports/style-audit.json ../reports/style-audit.html
"""
import html, json, sys
from datetime import date

IN, OUT = sys.argv[1], sys.argv[2]
d = json.load(open(IN))
items, pal, notes, contrast, roles = d["items"], d["palette"], d["notes"], d["contrast"], d["roles"]
E = html.escape

STEPS = [4, 8, 12, 16, 24, 32, 48]
STEP_CLASS = {4: "1", 8: "2", 12: "3", 16: "4", 24: "6", 32: "8", 48: "12"}


def px(v):
    return float(v.rstrip("px"))


def neighbours(p):
    lo = max([s for s in STEPS if s <= p], default=None)
    hi = min([s for s in STEPS if s >= p], default=None)
    opts = [s for s in (lo, hi) if s is not None]
    opts = sorted(set(opts), key=lambda s: (abs(s - p), s))
    return " or ".join(f"{s}px (<code>-{STEP_CLASS[s]}</code>)" for s in opts)


def where_list(where, limit=None):
    rows = "".join(f"<li><code>{E(w)}</code></li>" for w in where)
    n = len(where)
    return f'<details class="where"><summary>{n} place{"s" if n != 1 else ""}</summary><ul>{rows}</ul></details>'


# ---------- Issues ----------
issues = []  # (severity, area, title, problem, fix, where)

for i in items:
    k, st, cat = i["key"], i["status"], i["cat"]
    if cat == "color" and st == "raw":
        fix = {"#8C5FFF": "Closest token is <code>purple-100</code> #6C69F9. Keep only if this icon is a fixed brand asset.",
               "#EDE6FF": "Closest token is <code>purple-20</code> #E2E1FE."}.get(k.upper(), "Replace with a design-system color token.")
        # Kept on purpose: the AI agent icon is a fixed asset from the design file.
        issues.append(("low", "Color", f"Hard-coded color {k} (kept)", "Not in the REVE Chat palette. Kept on purpose for now: it is part of the AI agent icon from the design file.", fix, i["where"]))
    elif cat == "color" and st == "bad":
        issues.append(("high", "Color", f"Unknown color class <code>{E(k)}</code>", E(i["info"]), "Use a palette token.", i["where"]))
    elif cat == "radius" and st == "bad":
        fix = {"rounded-[5px]": "Use <code>rounded-sm</code> (6px), the design system's smallest radius.",
               "rounded-[18px]": "Use <code>rounded-2xl</code> (18px). Map <code>--radius-2xl: 18px</code> in <code>index.css</code> first, otherwise Tailwind's 16px is used."}.get(k, "Use a radius token.")
        issues.append(("high", "Radius", f"Hand-picked radius <code>{E(k)}</code>", E(i["info"]) + ", not a radius token.", fix, i["where"]))
    elif cat == "radius" and st == "warn":
        issues.append(("medium", "Radius", "Plain <code>rounded</code> (4px)", "4px is not a design-system radius.", "Use <code>rounded-sm</code> (6px).", i["where"]))
    elif cat == "type" and st == "bad":
        issues.append(("high", "Typography", f"<code>{E(k)}</code>", "Sets font weight directly instead of using a text style.", "Use a text style, e.g. <code>text-body-700-l</code> (700, 13px).", i["where"]))
    elif cat == "inline":
        issues.append(("low", "Inline style", f"<code>{E(k)}</code>", "Set in a <code>style</code> attribute, so it can't follow tokens.", "Fine for table column widths and emoji size; otherwise move to a class.", i["where"]))

# Spacing grouped by pixel value
off = [i for i in items if i["cat"] == "space" and i["status"] == "off"]
by_px = {}
for i in off:
    p = px(i["info"].split(" ")[0])
    by_px.setdefault(p, []).append(i)
for p in sorted(by_px):
    group = by_px[p]
    where = sorted({w for i in group for w in i["where"]})
    classes = ", ".join(f"<code>{E(i['key'])}</code>" for i in group)
    issues.append(("medium", "Spacing", f"{p:g}px spacing", f"Off the 4 / 8 / 12 / 16 / 24 / 32 / 48 scale. Used as {classes}.", f"Nearest step: {neighbours(p)}.", where))

# Contrast of small text: gray text colors are checked against white.
colored = []
for c, ratio in sorted(contrast.items(), key=lambda x: x[1]):
    text_uses = roles.get(c, {}).get("text", [])
    if not text_uses or c == "white" or ratio >= 4.5:
        continue
    if not c.startswith("gray-"):
        colored.append((c, ratio, text_uses))
        continue
    if c == "gray-40":
        issues.append(("low", "Contrast", f"<code>text-gray-40</code> · {ratio}:1 on white", "Only used on the dark user bubble in the chat, where it reads fine.", "No change needed.", text_uses))
        continue
    sev = "high" if ratio < 3 else "medium"
    fix = "Use <code>text-gray-80</code> (3.96:1) for meta text, or <code>text-gray-100</code> (6.0:1) for anything people must read." if c == "gray-60" else \
        "The design system allows it for helper text, placeholders and meta. Use <code>text-gray-100</code> (6.0:1) where the text carries meaning, especially at 10–12px."
    issues.append((sev, "Contrast", f"<code>text-{c}</code> · {ratio}:1 on white", f"Below the 4.5:1 AA level for small text. Used for text {len(text_uses)} times.", fix, text_uses))
if colored:
    names = ", ".join(f"<code>{c}</code> ({r}:1)" for c, r, _ in colored)
    issues.append(("low", "Contrast", "Colored icons and badge text",
                   f"These colors are mostly used on icons and on tinted badge backgrounds, not as text on white: {names}.",
                   "Check them against their real background in Figma. Icons need 3:1; badge text needs 4.5:1 on its tint.",
                   sorted({w for _, _, u in colored for w in u})))

SEV_ORDER = {"high": 0, "medium": 1, "low": 2}
issues.sort(key=lambda x: (SEV_ORDER[x[0]], x[1], -len(x[5])))
counts = {s: sum(1 for x in issues if x[0] == s) for s in SEV_ORDER}

issue_html = "".join(
    f'''<article class="issue sev-{s}">
      <div class="issue-head"><span class="sev">{ {"high": "Fix", "medium": "Review", "low": "Note"}[s] }</span><span class="area">{E(a)}</span></div>
      <h3>{t}</h3>
      <p>{prob}</p>
      <p class="fix"><strong>Suggested:</strong> {fix}</p>
      {where_list(w)}
    </article>''' for s, a, t, prob, fix, w in issues)

# ---------- Colors used ----------
used = [i for i in items if i["cat"] == "color" and i["status"] == "ok" and i["key"] in pal]
used.sort(key=lambda i: -i["count"])


def role_str(c):
    r = roles.get(c, {})
    return " · ".join(f"{k} {len(v)}" for k, v in sorted(r.items(), key=lambda x: -len(x[1])))


color_html = "".join(
    f'''<div class="swatch">
      <span class="chip" style="background:{pal[i['key']]}"></span>
      <div class="sw-text">
        <code class="tok">{E(i['key'])}</code>
        <span class="hex">{pal[i['key']].upper()}</span>
        <span class="meta">{E(role_str(i['key']) or 'via CSS variable')}</span>
        {'<span class="flag">' + str(contrast[i['key']]) + ':1 as text on white</span>' if i['key'].startswith('gray-') and i['key'] in contrast and contrast[i['key']] < 4.5 and roles.get(i['key'], {}).get('text') else ''}
      </div>
    </div>''' for i in used)

unused = [n for n in pal if n not in {i["key"] for i in used} and not n.startswith(("primary", "secondary", "muted", "accent", "card", "popover", "background", "foreground", "destructive", "success", "warning", "input", "ring", "border"))]

# ---------- Typography ----------
type_items = [i for i in items if i["cat"] == "type" and i["status"] == "ok"]


def font_css(spec):
    w, rest = spec.split(" ", 1)
    size, lh = rest.split("/")
    return f"font-weight:{w};font-size:{size};line-height:{lh.split()[0]}"


type_html = "".join(
    f'''<div class="type-row">
      <span class="sample" style="{font_css(i['info'].split(' — ')[0])}">Agent Builder</span>
      <code class="tok">text-{E(i['key'])}</code>
      <span class="meta">{E(i['info'].split(' — ')[0])}</span>
      <span class="meta use">{E(i['info'].split(' — ')[1]) if ' — ' in i['info'] else ''}</span>
      <span class="count">{i['count']}×</span>
    </div>''' for i in sorted(type_items, key=lambda i: -px(i['info'].split(' ')[1].split('/')[0])))

# ---------- Spacing scale ----------
space_ok = [i for i in items if i["cat"] == "space" and i["status"] == "ok"]
on_counts = {}
for i in space_ok:
    v = i["info"]
    if v.endswith("px") and v[:-2].replace(".", "").isdigit():
        on_counts[px(v)] = on_counts.get(px(v), 0) + i["count"]
off_counts = {p: sum(i["count"] for i in g) for p, g in by_px.items()}
tok = [i for i in items if i["cat"] == "space" and i["status"] == "token"]
tok_counts = {}
for i in tok:
    p = px(i["info"].split(" ")[0])
    tok_counts[p] = tok_counts.get(p, 0) + i["count"]
all_px = sorted(set(on_counts) | set(off_counts) | set(tok_counts))
maxc = max(list(on_counts.values()) + list(off_counts.values()) + list(tok_counts.values()) + [1])


def total(p):
    return on_counts.get(p, 0) + off_counts.get(p, 0) + tok_counts.get(p, 0)


def kind(p):
    return "off" if p in off_counts else "tok" if p in tok_counts else "on"
scale_html = "".join(
    f'''<div class="bar-row {kind(p)}">
      <span class="bar-label">{p:g}px</span>
      <span class="bar-track"><span class="bar" style="width:{max(4, 100 * total(p) / maxc):.0f}%"></span></span>
      <span class="bar-count">{total(p)}</span>
      <span class="bar-tag">{ {"on": "design system", "tok": "new token", "off": "no token"}[kind(p)] }</span>
    </div>''' for p in all_px if p > 0)

# ---------- Radius & shadow ----------
RAD_PX = {"rounded-sm": "6px", "rounded-md": "8px", "rounded-lg": "10px", "rounded-xl": "14px", "rounded-full": "999px", "rounded-[5px]": "5px", "rounded-[18px]": "18px", "rounded-DEFAULT": "4px", "rounded-4": "4px", "rounded-20": "20px", "rounded-2": "2px", "rounded-12": "12px", "rounded-16": "16px"}
rad = [i for i in items if i["cat"] == "radius"]
rad_html = "".join(
    f'''<div class="shape-card {'bad' if i['status'] != 'ok' else ''}">
      <span class="shape" style="border-radius:{RAD_PX.get(i['key'], '8px')}"></span>
      <code class="tok">{E(i['key'].replace('rounded-DEFAULT', 'rounded'))}</code>
      <span class="meta">{RAD_PX.get(i['key'], '')} · {i['count']}×</span>
    </div>''' for i in rad)
SH = {"xs": "0 2px 3px rgba(40,46,61,.12)", "sm": "0 3px 12px 0 rgba(67,77,101,.14)", "md": "0 7px 25px 0 rgba(67,77,101,.14)", "lg": "0 12px 35px 0 rgba(67,77,101,.14)", "xl": "0 15px 48px 0 rgba(67,77,101,.17)", "none": "none"}
sh = [i for i in items if i["cat"] == "shadow"]
sh_html = "".join(
    f'''<div class="shape-card">
      <span class="shape lift" style="box-shadow:{SH.get(i['key'].split('-')[1], 'none')}"></span>
      <code class="tok">{E(i['key'])}</code>
      <span class="meta">{i['count']}×</span>
    </div>''' for i in sorted(sh, key=lambda i: list(SH).index(i['key'].split('-')[1])))

# ---------- Fixed sizes ----------
sizes = [i for i in items if i["cat"] == "size" and i["status"] == "warn"]
size_html = "".join(f"<tr><td><code>{E(i['key'])}</code></td><td>{E(i['info'].replace('Arbitrary value ', ''))}</td><td>{where_list(i['where'])}</td></tr>" for i in sizes)

import os, re as _re
css = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../src/index.css")).read()
sp_tokens = [(k.replace("\\", ""), v) for k, v in _re.findall(r"--spacing-([0-9\\.]+):\s*([^;]+);", css)]
rad_tokens = _re.findall(r"--radius-(\d+):\s*([^;]+);", css)
def classes_for(k):
    found = [i["key"] for i in tok if i["key"].endswith("-" + k)]
    return ", ".join(f"<code>{E(c)}</code>" for c in found) or "—"


spacing_tok_html = "".join(f"<tr><td><code>--spacing-{E(k)}</code></td><td>{E(v)}</td><td>{classes_for(k)}</td></tr>" for k, v in sp_tokens)
radius_tok_html = "".join(f"<tr><td><code>--radius-{E(k)}</code></td><td>{E(v)}</td><td><code>rounded-{E(k)}</code></td></tr>" for k, v in rad_tokens)

total_used = len(used)
n_type = len(type_items)

page = f'''<title>Prototype Style Audit</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column; summary first, then the fix list, then reference sections. Colors are the REVE Chat tokens themselves. */
:root {{
  --bg: #f5f7f8; --surface: #ffffff; --fg: #253748; --muted: #4d657c; --faint: #6f8294; --line: #e6eaed;
  --accent: #004fff; --accent-soft: #e1edff;
  --high: #d92020; --high-soft: #fbe8e8; --med: #9a6a12; --med-soft: #fdf0dc; --low: #4d657c; --low-soft: #eff2f4;
  --ok: #088114; --ok-soft: #e8f6e9; --track: #eff2f4;
  --font: Inter, ui-sans-serif, system-ui, sans-serif; --mono: "JetBrains Mono", ui-monospace, Menlo, monospace;
}}
@media (prefers-color-scheme: dark) {{ :root:not([data-theme="light"]) {{
  --bg: #121a22; --surface: #1a2530; --fg: #e8eef3; --muted: #b2bbc5; --faint: #909fac; --line: #2a3846;
  --accent: #77a1ff; --accent-soft: #1b2b4d; --high: #f0a6a6; --high-soft: #3a1d22; --med: #f8d195; --med-soft: #3a3020;
  --low: #b2bbc5; --low-soft: #24313d; --ok: #a3daa8; --ok-soft: #1c3322; --track: #24313d; color-scheme: dark; }} }}
:root[data-theme="dark"] {{
  --bg: #121a22; --surface: #1a2530; --fg: #e8eef3; --muted: #b2bbc5; --faint: #909fac; --line: #2a3846;
  --accent: #77a1ff; --accent-soft: #1b2b4d; --high: #f0a6a6; --high-soft: #3a1d22; --med: #f8d195; --med-soft: #3a3020;
  --low: #b2bbc5; --low-soft: #24313d; --ok: #a3daa8; --ok-soft: #1c3322; --track: #24313d; color-scheme: dark; }}
* {{ box-sizing: border-box; }}
body {{ background: var(--bg); color: var(--fg); font: 400 14px/22px var(--font); }}
.wrap {{ max-width: 1040px; margin: 0 auto; padding-block: 32px 64px; padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
code, .tok {{ font-family: var(--mono); font-size: 12px; }}
code {{ background: var(--track); padding: 1px 5px; border-radius: 4px; }}
h1 {{ font-size: 28px; line-height: 38px; font-weight: 600; margin: 0; text-wrap: balance; }}
h2 {{ font-size: 18px; line-height: 28px; font-weight: 600; margin: 0 0 4px; }}
.lede {{ color: var(--muted); max-width: 68ch; margin: 8px 0 0; }}
.eyebrow {{ font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--faint); font-weight: 500; }}
section {{ margin-top: 48px; }}
.section-sub {{ color: var(--muted); margin: 0 0 16px; max-width: 70ch; }}
nav.jump {{ display: flex; flex-wrap: wrap; gap: 8px; margin-top: 20px; }}
nav.jump a {{ color: var(--accent); text-decoration: none; font-weight: 500; font-size: 13px; padding: 4px 10px; border: 1px solid var(--line); border-radius: 999px; background: var(--surface); }}
nav.jump a:hover, nav.jump a:focus-visible {{ border-color: var(--accent); outline: none; }}
.stats {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-top: 24px; }}
.stat {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px 16px; }}
.stat b {{ display: block; font-size: 24px; line-height: 32px; font-weight: 600; font-variant-numeric: tabular-nums; }}
.stat span {{ color: var(--muted); font-size: 13px; }}
.stat.high b {{ color: var(--high); }} .stat.med b {{ color: var(--med); }}
.issues {{ display: grid; gap: 12px; }}
.issue {{ background: var(--surface); border: 1px solid var(--line); border-left: 4px solid var(--low); border-radius: 10px; padding: 14px 16px; min-width: 0; }}
.issue.sev-high {{ border-left-color: var(--high); }} .issue.sev-medium {{ border-left-color: var(--med); }}
.issue-head {{ display: flex; gap: 8px; align-items: center; }}
.sev {{ font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; padding: 1px 8px; border-radius: 999px; background: var(--low-soft); color: var(--low); }}
.sev-high .sev {{ background: var(--high-soft); color: var(--high); }} .sev-medium .sev {{ background: var(--med-soft); color: var(--med); }}
.area {{ font-size: 12px; color: var(--faint); font-weight: 500; }}
.issue h3 {{ font-size: 15px; line-height: 24px; font-weight: 600; margin: 6px 0 2px; }}
.issue p {{ margin: 2px 0; color: var(--muted); }}
.issue .fix {{ color: var(--fg); }}
details.where {{ margin-top: 6px; }}
details.where summary {{ cursor: pointer; color: var(--accent); font-size: 13px; font-weight: 500; }}
details.where ul {{ margin: 6px 0 0; padding-left: 18px; columns: 2 260px; color: var(--muted); }}
.swatches {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }}
.swatch {{ display: flex; gap: 12px; align-items: center; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 10px; min-width: 0; }}
.chip {{ width: 44px; height: 44px; border-radius: 8px; flex: none; box-shadow: inset 0 0 0 1px rgba(37,55,72,.12); }}
.sw-text {{ display: flex; flex-direction: column; min-width: 0; }}
.hex, .meta {{ font-size: 12px; line-height: 18px; color: var(--faint); }}
.flag {{ font-size: 11px; font-weight: 600; color: var(--med); }}
.type-list {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; }}
.type-row {{ display: grid; grid-template-columns: minmax(150px, 1.2fr) minmax(150px, 1fr) 120px minmax(120px, 1.4fr) 44px; gap: 12px; align-items: baseline; padding: 10px 16px; border-top: 1px solid var(--line); }}
.type-row:first-child {{ border-top: 0; }}
.count {{ text-align: right; color: var(--faint); font-size: 12px; font-variant-numeric: tabular-nums; }}
.scale {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 12px 16px; display: grid; gap: 6px; }}
.bar-row {{ display: grid; grid-template-columns: 52px 1fr 36px 72px; gap: 10px; align-items: center; font-size: 13px; }}
.bar-label {{ font-variant-numeric: tabular-nums; font-family: var(--mono); font-size: 12px; }}
.bar-track {{ background: var(--track); height: 10px; border-radius: 999px; overflow: hidden; }}
.bar {{ display: block; height: 100%; background: var(--ok); border-radius: 999px; }}
.bar-row.off .bar {{ background: var(--med); }}
.bar-count {{ text-align: right; font-variant-numeric: tabular-nums; color: var(--muted); }}
.bar-tag {{ font-size: 11px; font-weight: 600; color: var(--ok); }}
.bar-row.off .bar-tag {{ color: var(--med); }}
.bar-row.tok .bar {{ background: var(--accent); }} .bar-row.tok .bar-tag {{ color: var(--accent); }}
.shapes {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; }}
.shape-card {{ background: var(--surface); border: 1px solid var(--line); border-radius: 10px; padding: 14px; display: flex; flex-direction: column; gap: 6px; align-items: flex-start; }}
.shape-card.bad {{ border-color: var(--high); }}
.shape {{ width: 64px; height: 40px; background: var(--accent-soft); border: 1.5px solid var(--accent); }}
.shape.lift {{ background: var(--surface); border: 1px solid var(--line); border-radius: 8px; }}
.table-wrap {{ overflow-x: auto; background: var(--surface); border: 1px solid var(--line); border-radius: 10px; }}
table {{ border-collapse: collapse; width: 100%; font-size: 13px; }}
th, td {{ text-align: left; padding: 8px 14px; border-top: 1px solid var(--line); vertical-align: top; }}
th {{ border-top: 0; color: var(--faint); font-weight: 600; font-size: 12px; }}
.two {{ display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }}
.legend {{ display: flex; flex-wrap: wrap; gap: 14px; color: var(--muted); font-size: 13px; margin-bottom: 12px; }}
footer {{ margin-top: 56px; color: var(--faint); font-size: 12px; }}
@media (max-width: 720px) {{
  .type-row {{ grid-template-columns: 1fr auto; }} .type-row .meta.use, .type-row .meta {{ grid-column: 1 / -1; }}
  .two {{ grid-template-columns: 1fr; }}
}}
@media (prefers-reduced-motion: reduce) {{ * {{ scroll-behavior: auto; }} }}
</style>
<div class="wrap">
  <header>
    <span class="eyebrow">AI Agent Builder prototype · REVE Chat design system</span>
    <h1>Prototype Style Audit</h1>
    <p class="lede">Every color, text style, spacing, radius, shadow and fixed size in the prototype code, checked against the REVE Chat design system tokens. Each item lists the file and line where it is used. Nothing has been changed yet; this is a review list.</p>
    <div class="stats">
      <div class="stat high"><b>{counts['high']}</b><span>to fix</span></div>
      <div class="stat med"><b>{counts['medium']}</b><span>to review</span></div>
      <div class="stat"><b>{total_used}</b><span>palette colors used</span></div>
      <div class="stat"><b>{n_type}</b><span>text styles used</span></div>
      <div class="stat"><b>{len(off)}</b><span>spacing values without a token</span></div>
      <div class="stat"><b>{d['files']}</b><span>code files scanned</span></div>
    </div>
    <nav class="jump" aria-label="Sections">
      <a href="#issues">Needs attention</a><a href="#colors">Colors</a><a href="#type">Typography</a><a href="#spacing">Spacing</a><a href="#shape">Radius &amp; shadow</a><a href="#added">Tokens added</a><a href="#sizes">Fixed sizes</a>
    </nav>
  </header>

  <section id="issues">
    <h2>Needs attention</h2>
    <p class="section-sub"><b>Fix</b>: not from the design system. <b>Review</b>: allowed but off the scale or low contrast, a design decision. <b>Note</b>: fine as is, listed for completeness.</p>
    <div class="issues">{issue_html}</div>
  </section>

  <section id="colors">
    <h2>Colors used</h2>
    <p class="section-sub">All {total_used} colors below come from the palette. The roles show how often each is used as text, background, border and so on. Orange labels mark gray text colors below 4.5:1 contrast on white.</p>
    <div class="swatches">{color_html}</div>
    <p class="section-sub" style="margin-top:16px">Palette colors not used anywhere: {', '.join(f'<code>{E(n)}</code>' for n in unused)}.</p>
  </section>

  <section id="type">
    <h2>Typography</h2>
    <p class="section-sub">Every text style token in use, largest first, rendered at its real size. All are design-system styles; the one direct font weight is in the list above.</p>
    <div class="type-list">{type_html}</div>
  </section>

  <section id="spacing">
    <h2>Spacing</h2>
    <p class="section-sub">How often each spacing value is used (padding, margin, gap, offsets). Green: the design system's 4, 8, 12, 16, 24, 32, 48px scale. Blue: values between those steps, each now a named token (see below). Orange would mean a value with no token.</p>
    <div class="scale">{scale_html}</div>
  </section>

  <section id="shape">
    <div class="two">
      <div><h2>Radius</h2><p class="section-sub">Red outline: not a radius token.</p><div class="shapes">{rad_html}</div></div>
      <div><h2>Shadow</h2><p class="section-sub">All shadows use the five design-system elevations.</p><div class="shapes">{sh_html}</div></div>
    </div>
  </section>

  <section id="added">
    <h2>Tokens added to the prototype</h2>
    <p class="section-sub">Defined in <code>src/index.css</code>. Existing design system tokens are unchanged.</p>
    <div class="two">
      <div class="table-wrap"><table><thead><tr><th>Spacing token</th><th>Value</th><th>Classes</th></tr></thead><tbody>{spacing_tok_html}</tbody></table></div>
      <div class="table-wrap"><table><thead><tr><th>Radius token</th><th>Value</th><th>Class</th></tr></thead><tbody>{radius_tok_html}</tbody></table></div>
    </div>
  </section>

  <section id="sizes">
    <h2>Fixed sizes</h2>
    <p class="section-sub">Hand-picked widths and heights. These are usually layout decisions (panel widths, prompt box width), not mistakes, but they don't scale with the design system.</p>
    <div class="table-wrap"><table><thead><tr><th>Class</th><th>Value</th><th>Where</th></tr></thead><tbody>{size_html}</tbody></table></div>
  </section>

  <footer>Generated {date.today().strftime('%d %b %Y')} from <code>prototype/src</code> ({d['files']} files). Re-run with <code>scripts/style-audit.py</code> then <code>scripts/style-audit-report.py</code>.</footer>
</div>
'''
open(OUT, "w").write(page)
print("wrote", OUT, len(issues), "issues", counts)

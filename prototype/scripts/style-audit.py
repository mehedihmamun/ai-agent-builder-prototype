"""Style audit: every color, text style, spacing, radius, shadow and fixed size used in the prototype,
checked against the REVEChat design system tokens. Writes audit.json.

Usage (from prototype/): python3 -I scripts/style-audit.py src ../reports/style-audit.json
Then: python3 -I scripts/style-audit-report.py ../reports/style-audit.json ../reports/style-audit.html
"""
import json, os, re, sys
from collections import defaultdict

SRC, OUT = sys.argv[1], sys.argv[2]
tokens_css = open(os.path.join(SRC, "ds/tokens.css")).read()
index_css = open(os.path.join(SRC, "index.css")).read()

# ---- Design system tokens ----
COLORS = {}  # name -> hex (raw scale + semantic resolved)
NOTES = {}
for name, val, note in re.findall(r"--([a-z]+-?\d*|[a-z-]+):\s*([^;]+);\s*/\*\s*(.*?)\s*\*/", tokens_css):
    if val.strip().startswith("#"):
        COLORS[name] = val.strip().lower()
        NOTES[name] = note
for name, ref in re.findall(r"--([a-z-]+):\s*var\(--([a-z0-9-]+)\);", tokens_css):
    if ref in COLORS:
        COLORS[name] = COLORS[ref]
        NOTES.setdefault(name, f"= {ref}")
COLORS.update({"transparent": "transparent", "current": "currentColor", "inherit": "inherit"})

TYPE = {}
for name, val, note in re.findall(r"--text-text-([a-z0-9-]+):\s*([^;]+);\s*/\*\s*(.*?)\s*\*/", tokens_css):
    TYPE[name] = (val.replace("var(--font-sans)", "").strip(), note)

SPACE_OK = {"0", "px", "1", "2", "3", "4", "6", "8", "12", "auto", "full"}
# Extra spacing tokens the prototype defines in index.css (--spacing-1\.5 etc.) count as tokens too.
SPACE_EXTRA = {k.replace("\\", "") for k in re.findall(r"--spacing-([0-9\\.]+):", index_css)}
SPACE_PX = lambda v: f"{float(v) * 4:g}px" if re.fullmatch(r"\d+(\.\d+)?", v) else v
RADIUS_DS = {"sm": "6px", "md": "8px", "lg": "10px", "xl": "14px", "2xl": "18px", "3xl": "22px", "4xl": "26px"}
RADIUS_MAPPED = set(re.findall(r"--radius-([a-z0-9]+):", index_css))  # what the app actually maps
TW_RADIUS = {"2xl": "16px", "3xl": "24px", "4xl": "32px"}
SHADOW_OK = {"xs", "sm", "md", "lg", "xl", "none"}

# ---- Scan ----
items = defaultdict(lambda: {"count": 0, "where": []})


def add(cat, key, status, info, where):
    k = (cat, key)
    it = items[k]
    it.update({"cat": cat, "key": key, "status": status, "info": info})
    it["count"] += 1
    if where not in it["where"]:
        it["where"].append(where)


COLOR_PROPS = ("bg", "text", "border", "border-t", "border-b", "border-l", "border-r", "ring", "fill", "stroke", "outline", "divide", "from", "to", "via", "decoration", "accent", "caret", "placeholder")
SPACE_PROPS = r"(?:-?)(p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|top|left|right|bottom|inset|inset-x|inset-y|translate-x|translate-y)"
SIZE_PROPS = r"(w|h|size|min-w|min-h|max-w|max-h)"

files = []
for root, _, names in os.walk(SRC):
    if "/ds" in root.replace(SRC, ""):
        continue
    for n in names:
        if n.endswith((".tsx", ".ts")) and not n.endswith(".d.ts"):
            files.append(os.path.join(root, n))

for path in sorted(files):
    rel = os.path.relpath(path, SRC)
    for lineno, line in enumerate(open(path), 1):
        where = f"{rel}:{lineno}"
        # Raw colors in code
        for hx in re.findall(r"#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b", line):
            if re.search(r"#\d+\b", hx) and len(hx) in (4,) and "key" in line:
                continue
            match = [n for n, h in COLORS.items() if h == hx.lower()]
            add("color", hx.upper(), "raw", f"Hard-coded hex{' (same as ' + match[0] + ')' if match else ', not a design-system color'}", where)
        for name in re.findall(r"var\(--([a-z0-9-]+)\)", line):
            if name in COLORS:
                add("color", name, "ok", "via CSS variable", where)
        # Inline style numbers
        for m in re.finditer(r"(fontSize|width|height|padding|margin|gap|borderRadius)\s*:\s*(\d+)", line):
            add("inline", f"{m.group(1)}: {m.group(2)}px", "warn", "Inline style, not a class/token", where)
        # Class-like tokens inside strings
        for s in re.findall(r'"([^"]*)"|`([^`]*)`', line):
            text = s[0] or s[1]
            if not re.search(r"\b(bg|text|p[xytrbl]?|m[xytrbl]?|gap|rounded|shadow|w|h|size|border|ring)-", text):
                continue
            for raw in text.split():
                cls = raw.split(":")[-1].lstrip("!")
                cls = re.sub(r"\$\{.*", "", cls)
                if not cls:
                    continue
                base = cls.split("/")[0]
                # arbitrary values
                arb = re.fullmatch(r"([a-z-]+)-\[(.+)\]", base)
                # typography
                m = re.fullmatch(r"text-([a-z0-9-]+)", base)
                if m and not arb:
                    v = m.group(1)
                    if v in TYPE:
                        add("type", v, "ok", f"{TYPE[v][0]} — {TYPE[v][1]}", where)
                        continue
                    if v in COLORS:
                        add("color", v, "ok", COLORS[v], where)
                        continue
                    if v in ("left", "center", "right", "ellipsis", "clip", "wrap", "nowrap", "balance"):
                        continue
                    if v in ("xs", "sm", "base", "lg", "xl", "2xl", "3xl"):
                        add("type", v, "bad", "Tailwind font size, not a design-system text style", where)
                        continue
                    add("color", v, "bad", "Unknown color/text class (renders nothing)", where)
                    continue
                m = re.fullmatch(r"(" + "|".join(COLOR_PROPS) + r")-([a-z]+(?:-\d+)?)", base)
                if m and not arb:
                    v = m.group(2)
                    if v in COLORS:
                        add("color", v, "ok", COLORS[v], where)
                    elif m.group(1).startswith(("border", "ring", "outline")) and re.fullmatch(r"\d+|[trblxy](-\d+)?", v):
                        pass
                    elif v in ("none", "solid", "dashed", "dotted", "inset", "clip", "transparent"):
                        pass
                    else:
                        add("color", v, "bad", f"Not a design-system color ({m.group(1)}-{v} renders nothing)", where)
                    continue
                if re.fullmatch(r"font-(bold|semibold|medium|normal|light)", base):
                    add("type", base, "bad", "Font weight class; use a text style token instead", where)
                    continue
                m = re.fullmatch(SPACE_PROPS + r"-([\d.]+|px|auto|full|1/2)", base)
                if m:
                    v = m.group(2)
                    ok = v in SPACE_OK
                    extra = v in SPACE_EXTRA
                    add("space", f"{m.group(1)}-{v}", "ok" if ok else "token" if extra else "off",
                        f"{SPACE_PX(v)}" + ("" if ok else " — prototype spacing token (--spacing-" + v + ")" if extra else " — not on the 4/8/12/16/24/32/48 scale and no token"), where)
                    continue
                m = re.fullmatch(r"rounded(?:-([trbl]{1,2}))?(?:-([a-z0-9]+))?", base)
                if m and not arb:
                    v = m.group(2) or "DEFAULT"
                    if v in ("full", "none"):
                        add("radius", f"rounded-{v}", "ok", "pill / none", where)
                    elif re.fullmatch(r"\d+", v) and v in RADIUS_MAPPED:
                        add("radius", f"rounded-{v}", "ok", f"{v}px — 4px-grid radius token", where)
                    elif v in RADIUS_DS:
                        mapped = v in RADIUS_MAPPED
                        add("radius", f"rounded-{v}", "ok" if mapped else "bad",
                            RADIUS_DS[v] if mapped else f"Design system says {RADIUS_DS[v]}, but the app doesn't map it, so Tailwind's {TW_RADIUS.get(v, '?')} is used", where)
                    else:
                        add("radius", f"rounded-{v}", "warn", "Tailwind default radius (4px)" if v == "DEFAULT" else "Unknown radius", where)
                    continue
                m = re.fullmatch(r"shadow(?:-([a-z0-9]+))?", base)
                if m and not arb:
                    v = m.group(1) or "DEFAULT"
                    add("shadow", f"shadow-{v}", "ok" if v in SHADOW_OK else "bad", "design-system elevation" if v in SHADOW_OK else "Not a design-system shadow", where)
                    continue
                if arb:
                    prop, val = arb.group(1), arb.group(2)
                    cat = "radius" if prop.startswith("rounded") else "size" if re.fullmatch(SIZE_PROPS, prop) else "space" if re.fullmatch(SPACE_PROPS.replace("(?:-?)", ""), prop) else "other"
                    status = "bad" if cat == "radius" or prop.startswith(("text", "bg", "border")) else "warn"
                    add(cat, base, status, f"Arbitrary value {val}", where)
                    continue
                m = re.fullmatch(SIZE_PROPS + r"-([\d.]+)", base)
                if m:
                    add("size", base, "info", f"{float(m.group(2)) * 4:g}px", where)

# Contrast of each text color on white (WCAG). Small text needs 4.5:1.
def lum(hx):
    c = [int(hx[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
contrast = {}
for (cat, key), it in list(items.items()):
    if cat == "color" and it["status"] == "ok" and any("text-" + key in w or True for w in [key]):
        hx = COLORS.get(key, "")
        if hx.startswith("#"):
            contrast[key] = round((1.05) / (lum(hx) + 0.05), 2)

out = sorted(items.values(), key=lambda x: (x["cat"], {"bad": 0, "raw": 0, "off": 1, "warn": 2, "info": 3, "token": 4, "ok": 4}[x["status"]], -x["count"]))
palette = {n: COLORS[n] for n in COLORS if COLORS[n].startswith("#")}
# Where each color is used, by role (text / bg / border / ring / fill / stroke).
roles = defaultdict(lambda: defaultdict(list))
for path in sorted(files):
    rel = os.path.relpath(path, SRC)
    for lineno, line in enumerate(open(path), 1):
        for m in re.finditer(r"(?<![\w-])(?:[a-z-]+:)*(text|bg|border|ring|fill|stroke)-([a-z]+(?:-\d+)?)(?![\w-])", line):
            c = m.group(2)
            # The whole class token, e.g. "[&_[data-disabled]]:text-gray-60": disabled states are exempt from contrast rules.
            start = line.rfind(" ", 0, m.start()) + 1
            if "disabled" in line[start:m.end()]:
                continue
            if c in COLORS and COLORS[c].startswith("#"):
                roles[c][m.group(1)].append(f"{rel}:{lineno}")

json.dump({"roles": {c: dict(r) for c, r in roles.items()}, "contrast": contrast, "items": out, "palette": palette, "notes": NOTES, "type": TYPE, "files": len(files)}, open(OUT, "w"), indent=1)
by = defaultdict(lambda: defaultdict(int))
for i in out:
    by[i["cat"]][i["status"]] += 1
print(len(files), "files")
for c, d in by.items():
    print(c, dict(d))

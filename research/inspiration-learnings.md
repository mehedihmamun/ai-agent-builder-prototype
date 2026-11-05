# Inspiration review — Lumen "Agents" (reve-custom-dashboard)

Scope: only the parts that match our flow (Agents list → Create prompt → Builder split view).
Nothing was created or changed in the reference account. Screenshots in `screenshots/`.

---

## 1. Agents list — `screenshots/01-agents-list.jpg`

- Page title **Agents** + subtitle: *"Describe an agent, answer a few questions, and it's built for you."*
- **Create** button (top right, primary purple) with a dropdown: `Create agent` / `Browse templates`.
- 2-column card grid. Each card: bot icon, name, status badge (`Draft` grey / `Live · v1` green),
  2-line description, footer `N skills` + `Updated 11 min ago`, `⋯` menu.
- Left app sidebar (workspace switcher, nav items, Agents active).

**Take:** card grid + status badge + Create button. Good, simple.

## 2. Create screen — `02-create-prompt.jpg`, `03-create-suggestion-filled.jpg`

- Full-page, centered, minimal. Top bar: `← Back` left, `Templates` + `Start blank` right.
- Bot icon + big heading **"What should your agent do?"**
- Prompt box: placeholder *"Create an agent that…"*, `+` (attach) bottom-left, mic + send bottom-right.
  Send button is grey until there is text, then turns dark.
- 3 suggestion cards below: *Handle customer requests*, *Answer from your documents*, *Import an existing agent*.
- **Clicking a card fills the prompt with a template that has `[bracketed placeholders]`**,
  and the first placeholder is auto-selected so you can type over it. Very nice detail.
- Helper text: *"The Builder Assistant will ask a few quick questions and show you a plan before it builds anything."*
- Bottom: fanned row of industry template cards (Banking/MFS, Healthcare, Courier, Insurance, ISP, Online store).
- ⚠️ **No AI model selector here** (model lives in the builder's Structure tab). Our design adds it under the prompt — that's our own addition.

**Take:** layout, placeholder-template trick, helper text. **Add ours:** model dropdown below the prompt.

## 3. Builder (split view) — the core

Header: `←` agent name, `Draft` badge, tabs, `▷ Test`, **Publish** (primary).

### Left — Agent builder (config)
Tabs: Overview · Structure · Skills · Knowledge · Connectors · Tools & APIs · MCP · Rules · Tests · Deploy · Activity

**Overview tab** (most relevant for us):
- Stat tiles: Skills, Team agents, Knowledge sources, Actions, MCP servers, Rules, Tests, Conversations.
- **"What's missing" checklist** — items strike through when done; each open item has `Ask the assistant` / `Open`.
  This visibly shows the agent "filling up" as you chat. ⭐
- **About the agent** form: What it's for, Business name, Timezone, About the business, Tone of voice,
  Greeting, Languages (chips + Add), Handoff message.
- **How it behaves** toggles (stay within business, rich buttons/cards), Memory settings.

Structure tab: skill cards each with a model dropdown (`Default (gpt-6-luna)`) and tool chips; "AI models for each job".
Skills tab: list of skill cards with toggle, `From library` badge, `New skill` / `Add from library`.

### Right — Builder Assistant (chat) — `04-builder-question-card.jpg`, `05-builder-build-plan.jpg`
- Header: name, cost, **progress pill `Setup 2/8`**, expand / dock / minimize. `Summary | Detailed` view toggle.
- User's original prompt shows as the first bubble.
- **Question card** ⭐ — replaces the composer while a question is open:
  - pager `‹ 1 of 2 ›`, topic chip (e.g. `Business`), question title
  - radio options with short description + keyboard number (1, 2)
  - "Type your answer" free-text row, `Skip`, close `×`
- Answered questions collapse into a compact row: `Agent goal · Both`, `Language · English + Bangla`,
  and the user's answers as a bubble ("My answers: …").
- **Build Plan card** — grouped steps (Profile, Skills, Knowledge, Handover, Tests), each with a short
  explanation, `Approved` badge after the user approves.
- After build: *"Made 13 changes · Undo all"* and a test-results card (*Tests: 5 of 8 passed*, pass/fail list).
- Composer: *"Ask for a change, or describe your business…"*

## 4. The flow they use (to mirror in our prototype)

1. Prompt → agent draft created, opens builder.
2. Assistant asks 2–4 rounds of multiple-choice questions (business, goal, languages, handoff, order system…).
3. Each answer updates the left side (checklist ticks, fields fill, counters go up, `Setup x/8` increases).
4. Assistant shows a **Build Plan** → user approves.
5. "Made N changes" → (optional) tests summary → Publish.

## 5. Recommendation for our clickable prototype

**Keep (scripted / fake):**
- Agents list with cards + Create.
- Create page: prompt box + **AI model selector (ours)** + suggestion chips that fill a `[placeholder]` template.
- Builder split view: left config, right assistant.
- Question card with options + free text + Skip; answered → compact summary row.
- Left side updating live with a brief highlight on changed fields + "What's missing" checklist + Setup progress.
- Build Plan card with Approve → "Agent ready" + Publish.

**Simplify / skip for v1:**
- Only 2–3 left tabs (e.g. Overview, Skills, Knowledge) instead of 11.
- Skip Structure / MCP / Connectors / Tools & APIs / Deploy / Activity, cost labels, tests judge output,
  team agents, memory settings.
- Templates gallery and import can be static or non-clickable.

**Visual cues:** light lavender-grey background, white rounded cards, purple primary (#6D5BF6-ish),
Inter-like sans, subtle borders, green for Live/pass, red for fail.

## 6. Open questions for you
1. Which left tabs do you want in v1 (my suggestion: Overview, Skills, Knowledge)?
2. Should the build happen after a Plan approval step (like Lumen) or update live per answer, or both?
3. Do you have your own UI draft (Figma/images) to follow over this reference?

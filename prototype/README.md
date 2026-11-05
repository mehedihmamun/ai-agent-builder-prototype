# AI Agent Builder — clickable prototype

UI-only prototype (no backend, no LLM). Spec: `../docs/prototype-spec.md`.

```bash
npm install
npm run dev   # http://localhost:5173
```

- Styling and components come from the REVEChat Design System, copied into `src/ds/`
  (`bundle.js` → `window.BDS`, `bundle.css`, `tokens.css`). Tailwind utilities are mapped to its tokens in `src/index.css`.
- Mock data lives in `src/data/`. State is kept in localStorage.
- The **Prototype** button (bottom right) switches demo states: empty state, sample agents, replay the intro popup, reset.

## Status
- [x] App shell (Navbar + Automation sidebar)
- [x] AI Agents: intro popup, empty state, grid, table; agents have several channels (colored tags, +N overflow, Channels column; no channel tabs), set by the Builder's channel question
- [x] Create AI Agent: 2 e-commerce + 2 general examples (fill [placeholders]; Tab jumps), + menu (file, photos, link → chips), mic speech-to-text (Web Speech API, Chrome/Edge), Enter sends
- [x] Agent Builder: React Flow canvas + Agent Builder Assistance chat
  - Claude-style chat (`src/builder/chat/`): thinking state, word-by-word replies, ✓ action lines that build the canvas,
    question cards in 3 rounds (store · what it does · how it talks), summary card, follow-up chips, Stop
  - The e-commerce story (questions, replies, canvas steps, test answers) lives in `src/builder/script.ts`
  - Test now: canned replies with step-by-step execution trace; runs are listed in Executions
  - Goals, Handover reasons, Executions and Settings tabs
- [x] AI Agent Templates (`/templates`): opened from Explore Template, Browse All Templates, Browse pre-build AI Agent and the sidebar
  - Figma design: dropdown filters, card grid, details drawer with flow preview
  - Use this template → Builder opens already built, on Test now (no setup questions)
- [x] Empty state: the 6 cards (2 e-commerce, 4 general) are templates too; a click opens the built agent on Test now
- [x] Empty state (Version B chosen after an A/B review): AI agent icon, welcome heading, prompt box on the page with 5 example chips, then the 6 templates. The Create AI Agent page (+ Create Agent) shows the same `AgentStarter` under its header, titled "Create a new AI Agent"
- [x] General agents (Customer Service, Appointment, Billing, Reminders) have their own tools, goals, handover, test messages and replies (`src/builder/profiles.ts`)
- [x] Builder setup = 6 rounds that make a runnable customer service agent (`src/builder/script.ts` ROUNDS):
  1. Your business (name, website with "Fill from website", industry, jobs) · 2. Channels (connect cards with fake connect flows; at least one required)
  3. Data & integrations (platform, catalog, policies, Shopify/WooCommerce/Google Calendar/HubSpot/Zendesk connect) · 4. Availability (weekly hours editor, time zone, after-hours)
  5. Rules & handover (reasons, team, rules) · 6. Voice (language, tone, greeting)
  - Required questions have no Skip; answers found in the prompt are pre-filled; general agents skip store-only questions
  - New question kinds (fields, connect, hours) live in `src/builder/chat/SetupInputs.tsx`, reused by the Settings tab
- [x] Settings tab: AI agent profile (avatar with Change avatar, AI agent name, Designation *, Description), Other Settings (AI agent & human agent priority, Chat model), then Business, Channels, Data & integrations, Availability, Rules & handover, Voice — everything from setup is editable. Avatar shows on the agent cards; Save is blocked while Designation is empty
- [x] Template agents open built; "Customize with your info" in the Builder assistant runs the 6 rounds pre-filled from the template
- [x] Save / Saved: "Save" when anything changed since the last save, "Saved" (disabled) otherwise. The first save with setup complete makes the agent active; before that the Active switch is locked. After a successful test, Test Flow suggests saving.
- [x] Builder top bar: round ✨ Builder assistant button + separate Test now button (disabled with a tooltip while the assistant is building or setup isn't finished). Right panel is fixed full-height on the right, with expand and close ✕ (instant, no width animation; canvas re-fits). Both panels use the same chat: dark user bubbles with time, white replies with "name · time", composer with attach/emoji/mic and "Powered by REVE Chat". Test Flow has Clear chat and Show/Hide log

## Share with teammates (one HTML file)

```bash
npm run build:share
```

Creates `../share/AI-Agent-Builder-Prototype.html`: the whole prototype in one file (no server, no install).
Teammates double-click it to open it in Chrome, Edge or Safari. Links use `#/…` so they work from disk.
Each person's demo data stays in their own browser. Fonts load from Google Fonts when online; offline it falls back to a system font.

## Public link (Vercel)

Live at **https://ai-agent-builder-prototype.vercel.app** (Vercel project `ai-agent-builder-prototype`, deployed from `../share/site`).

To update it after changes:

```bash
npm run build:share
cd ../share/site && npx vercel deploy --prod --yes
```

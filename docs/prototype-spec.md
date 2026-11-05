# AI Agent Builder — Prototype Spec (short)

**Date:** 2026-11-04 · **Status:** v2, for review
**What:** a clickable UI prototype of REVE Chat's prompt-based AI Agent Builder. No LLM, no backend: all data and assistant replies are fake (scripted).
**Follow:** your Figma wireframe (`research/wireframe/`) for layout. **Design language:** REVEChat Design System ([artifact](https://claude.ai/artifact/7GrpPsisgD6RLKGx6VNUGY)).
**Not used:** Lumen's setup checklist / progress. Lumen is only a reference for how the assistant asks questions.

---

## 1. The flow

```
AI Agents (empty / grid / table) ──Create Agent──▶ Create AI Agent (prompt) ──Send──▶ Agent Builder
                                                                                  (canvas  |  assistant chat)
```

## 2. Screens

| # | Screen | What you can click |
|---|--------|--------------------|
| 1 | **Intro modal** (first visit) | Previous / Next through 4 steps, close |
| 2 | **AI Agents — empty state** | Start from scratch, template cards, Create Agent → screen 5 |
| 3 | **AI Agents — grid** | Channel tabs, search, grid/table toggle, active toggle, card → builder |
| 4 | **AI Agents — table** | Sort, select rows, status toggle, pagination, row → builder |
| 5 | **Create AI Agent** | Type prompt, "Try an example" card fills the prompt, Send → builder |
| 6 | **Agent Builder** | Chat with assistant, canvas updates, tabs, Test now, Save |

**Screen 5 — Create AI Agent:** exactly as wireframe: icon, "What would you like your agent to do?", prompt box (+, mic, send), 4 example cards, "Browse pre-build AI Agent". **No model selector.**

**Screen 6 — Agent Builder:**
- **Header:** back, agent name, tabs (Builder · Goals · Handover reasons · Executions · Settings), Inactive toggle, Test now, history, Save.
- **Left, canvas:** node flow: `On chat message` → `AI Agent` → Chat model + Tools (Google Sheet, Google Drive, HTTP Request, sub-agent). Zoom / pan controls.
- **Right, Agent Builder Assistance:** chat. The user's prompt from screen 5 is the first message.

## 3. How the builder "builds" (scripted)

**Demo story (always the same, whatever prompt is typed):** an **e-commerce queries & sales assistance agent** for an online store.

1. The assistant asks 4 short questions, one at a time, each with clickable answer options + free text.
2. **After each answer the canvas on the left changes.** The changed node is briefly highlighted.

| # | Assistant asks | Answer options | What changes on the left |
|---|----------------|----------------|--------------------------|
| 1 | What's your store name and what do you sell? | Share details · Use a placeholder | Agent node + header renamed → "ShopEase Sales Assistant" |
| 2 | What should the agent mainly help with? | Product questions · Order tracking · Sales & recommendations · All of these | Goals tab filled (answer product queries, track orders, recommend & upsell) |
| 3 | Where are your products and orders kept? | Google Sheet · Shopify / WooCommerce API · Google Drive docs | Tool nodes appear: Google Sheet (catalog), HTTP Request (orders), Google Drive (policies) |
| 4 | When should it hand off to your team? | Refund / return requests · Payment issues · Customer asks for a person (multi-select) | Handover reasons tab filled |

3. Assistant confirms: "Your sales assistant is ready. Try it with Test now."
4. **Test now:** e.g. customer asks "Do you have the running shoes in size 42?" → execution steps ("On chat message executed…", as in your wireframe) → canned reply with the product and an upsell suggestion.

## 4. Design system rules (applied when building)

- REVEChat DS components: Navbar, Sidebar, PageHeader, Tabs, DataTable, Card, Badge, Button, Switch, Textarea, Dialog, Avatar.
- Tokens only: Inter, `blue-90` primary, gray/black text, `offwhite` backgrounds and borders; no hard-coded colours.
- One primary button per view.
- Canvas nodes and chat bubbles aren't in the DS yet → built from Card / Badge / Button / Icons.

## 5. Tech (prototype)

Vite + React + TypeScript + Tailwind v4 (DS tokens), DS components, React Flow for the canvas, mock data in local files. Run with `npm run dev`; can be deployed to share.

## 6. Out of scope

Real AI or API calls, login, saving to a server, real node configuration, templates gallery (static only), voice input, file upload, publishing.

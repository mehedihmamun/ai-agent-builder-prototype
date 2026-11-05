import { profileOf } from "./profiles";
/**
 * The pre-written demo story: an e-commerce queries & sales assistance agent.
 * Whatever prompt is typed, the Builder Assistant walks through these 6 rounds and builds a runnable
 * customer service agent: business, channels, data & integrations, availability, rules & handover, voice.
 */

export type QuestionId =
  | "store" | "industry" | "goals"
  | "channels"
  | "platform" | "catalog" | "policies" | "integrations"
  | "hours" | "afterhours"
  | "handover" | "team" | "limits"
  | "language" | "tone" | "greeting";
export type RoundId = "business" | "channels" | "data" | "hours" | "rules" | "voice";

/** choice: numbered options · fields: text inputs · connect: connect cards · hours: weekly hours editor */
export type QuestionKind = "choice" | "fields" | "connect" | "hours";

/** A fake connect flow, shown when the user clicks Connect. */
export interface ConnectFlow {
  /** code: a snippet to paste · input: a value to confirm · oauth: sign in elsewhere · info: something to note */
  type: "code" | "input" | "oauth" | "info";
  text: string;
  value?: string;
  cta: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  connect?: ConnectFlow;
}

export interface Field {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
}

export interface Question {
  id: QuestionId;
  /** Short label for the question's tab in the card. */
  tab: string;
  text: string;
  kind?: QuestionKind;
  multi: boolean;
  /** Required questions have no Skip. */
  required?: boolean;
  /** A line under the question. */
  hint?: string;
  options: QuestionOption[];
  fields?: Field[];
  /** Placeholder of the "something else" free-text option; single-choice questions only. */
  otherPlaceholder?: string;
}

export interface Round {
  id: RoundId;
  title: string;
  questions: Question[];
}

export interface DayHours {
  on: boolean;
  from: string;
  to: string;
}

export const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export const DAY_LABEL: Record<(typeof DAYS)[number], string> = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };
export const TIMEZONES = ["Asia/Dhaka (GMT+6)", "Asia/Dubai (GMT+4)", "Europe/London (GMT+0)", "America/New_York (GMT-5)", "Asia/Singapore (GMT+8)"];

export interface Answer {
  ids: string[];
  text?: string;
  /** fields questions */
  fields?: Record<string, string>;
  /** hours question: per weekday, plus the time zone */
  hours?: Record<string, DayHours>;
  tz?: string;
}

/** `profile` marks a non-store agent (see profiles.ts); everything else is the store story. */
export type Answers = Partial<Record<QuestionId, Answer>> & { profile?: string };

export const ROUNDS: Round[] = [
  {
    id: "business",
    title: "Your business",
    questions: [
      {
        id: "store",
        tab: "Business",
        kind: "fields",
        required: true,
        text: "Tell me about your business",
        hint: "Add your website and I can fill the rest from it.",
        multi: false,
        options: [],
        fields: [
          { id: "name", label: "Business name", placeholder: "e.g. ShopEase", required: true },
          { id: "website", label: "Website", placeholder: "e.g. shopease.com" },
          { id: "about", label: "What you sell or do", placeholder: "One sentence about your business", multiline: true },
        ],
      },
      {
        id: "industry",
        tab: "Industry",
        text: "Which industry are you in?",
        multi: false,
        options: [
          { id: "ecommerce", label: "E-commerce & retail", description: "Online store, products and orders" },
          { id: "services", label: "Services & bookings", description: "Appointments, salons, clinics" },
          { id: "food", label: "Restaurant & food", description: "Menus, reservations, delivery" },
          { id: "finance", label: "Billing & subscriptions", description: "Invoices, plans and payments" },
        ],
        otherPlaceholder: "Another industry",
      },
      {
        id: "goals",
        tab: "Jobs",
        text: "What should the agent handle?",
        multi: true,
        options: [
          { id: "product", label: "Product questions", description: "Size, stock, price and details" },
          { id: "orders", label: "Order tracking", description: "Order status and delivery dates" },
          { id: "returns", label: "Returns & refunds", description: "Explain the policy and start a return" },
          { id: "sales", label: "Recommendations & upsell", description: "Suggest matching products and offers" },
        ],
      },
    ],
  },
  {
    id: "channels",
    title: "Channels",
    questions: [
      {
        id: "channels",
        tab: "Channels",
        kind: "connect",
        required: true,
        text: "Where should the agent answer your customers?",
        hint: "Connect at least one channel. You can add more later in Settings.",
        multi: true,
        // Option ids match the agent's Channel ids, so the answer is saved to the agent as-is.
        options: [
          { id: "web", label: "Website chat", description: "Chat widget on your website",
            connect: { type: "code", text: "Paste this before </body> on every page of your website.", value: '<script src="https://widget.revechat.com/ai.js" data-agent="ag_7f3k2" async></script>', cta: "I've added it" } },
          { id: "whatsapp", label: "WhatsApp", description: "WhatsApp Business number",
            connect: { type: "input", text: "Enter the WhatsApp Business number. We'll send a verification code to it.", value: "+880 1711-000000", cta: "Verify number" } },
          { id: "email", label: "Email", description: "Reply to support emails",
            connect: { type: "info", text: "Forward your support inbox to this address, then come back.", value: "support-ag7f3k2@inbox.revechat.com", cta: "I've set up forwarding" } },
          { id: "sms", label: "SMS", description: "Text messages",
            connect: { type: "input", text: "We'll give you this number for SMS. You can change it later.", value: "+1 (415) 555-0134", cta: "Use this number" } },
          { id: "voice", label: "Voice call", description: "Answer phone calls",
            connect: { type: "input", text: "Calls to this number will reach the agent.", value: "+1 (415) 555-0178", cta: "Use this number" } },
          { id: "webpush", label: "Web push", description: "Browser notifications",
            connect: { type: "oauth", text: "Turn on web push for your website visitors.", cta: "Turn on web push" } },
        ],
      },
    ],
  },
  {
    id: "data",
    title: "Data & integrations",
    questions: [
      {
        id: "platform",
        tab: "Platform",
        text: "Which platform runs your store?",
        multi: false,
        options: [
          { id: "shopify", label: "Shopify" },
          { id: "woocommerce", label: "WooCommerce" },
          { id: "custom", label: "Custom website", description: "Connect through your own API" },
        ],
        otherPlaceholder: "Another platform",
      },
      {
        id: "catalog",
        tab: "Catalog",
        text: "Where does your product catalog live?",
        multi: false,
        options: [
          { id: "platform", label: "In my store platform", description: "Read products straight from the store" },
          { id: "sheet", label: "Google Sheet" },
          { id: "drive", label: "Google Drive files" },
        ],
        otherPlaceholder: "Somewhere else",
      },
      {
        id: "policies",
        tab: "Policies",
        text: "Where are your shipping and return policies?",
        multi: false,
        options: [
          { id: "website", label: "On my website", description: "We'll read the policy pages" },
          { id: "drive", label: "In Google Drive documents" },
          { id: "later", label: "I'll add them later" },
        ],
        otherPlaceholder: "Paste a link",
      },
      {
        id: "integrations",
        tab: "Integrations",
        kind: "connect",
        text: "Connect the tools your team uses",
        hint: "Optional. The agent can read and update them for you.",
        multi: true,
        options: [
          { id: "shopify", label: "Shopify", description: "Products, orders and customers",
            connect: { type: "input", text: "Enter your Shopify store address, then allow REVE Chat access.", value: "shopease.myshopify.com", cta: "Authorize" } },
          { id: "woocommerce", label: "WooCommerce", description: "Products and orders",
            connect: { type: "input", text: "Enter your store URL. We'll create a read-only API key.", value: "https://shopease.com", cta: "Connect store" } },
          { id: "gcal", label: "Google Calendar", description: "Check slots and book appointments",
            connect: { type: "oauth", text: "Sign in with Google and allow calendar access.", cta: "Sign in with Google" } },
          { id: "hubspot", label: "HubSpot", description: "Create and update contacts",
            connect: { type: "oauth", text: "Sign in to HubSpot and allow contact access.", cta: "Sign in to HubSpot" } },
          { id: "zendesk", label: "Zendesk", description: "Create tickets for the team",
            connect: { type: "input", text: "Enter your Zendesk subdomain.", value: "shopease.zendesk.com", cta: "Authorize" } },
        ],
      },
    ],
  },
  {
    id: "hours",
    title: "Availability",
    questions: [
      {
        id: "hours",
        tab: "Hours",
        kind: "hours",
        text: "When is your team available?",
        hint: "The agent answers 24/7. These hours decide when it can hand over to a person.",
        multi: false,
        options: [],
      },
      {
        id: "afterhours",
        tab: "After hours",
        text: "Outside these hours, what should the agent do?",
        multi: false,
        options: [
          { id: "collect", label: "Collect details for the team", description: "Take name, contact and question; the team follows up" },
          { id: "back", label: "Say when the team is back", description: "Share the next opening time" },
          { id: "keep", label: "Keep helping on its own", description: "No handover until the team is back" },
        ],
      },
    ],
  },
  {
    id: "rules",
    title: "Rules & handover",
    questions: [
      {
        id: "handover",
        tab: "Handover",
        text: "When should it hand the chat to your team?",
        multi: true,
        options: [
          { id: "refund", label: "Refund or return requests" },
          { id: "payment", label: "Payment issues" },
          { id: "person", label: "Customer asks for a person" },
          { id: "unknown", label: "Agent can't answer" },
        ],
      },
      {
        id: "team",
        tab: "Team",
        text: "Which team should get handed-over chats?",
        multi: false,
        options: [
          { id: "support", label: "Support team" },
          { id: "sales", label: "Sales team" },
          { id: "billing", label: "Billing team" },
          { id: "any", label: "Any available agent", description: "Round robin across all teams" },
        ],
      },
      {
        id: "limits",
        tab: "Rules",
        text: "Any rules the agent must follow?",
        multi: true,
        options: [
          { id: "orderFirst", label: "Ask for the order number first" },
          { id: "noPayment", label: "Never ask for card or payment details" },
          { id: "noPromise", label: "Never promise an exact delivery date" },
          { id: "refund50", label: "Approve refunds up to $50 on its own" },
          { id: "discount10", label: "Offer up to 10% discount to save a sale" },
        ],
      },
    ],
  },
  {
    id: "voice",
    title: "How it talks",
    questions: [
      {
        id: "language",
        tab: "Language",
        text: "Which language should it reply in?",
        multi: false,
        options: [
          { id: "en", label: "English" },
          { id: "bn", label: "Bangla" },
          { id: "match", label: "Match the customer", description: "Reply in the language the customer uses" },
        ],
        otherPlaceholder: "Another language",
      },
      {
        id: "tone",
        tab: "Tone",
        text: "What tone fits your brand?",
        multi: false,
        options: [
          { id: "friendly", label: "Friendly", description: "Warm and helpful, a light emoji now and then" },
          { id: "professional", label: "Professional", description: "Polite and to the point" },
          { id: "short", label: "Short & direct", description: "Quick answers, no small talk" },
        ],
        otherPlaceholder: "Describe your tone",
      },
      {
        id: "greeting",
        tab: "Greeting",
        kind: "fields",
        text: "How should it greet customers?",
        multi: false,
        options: [],
        fields: [{ id: "message", label: "Greeting message", multiline: true }],
      },
    ],
  },
];

/** Store-only questions; agents with a profile (appointments, billing…) skip them. */
const STORE_ONLY: QuestionId[] = ["goals", "platform", "catalog", "policies"];
export const questionsFor = (round: Round, answers: Answers) =>
  answers.profile ? round.questions.filter((q) => !STORE_ONLY.includes(q.id)) : round.questions;

const weekdays = (from: string, to: string, days: string[]) =>
  Object.fromEntries(DAYS.map((d) => [d, { on: days.includes(d), from, to }]));
export const HOURS_PRESETS: { id: string; label: string; hours: Record<string, DayHours> }[] = [
  { id: "office", label: "Mon–Fri 9–6", hours: weekdays("09:00", "18:00", ["mon", "tue", "wed", "thu", "fri"]) },
  { id: "week", label: "Sat–Thu 10–8", hours: weekdays("10:00", "20:00", ["sat", "sun", "mon", "tue", "wed", "thu"]) },
  { id: "daily", label: "Every day 9–9", hours: weekdays("09:00", "21:00", [...DAYS]) },
  { id: "always", label: "24/7", hours: weekdays("00:00", "23:59", [...DAYS]) },
];

const ALL_QUESTIONS = ROUNDS.flatMap((r) => r.questions);
export const questionById = (id: QuestionId) => ALL_QUESTIONS.find((q) => q.id === id)!;

/** Answers used when a question is skipped, and for agents that were built before. */
export const DEFAULT_ANSWERS: Required<Omit<Answers, "profile">> = {
  store: { ids: [], fields: { name: "ShopEase", website: "shopease.com", about: "Online store for fashion & footwear, delivering across Bangladesh." } },
  industry: { ids: ["ecommerce"] },
  goals: { ids: ["product", "orders", "returns", "sales"] },
  channels: { ids: ["web", "whatsapp"] },
  platform: { ids: ["shopify"] },
  catalog: { ids: ["platform"] },
  policies: { ids: ["website"] },
  integrations: { ids: [] },
  hours: { ids: ["office"], hours: HOURS_PRESETS[0].hours, tz: TIMEZONES[0] },
  afterhours: { ids: ["collect"] },
  handover: { ids: ["refund", "payment", "person", "unknown"] },
  team: { ids: ["support"] },
  limits: { ids: ["orderFirst", "noPayment"] },
  language: { ids: ["match"] },
  tone: { ids: ["friendly"] },
  greeting: { ids: [], fields: { message: "Hi! 👋 I'm the ShopEase assistant. How can I help you today?" } },
};

/** "Mon–Fri 09:00–18:00", "24/7" or "Custom hours". */
export function hoursLabel(a: Answer | undefined) {
  const h = a?.hours;
  if (!h) return "";
  const on = DAYS.filter((d) => h[d]?.on);
  if (!on.length) return "Closed";
  if (on.length === 7 && on.every((d) => h[d].from === "00:00" && h[d].to === "23:59")) return "24/7";
  const same = on.every((d) => h[d].from === h[on[0]].from && h[d].to === h[on[0]].to);
  if (!same) return "Custom hours";
  // Consecutive run (wrapping the week) reads as a range.
  const idx = on.map((d) => DAYS.indexOf(d));
  const run = on.length > 2 && idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  const days = on.length === 7 ? "Every day" : run ? `${DAY_LABEL[on[0]]}–${DAY_LABEL[on[on.length - 1]]}` : on.map((d) => DAY_LABEL[d]).join(", ");
  return `${days} ${h[on[0]].from}–${h[on[0]].to}`;
}

/** The answer as readable text: typed text, or the chosen option labels. */
export function answerLabel(id: QuestionId, a: Answer | undefined) {
  if (!a) return "";
  if (a.text?.trim() && !a.hours) return a.text.trim();
  const q = questionById(id);
  if (q.kind === "hours") return hoursLabel(a);
  if (q.kind === "fields") return Object.values(a.fields ?? {}).filter((v) => v?.trim()).join(" · ");
  if (q.kind === "connect" && !a.ids.length) return "None yet";
  return q.options
    .filter((o) => a.ids.includes(o.id))
    .map((o) => o.label)
    .join(", ");
}

const lowerList = (items: string[]) => {
  const l = items.map((s) => s.charAt(0).toLowerCase() + s.slice(1));
  return l.length > 1 ? `${l.slice(0, -1).join(", ")} and ${l[l.length - 1]}` : (l[0] ?? "");
};

export function storeName(answers: Answers) {
  const a = answers.store;
  return a?.fields?.name?.trim() || a?.text?.trim() || "ShopEase";
}

export const agentNameFor = (answers: Answers) =>
  `${storeName(answers)} ${!answers.industry || answers.industry.ids.includes("ecommerce") ? "Sales" : "Support"} Assistant`;
export const platformName = (answers: Answers) => answerLabel("platform", answers.platform) || "Shopify";
export const channelsLabel = (answers: Answers) => answerLabel("channels", answers.channels) || "Website chat";

const GOALS: Record<string, { title: string; description: string }> = {
  product: { title: "Answer product questions", description: "Size, stock, price and product details from the catalog." },
  orders: { title: "Track orders", description: "Tell customers where their order is and when it arrives." },
  returns: { title: "Handle returns & refunds", description: "Explain the return policy and start a return when asked." },
  sales: { title: "Recommend & upsell", description: "Suggest matching products, offers and add-ons to grow each order." },
};

export const goalsFor = (answers: Answers) =>
  profileOf(answers.profile)?.goals ?? (answers.goals?.ids ?? []).map((id) => ({ id, ...GOALS[id] }));

export type ToolKind = "sheet" | "shop" | "drive" | "web" | "calendar" | "api" | "clock";

export interface CanvasTool {
  id: string;
  label: string;
  sub: string;
  kind: ToolKind;
}

/** Tool steps under the agent on the canvas, from the answers. */
/** Integrations that add their own step on the canvas (store platforms are covered by catalog/orders). */
const INTEGRATION_TOOLS: Record<string, CanvasTool> = {
  gcal: { id: "gcal", label: "Google Calendar", sub: "Bookings", kind: "calendar" },
  hubspot: { id: "hubspot", label: "HubSpot", sub: "Contacts", kind: "api" },
  zendesk: { id: "zendesk", label: "Zendesk", sub: "Tickets", kind: "api" },
};
const extraTools = (answers: Answers): CanvasTool[] => [
  ...(answers.integrations?.ids ?? []).flatMap((id) => (INTEGRATION_TOOLS[id] ? [INTEGRATION_TOOLS[id]] : [])),
  ...(answers.hours?.hours ? [{ id: "hours", label: "Business hours", sub: hoursLabel(answers.hours), kind: "clock" as const }] : []),
];

export function canvasTools(answers: Answers): CanvasTool[] {
  const profile = profileOf(answers.profile);
  if (profile) return [...profile.tools, ...extraTools(answers).filter((t) => !profile.tools.some((p) => p.id === t.id))];
  const platform = platformName(answers);
  const api = answers.platform?.ids.includes("custom") ? "Store API" : platform;
  const tools: CanvasTool[] = [];

  const catalog = answers.catalog;
  if (catalog) {
    if (catalog.ids.includes("sheet")) tools.push({ id: "catalog", label: "Google Sheet", sub: "Product catalog", kind: "sheet" });
    else if (catalog.ids.includes("drive")) tools.push({ id: "catalog", label: "Google Drive", sub: "Product files", kind: "drive" });
    else tools.push({ id: "catalog", label: `${api} Products`, sub: "HTTP Request", kind: "shop" });
  }
  if (answers.goals?.ids.includes("orders")) tools.push({ id: "orders", label: `${api} Orders`, sub: "HTTP Request", kind: "shop" });

  const policies = answers.policies;
  if (policies?.ids.includes("website") || policies?.text) tools.push({ id: "policies", label: "Website pages", sub: "Shipping & returns", kind: "web" });
  else if (policies?.ids.includes("drive")) tools.push({ id: "policies", label: "Google Drive", sub: "Policies", kind: "drive" });
  return [...tools, ...extraTools(answers)];
}

export const handoverFor = (answers: Answers) =>
  profileOf(answers.profile)?.handover.map((label) => ({ id: label, label })) ??
  (answers.handover?.ids ?? []).map((id) => ({ id, label: questionById("handover").options.find((o) => o.id === id)!.label }));

export const HANDOFF_MESSAGE = "I'll pass this to our team so they can help you. Someone will reply here shortly.";

// ---- What the assistant says and does ----

/** One "tool use" line in an assistant reply. `node` is the canvas step it changes. */
export interface ScriptAction {
  label: string;
  detail?: string;
  node: string;
}

export const START_THINKING = "Reading your prompt";
export const START_TEXT =
  "I'll turn your description into an **e-commerce sales assistant**. I've set up the basics on the canvas.";
export const START_ACTIONS: ScriptAction[] = [
  { label: "Created agent draft", detail: "Untitled AI Agent", node: "agent" },
  { label: "Added chat trigger", detail: "On chat message", node: "trigger" },
  { label: "Connected chat model", detail: "OpenAI · GPT-4o", node: "model" },
];
export const START_FOLLOW_UP =
  "To make it a working agent, I need a few details — **6 short rounds**: your business, channels, data, availability, rules and voice. Each answer updates the agent on the left.";
/** Things already found in the prompt are filled in, so the user only confirms them. */
export function answersFromPrompt(prompt: string): Answers {
  const t = prompt.toLowerCase();
  const a: Answers = {};
  if (/shopify/.test(t)) a.platform = { ids: ["shopify"] };
  else if (/woo/.test(t)) a.platform = { ids: ["woocommerce"] };
  const goals = [["product", /product|size|stock|price/], ["orders", /order|deliver|track|shipping/], ["returns", /return|refund|exchange/], ["sales", /recommend|upsell|offer|sales/]] as const;
  const g = goals.filter(([, re]) => re.test(t)).map(([id]) => id as string);
  if (g.length) a.goals = { ids: g };
  if (/shop|store|product|order/.test(t)) a.industry = { ids: ["ecommerce"] };
  else if (/appointment|booking|clinic|salon/.test(t)) a.industry = { ids: ["services"] };
  return a;
}
export const knownFromPrompt = (a: Answers) =>
  [a.platform && answerLabel("platform", a.platform), a.goals && lowerList(answerLabel("goals", a.goals).split(", ")), a.industry && answerLabel("industry", a.industry)].filter(Boolean) as string[];

export const CUSTOMIZE_LABEL = "Customize with your info";
export const CUSTOMIZE_TEXT =
  "Let's make it yours. I'll go through the same **6 short rounds**, already filled in from the template — change only what's different for your business.";

export const TEMPLATE_THINKING = "Setting up your template";
export const templateStart = (title: string) => `I've set up **${title}** from the template — its goals, tools and handover are ready on the canvas.`;
export function templateActions(title: string, answers: Answers): ScriptAction[] {
  const goals = goalsFor(answers);
  const n = handoverFor(answers).length;
  return [
    { label: "Created agent from template", detail: title, node: "agent" },
    { label: "Added chat trigger", detail: "On chat message", node: "trigger" },
    { label: "Connected chat model", detail: "OpenAI · GPT-4o", node: "model" },
    ...canvasTools(answers).map((t) => ({ label: `Connected ${t.label}`, detail: t.sub, node: t.id })),
    { label: `Added ${goals.length} goal${goals.length === 1 ? "" : "s"}`, detail: goals.map((g) => g.title).join(", "), node: "agent" },
    ...(n ? [{ label: "Added handover to team", detail: `${n} reason${n === 1 ? "" : "s"}`, node: "handoff" }] : []),
  ];
}
export const TEMPLATE_FOLLOW_UP = "I just need your **store details** — one short round of questions.";
export const ALL_SET = "All set. Here's your agent:";

export const THINKING: Record<RoundId, string> = {
  business: "Reading your business",
  channels: "Connecting channels",
  data: "Connecting your data",
  hours: "Setting availability",
  rules: "Adding your rules",
  voice: "Finishing your agent",
};

export const teamLabel = (a: Answers) => answerLabel("team", a.team) || "Support team";

export function roundActions(id: RoundId, answers: Answers): ScriptAction[] {
  switch (id) {
    case "business": {
      const goals = goalsFor(answers);
      return [
        { label: "Renamed agent", detail: agentNameFor(answers), node: "agent" },
        { label: "Saved business details", detail: [answers.store?.fields?.website, answerLabel("industry", answers.industry)].filter(Boolean).join(" · "), node: "agent" },
        ...(goals.length ? [{ label: `Added ${goals.length} goal${goals.length === 1 ? "" : "s"}`, detail: goals.map((g) => g.title).join(", "), node: "agent" }] : []),
      ];
    }
    case "channels":
      return [{ label: "Connected channels", detail: channelsLabel(answers), node: "trigger" }];
    case "data": {
      const integ = (answers.integrations?.ids ?? []).map((i) => questionById("integrations").options.find((o) => o.id === i)?.label).filter(Boolean);
      return [
        ...canvasTools(answers).filter((t) => t.id !== "hours" && !INTEGRATION_TOOLS[t.id]).map((t) => ({ label: `Connected ${t.label}`, detail: t.sub, node: t.id })),
        ...canvasTools(answers).filter((t) => INTEGRATION_TOOLS[t.id]).map((t) => ({ label: `Connected ${t.label}`, detail: t.sub, node: t.id })),
        ...(integ.length && !canvasTools(answers).some((t) => INTEGRATION_TOOLS[t.id]) ? [{ label: "Connected integrations", detail: integ.join(", "), node: "agent" }] : []),
      ];
    }
    case "hours":
      return [
        { label: "Set business hours", detail: `${hoursLabel(answers.hours)} · ${answers.hours?.tz?.split(" ")[0] ?? ""}`, node: "hours" },
        { label: "Set after-hours reply", detail: answerLabel("afterhours", answers.afterhours), node: "agent" },
      ];
    case "rules": {
      const n = handoverFor(answers).length;
      const rules = answers.limits?.ids.length ?? 0;
      return [
        ...(n ? [{ label: "Added handover to team", detail: `${n} reason${n === 1 ? "" : "s"} → ${teamLabel(answers)}`, node: "handoff" }] : []),
        ...(rules ? [{ label: `Added ${rules} rule${rules === 1 ? "" : "s"}`, detail: answerLabel("limits", answers.limits), node: "agent" }] : []),
      ];
    }
    case "voice":
      return [
        { label: "Set reply language", detail: answerLabel("language", answers.language), node: "agent" },
        { label: "Set tone", detail: answerLabel("tone", answers.tone), node: "agent" },
        { label: "Set greeting", detail: answers.greeting?.fields?.message ?? "", node: "agent" },
      ];
  }
}

export function roundText(id: RoundId, answers: Answers): { intro: string; outro?: string } {
  switch (id) {
    case "business":
      return { intro: `Nice to meet **${storeName(answers)}**. I've named the agent and saved your business details.`, outro: "Next: where should it talk to your customers?" };
    case "channels":
      return { intro: `Connected **${channelsLabel(answers)}**. New chats there will reach the agent.`, outro: "Now let's connect the data it needs." };
    case "data":
      return { intro: "Done — the agent can now read your data and use your tools.", outro: "When is your team around to take over?" };
    case "hours":
      return { intro: `Your team is available **${hoursLabel(answers.hours)}**. Outside that, the agent will ${answerLabel("afterhours", answers.afterhours).charAt(0).toLowerCase() + answerLabel("afterhours", answers.afterhours).slice(1)}.`, outro: "Next: your rules and when to hand over." };
    case "rules":
      return { intro: `Handover goes to the **${teamLabel(answers).toLowerCase()}**, and the agent will follow your rules.`, outro: "Last round: how it talks to your customers." };
    case "voice":
      return { intro: "All set. Here's your agent:", outro: "Try it with **Test now**. When you're happy, **Save** it to make it active." };
  }
}

export const FOLLOW_UPS = ["Add a welcome message", "Offer free shipping over $50", "Make replies shorter"];

export const CHANGE_THINKING = "Updating your agent";
export const changeText = (request: string) => `Done. I've updated the agent's instructions to "${request}".`;
export const READY_TEXT = "This agent is set up. Ask me for a change, or try it with **Test now**.";
/** First message for an agent opened from a template: it's built, so test first, then change. */
export const templateReady = (title: string) =>
  `This agent is set up from the **${title}** template — its goals, tools and handover are ready on the canvas.`;
export const CHANGE_PROMPT = "Tested it? Tell me what to add, remove or change, or pick one below.";
export const CHANGE_IDEAS = ["Add WhatsApp as a channel", "Hand off refund questions to the team", "Make replies shorter"];

export const TEST_SUGGESTIONS = ["Do you have running shoes in size 42?", "Where is my order #1042?", "I want to return my order"];
export const testSuggestions = (answers: Answers) => profileOf(answers.profile)?.tests ?? TEST_SUGGESTIONS;
export const changeIdeas = (answers: Answers) => profileOf(answers.profile)?.changeIdeas ?? CHANGE_IDEAS;
export const triggerFor = (answers: Answers) => profileOf(answers.profile)?.trigger ?? { label: "On chat message" };
/** First summary row: the store, or the business for a non-store agent. */
export const businessRow = (answers: Answers): [string, string] =>
  profileOf(answers.profile)?.business ?? ["Store", `${storeName(answers)} · ${platformName(answers)}`];

export interface TraceStep {
  node: string;
  label: string;
  seconds: number;
}

/** A canned run of the agent for Test now: which nodes run, and the reply. */
export function testRun(input: string, ctx: { ready: boolean; agentName: string; answers: Answers }) {
  const step = (node: string, label: string, seconds: number): TraceStep => ({ node, label, seconds });
  const tools = canvasTools(ctx.answers);
  const tool = (id: CanvasTool["id"], seconds: number) => {
    const t = tools.find((x) => x.id === id);
    return t ? [step(t.id, t.label, seconds)] : [];
  };
  const base = [step("trigger", triggerFor(ctx.answers).label, 0.12), step("agent", ctx.agentName, 1.1)];
  const model = step("model", "OpenAI Chat Model", 0.86);
  const handsOff = (id: string) => ctx.answers.handover?.ids.includes(id);
  const text = input.toLowerCase();

  if (!ctx.ready) {
    return { trace: [...base, model], reply: "I need some more info for that. Finish setting me up in the Builder Assistant first." };
  }
  const profile = profileOf(ctx.answers.profile);
  if (profile) {
    const rule = profile.replies.find((r) => r.match.test(text));
    if (rule?.handoff) return { trace: [...base, model, step("handoff", "Handover to team", 0.2)], reply: HANDOFF_MESSAGE };
    const ran = (rule?.tools ?? []).flatMap((id, i) => tool(id, 0.42 + i * 0.2));
    return { trace: [...base, ...ran, model], reply: rule?.reply ?? profile.fallback };
  }
  if (/person|human|agent please/.test(text) || (/refund|return|money back/.test(text) && handsOff("refund"))) {
    return { trace: [...base, model, step("handoff", "Handover to team", 0.2)], reply: HANDOFF_MESSAGE };
  }
  if (/refund|return/.test(text)) {
    return {
      trace: [...base, ...tool("policies", 0.42), model],
      reply: "You can return any unworn item within **14 days** of delivery. I can start the return for you — what's your order number?",
    };
  }
  if (/order|track|deliver|#\d+/.test(text)) {
    return {
      trace: [...base, ...tool("orders", 0.64), model],
      reply: "Order **#1042** was shipped yesterday and should arrive on **Friday, 6 Nov**. You'll get a message when it's out for delivery.",
    };
  }
  if (/shoe|size|stock|price|have|product|shirt|dress/.test(text)) {
    return {
      trace: [...base, ...tool("catalog", 0.48), model],
      reply:
        "Yes! The **AirStride Runner** is in stock in size 42, in black and white, for **$59**. Many customers also add the **ComfortFit running socks** (3-pack, $9). Want me to add both to your cart?",
    };
  }
  return {
    trace: [...base, model],
    reply: "I can help with product questions, order tracking, returns and recommendations. What are you looking for today?",
  };
}

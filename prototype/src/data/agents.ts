export type Channel = "web" | "whatsapp" | "webpush" | "sms" | "email" | "voice";

export type AgentPriority = "ai-always" | "human-first" | "after-hours" | "ai-only";
export const PRIORITY_OPTIONS: { id: AgentPriority; label: string; description: string }[] = [
  { id: "ai-always", label: "AI Agent - Always-On", description: "The AI agent answers every chat and hands over by your rules" },
  { id: "human-first", label: "Human agent first", description: "The AI agent answers only when no human agent is free" },
  { id: "after-hours", label: "AI Agent - Outside business hours", description: "The AI agent answers when your team is offline" },
  { id: "ai-only", label: "AI Agent only", description: "No handover to human agents" },
];
export const DEFAULT_DESIGNATION = "Customer support assistant";

export interface Agent {
  id: string;
  name: string;
  description: string;
  direction: "Inbound" | "Outbound";
  /** Channels the agent answers on; empty until they are chosen in the Builder. */
  channels: Channel[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  /** What the user typed on the Create AI Agent screen. */
  prompt?: string;
  /** Set when the agent was created from a template. */
  templateId?: string;
  /** Config fingerprint at the last Save; the Save button shows "Saved" while nothing changed since. */
  savedHash?: string;
  /** Saved once with setup complete, so it went live; until then it can't be switched on. */
  launched?: boolean;
  /** Settings: avatar style (see BotAvatar AVATARS), role shown to customers, and who answers first. */
  avatar?: string;
  designation?: string;
  priority?: AgentPriority;
}

export const CHANNEL_LABEL: Record<Channel, string> = {
  web: "Website chat",
  whatsapp: "WhatsApp",
  webpush: "Web Push",
  sms: "SMS",
  email: "Email",
  voice: "Voice call",
};

const OWNER = "Mehedi Hasan Mamun";

const seed: [string, Agent["direction"], Channel[], string, boolean][] = [
  ["Login Verification (OTP)", "Outbound", ["sms"], "2026-10-15T09:30:00", true],
  ["Delivery Status Update", "Outbound", ["whatsapp", "sms"], "2026-10-15T09:30:00", false],
  ["Utility Bill Due Reminder", "Outbound", ["sms", "email"], "2026-11-05T14:15:00", true],
  ["Driver Win-back", "Outbound", ["whatsapp"], "2026-12-12T15:00:00", true],
  ["Loyalty Points Expiry Nudge", "Outbound", ["email", "webpush"], "2027-01-28T10:00:00", true],
  ["Flight Check-in & Boarding Reminder", "Outbound", ["whatsapp", "sms", "email"], "2027-02-19T13:45:00", true],
  ["Customer Service AI", "Inbound", ["web", "whatsapp", "email", "sms", "webpush"], "2027-03-03T16:20:00", true],
  ["Marketing Strategist AI Agent", "Inbound", ["web", "webpush"], "2027-04-22T12:10:00", true],
  ["Appointment Scheduling", "Inbound", ["voice", "whatsapp"], "2027-05-30T08:55:00", true],
  ["Account Management", "Inbound", ["web"], "2027-06-14T17:30:00", false],
  ["Billing Inquiry", "Inbound", ["voice"], "2027-07-25T11:00:00", true],
  ["Product Inquiry", "Inbound", ["web", "whatsapp"], "2027-08-09T19:45:00", true],
  ["Order Tracking Assistant", "Inbound", ["web", "whatsapp", "sms"], "2027-09-17T14:30:00", true],
  ["Return & Refund Helper", "Inbound", ["web", "email"], "2027-10-04T09:15:00", true],
  ["Lead Qualification Bot", "Inbound", [], "2027-11-11T15:50:00", false],
  ["Abandoned Cart Recovery", "Outbound", ["whatsapp", "email", "webpush"], "2027-12-26T13:00:00", true],
  ["Telecom Data Pack Expiry Upsell", "Outbound", ["sms"], "2028-01-08T10:40:00", true],
  ["Clinic Appointment Reminder", "Outbound", ["voice", "sms"], "2028-01-19T09:00:00", true],
  ["Insurance Claim Status", "Inbound", ["voice", "web"], "2028-02-02T16:05:00", true],
  ["Feedback Survey Collector", "Outbound", ["whatsapp"], "2028-02-14T12:25:00", false],
  ["Restaurant Table Booking", "Inbound", ["whatsapp", "web"], "2028-03-01T18:40:00", true],
  ["Subscription Renewal Reminder", "Outbound", ["email"], "2028-03-15T08:30:00", true],
];

export const SAMPLE_AGENTS: Agent[] = seed.map(([name, direction, channels, updatedAt, active], i) => ({
  id: `agent-${i + 1}`,
  name,
  description: "Automates customer interactions, providing instant answers and efficient support.",
  direction,
  channels,
  createdBy: OWNER,
  createdAt: "2026-09-23T11:44:00",
  updatedAt,
  active,
}));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "23 Sep 2026 11:44 am" */
export function formatDate(iso: string, separator = " ") {
  const d = new Date(iso);
  const h = d.getHours();
  const time = `${String(h % 12 || 12).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}${separator}${time}`;
}

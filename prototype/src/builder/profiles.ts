import type { CanvasTool } from "./script";

/**
 * Scripted setups for agents that are not e-commerce (the general empty-state templates).
 * An agent with `answers.profile` uses these tools, goals, tests and replies instead of the store story.
 */
export interface Profile {
  /** First row of the summary card, e.g. ["Business", "Help desk"]. */
  business: [string, string];
  trigger: { label: string; sub?: string };
  tools: CanvasTool[];
  goals: { id: string; title: string; description: string }[];
  handover: string[];
  tests: string[];
  /** First matching rule answers a test message; `tools` are the canvas steps it runs. */
  replies: { match: RegExp; tools?: string[]; handoff?: boolean; reply: string }[];
  fallback: string;
  changeIdeas: string[];
}

export const PROFILES: Record<string, Profile> = {
  "customer-service": {
    business: ["Business", "Help desk · Help center"],
    trigger: { label: "On chat message" },
    tools: [
      { id: "docs", label: "Help center", sub: "Knowledge base", kind: "web" },
      { id: "tickets", label: "Ticketing", sub: "HTTP Request", kind: "api" },
    ],
    goals: [
      { id: "faq", title: "Answer common questions", description: "Reply from your help center articles and website." },
      { id: "ticket", title: "Log support tickets", description: "Create a ticket with the details when an issue needs follow-up." },
    ],
    handover: ["Customer asks for a person", "Agent can't answer", "Complaints"],
    tests: ["How do I reset my password?", "My issue still isn't fixed", "I want to talk to a person"],
    replies: [
      { match: /person|human|agent please|talk to/, handoff: true, reply: "" },
      {
        match: /password|login|log in|reset/,
        tools: ["docs"],
        reply: "No problem! Go to **Sign in → Forgot password**, enter your email and we'll send you a reset link. It's valid for **30 minutes**.",
      },
      {
        match: /not fixed|issue|problem|broken|still/,
        tools: ["docs", "tickets"],
        reply: "Sorry about that. I've logged ticket **#58213** with your details, and our team will email you within **4 hours**.",
      },
    ],
    fallback: "I can answer questions from our help center or log a ticket for our team. What do you need help with?",
    changeIdeas: ["Add WhatsApp as a channel", "Hand off billing questions to the team", "Make replies shorter"],
  },
  appointment: {
    business: ["Business", "Appointments · Google Calendar"],
    trigger: { label: "On chat message" },
    tools: [
      { id: "calendar", label: "Google Calendar", sub: "Free slots & bookings", kind: "calendar" },
      { id: "services", label: "Google Sheet", sub: "Services & prices", kind: "sheet" },
    ],
    goals: [
      { id: "book", title: "Book appointments", description: "Find a free slot and book it for the customer." },
      { id: "change", title: "Reschedule or cancel", description: "Move or cancel a booking when the customer asks." },
      { id: "confirm", title: "Send confirmations", description: "Confirm every booking with the date, time and address." },
    ],
    handover: ["Customer asks for a person", "Urgent or special requests"],
    tests: ["Can I book a haircut tomorrow at 4pm?", "I need to reschedule my appointment", "Cancel my booking"],
    replies: [
      { match: /person|human|urgent|talk to/, handoff: true, reply: "" },
      {
        match: /reschedul|move|change/,
        tools: ["calendar"],
        reply: "Sure! Your appointment is on **Thursday at 11:00**. I have **Friday at 10:00** or **Friday at 15:30** free — which works better?",
      },
      {
        match: /cancel/,
        tools: ["calendar"],
        reply: "Done — your booking on **Thursday at 11:00** is cancelled. Want me to find you a new time?",
      },
      {
        match: /book|appointment|haircut|slot|tomorrow|available/,
        tools: ["services", "calendar"],
        reply: "Yes! **Tomorrow at 4:00 pm** is free for a haircut (**45 min, $25**). Shall I book it in your name?",
      },
    ],
    fallback: "I can book, move or cancel an appointment for you. What would you like to do?",
    changeIdeas: ["Send a reminder a day before", "Add Website chat as a channel", "Make replies shorter"],
  },
  billing: {
    business: ["Business", "Billing · Invoices & payments"],
    trigger: { label: "On chat message" },
    tools: [
      { id: "billing", label: "Billing system", sub: "Invoices & payments", kind: "api" },
      { id: "faq", label: "Website pages", sub: "Billing FAQ", kind: "web" },
    ],
    goals: [
      { id: "invoices", title: "Explain invoices", description: "Walk customers through the charges on their invoice." },
      { id: "status", title: "Check payment status", description: "Tell customers if a payment went through." },
      { id: "due", title: "Share due dates", description: "Tell customers what is due and when." },
    ],
    handover: ["Payment disputes", "Refund requests", "Customer asks for a person"],
    tests: ["Why is my invoice higher this month?", "Did my payment go through?", "I want a refund"],
    replies: [
      { match: /refund|dispute|person|human|talk to/, handoff: true, reply: "" },
      {
        match: /invoice|higher|charge|bill/,
        tools: ["billing", "faq"],
        reply: "Your **October invoice ($48)** is $10 higher because **2 extra seats** were added on 12 Oct. Everything else is the same as last month.",
      },
      {
        match: /paid|payment|go through|due/,
        tools: ["billing"],
        reply: "Yes — we received your payment of **$48** on **2 Nov**. Your next invoice is due on **2 Dec**.",
      },
    ],
    fallback: "I can explain your invoice, check a payment or tell you what's due. What do you need?",
    changeIdeas: ["Add WhatsApp as a channel", "Share a payment link when asked", "Make replies shorter"],
  },
  reminders: {
    business: ["Business", "Payments & renewals"],
    trigger: { label: "On schedule", sub: "Daily at 10:00" },
    tools: [
      { id: "due", label: "Google Sheet", sub: "Upcoming payments", kind: "sheet" },
      { id: "billing", label: "Billing system", sub: "Payment links", kind: "api" },
    ],
    goals: [
      { id: "remind", title: "Send payment reminders", description: "Remind customers 3 days before a payment is due." },
      { id: "renew", title: "Send renewal reminders", description: "Remind customers before their plan renews." },
      { id: "follow", title: "Answer follow-up questions", description: "Reply when a customer answers a reminder." },
    ],
    handover: ["Billing disputes", "Customer asks for a person"],
    tests: ["I already paid", "Can I pay next week?", "How do I renew my plan?"],
    replies: [
      { match: /dispute|wrong|person|human|talk to/, handoff: true, reply: "" },
      {
        match: /already paid|paid/,
        tools: ["billing"],
        reply: "Thanks! I can see your payment of **$48** from today, so you're all set. Sorry for the extra reminder.",
      },
      {
        match: /next week|later|extend|delay/,
        tools: ["due", "billing"],
        reply: "I can move your due date to **12 Nov** — no extra fee. Shall I do that?",
      },
      {
        match: /renew|plan/,
        tools: ["billing"],
        reply: "Your plan renews on **15 Nov** for **$48**. Here's your link to renew now: **pay.example.com/r/4821**",
      },
    ],
    fallback: "Hi! This is a reminder that your payment of **$48** is due on **8 Nov**. Reply here if you have any questions.",
    changeIdeas: ["Send reminders 7 days before", "Add WhatsApp as a channel", "Make messages shorter"],
  },
};

export const profileOf = (id: string | undefined) => (id ? PROFILES[id] : undefined);

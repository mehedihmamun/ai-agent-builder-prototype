import type { Answers } from "../builder/script";
import type { Agent } from "./agents";

export type TagTone = "support" | "chat" | "ecommerce" | "store" | "shopify" | "woo" | "sales" | "voice" | "whatsapp";

export interface TemplateTag {
  label: string;
  tone: TagTone;
}

export type TemplateIconKind = "shopify" | "woo" | string;

export interface AgentTemplate {
  id: string;
  /** "shopify" / "woo" draw a brand-style mark; anything else is an emoji. */
  icon: TemplateIconKind;
  title: string;
  description: string;
  /** Longer text for the details panel. Paragraphs separated by a blank line. */
  about: string;
  tags: TemplateTag[];
  useCase: string;
  industry: string;
  category: string;
  channels: Agent["channels"];
  /** Inbound unless set. */
  direction?: Agent["direction"];
  /** Prompt the agent is created with. */
  prompt: string;
  /** What the Builder Assistant sets up from the template; only the store round is asked. */
  answers: Answers;
}

export const USE_CASES = ["Customer support", "Sales", "Order management", "Account management", "Scheduling", "Billing"];
export const INDUSTRIES = ["E-commerce", "Fashion & apparel", "Electronics", "General retail", "Any business"];
export const CATEGORIES = ["Chat", "WhatsApp", "Voice", "SMS"];

const T = {
  support: { label: "Support", tone: "support" },
  chat: { label: "Chat", tone: "chat" },
  ecommerce: { label: "Ecommerce", tone: "ecommerce" },
  store: { label: "Store manage", tone: "store" },
  shopify: { label: "Shopify", tone: "shopify" },
  woo: { label: "Woo-commerce", tone: "woo" },
  sales: { label: "Sales", tone: "sales" },
  whatsapp: { label: "WhatsApp", tone: "whatsapp" },
  voice: { label: "Voice", tone: "voice" },
} satisfies Record<string, TemplateTag>;

const VOICE: Answers = { language: { ids: ["match"] }, tone: { ids: ["friendly"] } };

export const AGENT_TEMPLATES: AgentTemplate[] = [
  // The six starters on the empty state: two e-commerce, four for any business.
  {
    id: "ecommerce-sales",
    icon: "🛒",
    title: "E-commerce Sales Assistant",
    description: "Helps shoppers find the right product, compares options and suggests offers.",
    about:
      "A shopping assistant for your online store. It answers product questions, compares options and suggests matching products and offers, so more visitors turn into buyers.\n\nPayment problems and anything it can't answer go to your team.",
    tags: [T.sales, T.chat, T.ecommerce],
    useCase: "Sales",
    industry: "E-commerce",
    category: "Chat",
    channels: ["web", "whatsapp"],
    prompt: "Help shoppers on my online store find the right products, compare options and suggest offers and add-ons to increase sales.",
    answers: {
      goals: { ids: ["product", "sales"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "orders-returns",
    icon: "📦",
    title: "Order Tracking & Returns",
    description: "Answers order status, delivery and return questions, and hands off payment issues.",
    about:
      "Answers \"Where is my order?\" and \"How do I return this?\" around the clock. It looks up orders, shares tracking and delivery dates, explains your return policy and starts returns.\n\nRefund disputes and payment issues go to your team.",
    tags: [T.support, T.chat, T.ecommerce],
    useCase: "Order management",
    industry: "E-commerce",
    category: "Chat",
    channels: ["web", "whatsapp", "sms"],
    prompt: "Answer my store's customers about order status, delivery times and returns & refunds, and hand off payment issues to the team.",
    answers: {
      goals: { ids: ["orders", "returns"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["refund", "payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "customer-service",
    icon: "💬",
    title: "Customer Service AI",
    description: "Automates customer interactions, providing instant answers and efficient support.",
    about:
      "Answers your customers' common questions from your help docs and website, any time of day.\n\nWhen a question is complex or the customer asks for a person, it hands the chat to your team.",
    tags: [T.support, T.chat],
    useCase: "Customer support",
    industry: "Any business",
    category: "Chat",
    channels: ["web", "email"],
    prompt: "Answer customer questions using our help docs and hand off complex issues to the team.",
    answers: {
      profile: "customer-service",
      goals: { ids: ["product"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "appointment",
    icon: "📅",
    title: "Appointment Scheduling",
    description: "Books, reschedules and confirms appointments without back-and-forth.",
    about:
      "Lets customers book, reschedule or cancel appointments on WhatsApp or by phone, and sends them a confirmation.\n\nGood for clinics, salons, service centers and consultants.",
    tags: [T.support, T.whatsapp, T.voice],
    useCase: "Scheduling",
    industry: "Any business",
    category: "WhatsApp",
    channels: ["whatsapp", "voice"],
    prompt: "Let customers book, reschedule or cancel appointments and send them a confirmation.",
    answers: {
      profile: "appointment",
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "billing",
    icon: "🏦",
    title: "Billing Inquiry",
    description: "Answers questions about invoices, payments and due dates.",
    about:
      "Answers billing questions: invoice details, payment status and due dates.\n\nPayment disputes and refund requests go straight to your team.",
    tags: [T.support, T.chat],
    useCase: "Billing",
    industry: "Any business",
    category: "Chat",
    channels: ["web", "email"],
    prompt: "Answer questions about invoices, payment status and due dates, and hand off payment disputes to the team.",
    answers: {
      profile: "billing",
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["refund", "payment", "person"] },
      ...VOICE,
    },
  },
  {
    id: "reminders",
    icon: "📢",
    direction: "Outbound",
    title: "Payment & Renewal Reminders",
    description: "Reminds customers about upcoming payments and renewals, and answers follow-up questions.",
    about:
      "Sends friendly reminders by SMS and email before a payment or renewal is due, then answers the customer's follow-up questions.\n\nBilling disputes go to your team.",
    tags: [T.sales],
    useCase: "Billing",
    industry: "Any business",
    category: "SMS",
    channels: ["sms", "email"],
    prompt: "Remind customers about upcoming payments and plan renewals, answer their follow-up questions and hand off billing disputes to the team.",
    answers: {
      profile: "reminders",
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person"] },
      ...VOICE,
    },
  },
  {
    id: "shopify-store",
    icon: "shopify",
    title: "Shopify store management",
    description: "Provides real-time updates on order status, tracking, and delivery information.",
    about:
      "A ready-made assistant for Shopify stores. It reads your products and orders straight from Shopify, so customers get live answers about stock, order status and delivery without waiting for your team.\n\nUse it as the main assistant on your website chat, then switch on WhatsApp when you're ready.",
    tags: [T.shopify, T.store, T.ecommerce],
    useCase: "Order management",
    industry: "E-commerce",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Help customers of my Shopify store with product questions, order status and delivery updates.",
    answers: {
      platform: { ids: ["shopify"] },
      goals: { ids: ["product", "orders", "sales"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "woo-store",
    icon: "woo",
    title: "WooCommerce store management",
    description: "Provides real-time updates on order status, tracking, and delivery information.",
    about:
      "The same live store assistant, built for WooCommerce. It looks up products and orders through your WooCommerce store and answers delivery and policy questions from your website.\n\nGood for WordPress stores that want quick answers without extra plugins.",
    tags: [T.woo, T.store, T.ecommerce],
    useCase: "Order management",
    industry: "E-commerce",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Help customers of my WooCommerce store with product questions, order status and delivery updates.",
    answers: {
      platform: { ids: ["woocommerce"] },
      goals: { ids: ["product", "orders"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "returns",
    icon: "🤑",
    title: "Returns & Refunds",
    description: "Manages return requests, refund processing, and exchange inquiries efficiently.",
    about:
      "Takes the busywork out of returns. The agent explains your return policy, checks if an order can still be returned, and starts the return or exchange.\n\nRefund disputes and payment problems go straight to your team.",
    tags: [T.support, T.ecommerce],
    useCase: "Customer support",
    industry: "Fashion & apparel",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Handle return and exchange requests for my store, explain the policy and start returns after the customer confirms.",
    answers: {
      goals: { ids: ["returns", "orders"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "product-inquiry",
    icon: "🛒",
    title: "E-commerce Product Inquiry",
    description: "Answers product-related questions, provides specs, and offers buying advice.",
    about:
      "A Product Inquiry is a request for information about a specific product or service, often made by potential or existing customers to better understand its features, availability, pricing, or suitability.\n\nThis agent answers those questions from your catalog, compares options, and suggests the right product.",
    tags: [T.support, T.chat, T.ecommerce],
    useCase: "Customer support",
    industry: "E-commerce",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Answer product questions for my online store — size, stock, price and specs — and give buying advice.",
    answers: {
      goals: { ids: ["product", "sales"] },
      catalog: { ids: ["sheet"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "order-status",
    icon: "📦",
    title: "Order Status AI",
    description: "Provides real-time updates on order status, tracking, and delivery information.",
    about:
      "Answers the most common question in e-commerce: \"Where is my order?\". It looks up the order, shares the tracking status and delivery date, and flags late deliveries to your team.",
    tags: [T.chat, T.ecommerce],
    useCase: "Order management",
    industry: "General retail",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Tell customers where their order is, share tracking details and expected delivery dates.",
    answers: {
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "account",
    icon: "🧾",
    title: "Account Management",
    description: "Assists with account settings, profile updates, and password resets.",
    about:
      "Helps customers manage their store account: update addresses and contact details, reset passwords and check saved orders.\n\nAnything that needs identity checks goes to your team.",
    tags: [T.support, T.chat, T.ecommerce],
    useCase: "Account management",
    industry: "General retail",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Help customers update their account details, reset passwords and find past orders.",
    answers: {
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "abandoned-cart",
    icon: "🛍️",
    title: "Abandoned Cart Recovery",
    description: "Reminds shoppers about items left in their cart and answers last-minute questions.",
    about:
      "Brings shoppers back to finish their order. The agent sends a friendly reminder on WhatsApp, answers last-minute questions and can share a small discount when you allow it.",
    tags: [T.sales, T.whatsapp, T.ecommerce],
    useCase: "Sales",
    industry: "E-commerce",
    category: "WhatsApp",
    channels: ["whatsapp"],
    prompt: "Remind shoppers about items left in their cart on WhatsApp and help them complete the order.",
    answers: {
      goals: { ids: ["product", "sales"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["payment", "person"] },
      ...VOICE,
    },
  },
  {
    id: "recommendations",
    icon: "✨",
    title: "Sales & Recommendations",
    description: "Suggests matching products, bundles and offers to grow every order.",
    about:
      "A shopping assistant that recommends products based on what the customer is looking for, suggests matching add-ons, and highlights current offers.",
    tags: [T.sales, T.chat, T.ecommerce],
    useCase: "Sales",
    industry: "Fashion & apparel",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Help shoppers find the right products, compare options and suggest matching add-ons and offers.",
    answers: {
      goals: { ids: ["product", "sales"] },
      catalog: { ids: ["sheet"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "size-fit",
    icon: "👚",
    title: "Size & Fit Advisor",
    description: "Helps shoppers pick the right size using your size charts and reviews.",
    about: "Cuts returns caused by wrong sizes. The agent asks a few quick questions and recommends a size from your size charts.",
    tags: [T.support, T.chat, T.ecommerce],
    useCase: "Customer support",
    industry: "Fashion & apparel",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Help shoppers choose the right size from our size charts before they order.",
    answers: {
      goals: { ids: ["product"] },
      catalog: { ids: ["drive"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "delivery-faq",
    icon: "🚚",
    title: "Delivery & Shipping FAQ",
    description: "Answers delivery times, shipping costs and coverage questions instantly.",
    about: "Answers every shipping question from your policy pages: delivery areas, times, costs and cash on delivery.",
    tags: [T.support, T.whatsapp, T.ecommerce],
    useCase: "Customer support",
    industry: "General retail",
    category: "WhatsApp",
    channels: ["whatsapp"],
    prompt: "Answer delivery and shipping questions from our policy pages: areas, times, costs and cash on delivery.",
    answers: {
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "electronics",
    icon: "🎧",
    title: "Electronics Product Expert",
    description: "Explains specs, compares models and checks warranty for electronics.",
    about: "Built for electronics stores: explains specs in plain words, compares models side by side and answers warranty questions.",
    tags: [T.sales, T.chat, T.ecommerce],
    useCase: "Sales",
    industry: "Electronics",
    category: "Chat",
    channels: ["web", "webpush"],
    prompt: "Explain product specs, compare models and answer warranty questions for my electronics store.",
    answers: {
      goals: { ids: ["product", "sales"] },
      catalog: { ids: ["platform"] },
      policies: { ids: ["website"] },
      handover: { ids: ["person", "unknown"] },
      ...VOICE,
    },
  },
  {
    id: "order-voice",
    icon: "📞",
    title: "Order Hotline (Voice)",
    description: "Answers order and delivery calls with a natural voice, 24/7.",
    about: "A voice agent for your order hotline. It answers calls, checks order status and passes complex calls to your team.",
    tags: [T.support, T.voice, T.ecommerce],
    useCase: "Order management",
    industry: "General retail",
    category: "Voice",
    channels: ["voice"],
    prompt: "Answer phone calls about order status and delivery, and pass complex calls to the team.",
    answers: {
      goals: { ids: ["orders"] },
      policies: { ids: ["website"] },
      handover: { ids: ["refund", "payment", "person", "unknown"] },
      ...VOICE,
    },
  },
];

export const findTemplate = (id: string | null | undefined) => AGENT_TEMPLATES.find((t) => t.id === id);

/** The six cards on the empty state. */
export const STARTER_TEMPLATES = AGENT_TEMPLATES.slice(0, 6);

export interface PromptExample {
  id: string;
  emoji: string;
  title: string;
  description: string;
  /** Text put in the prompt box. [Bracketed] parts are placeholders to type over. */
  prompt: string;
  /** One-line version of the prompt for example chips (short, so chips fit side by side). */
  preview: string;
}

/** Example prompts; the agent starter (empty state and Create page) shows them as chips. */
export const PROMPT_EXAMPLES: PromptExample[] = [
  {
    id: "ecommerce-sales",
    emoji: "🛍️",
    title: "E-commerce sales assistant",
    description: "Help shoppers find the right product, compare options and suggest add-ons.",
    preview: "Help shoppers find the right products & suggest offers",
    prompt: "Help shoppers on [my online store] find the right products, compare options and suggest [offers and add-ons] to increase sales.",
  },
  {
    id: "orders-returns",
    emoji: "📦",
    title: "Order tracking & returns",
    description: "Track orders, deliveries & returns, and hand off payment issues.",
    preview: "Track orders, deliveries & returns",
    prompt: "Answer [my store]'s customers about order status, delivery times and [returns & refunds], and hand off payment issues to the team.",
  },
  {
    id: "customer-requests",
    emoji: "💬",
    title: "Handle customer requests",
    description: "Answer customers, look things up in your systems and take actions with their confirmation.",
    preview: "Handle requests & take actions",
    prompt: "Help customers of [my business] with [checking orders, account questions] and take actions like [refunds] after they confirm.",
  },
  {
    id: "documents",
    emoji: "📄",
    title: "Answer from your documents",
    description: "Reply to common questions using your website, FAQ and policy documents.",
    preview: "Answer from our docs & FAQ",
    prompt: "Answer customer questions about [my business] using our [website, FAQ and policy documents], and hand off to the team when the answer isn't there.",
  },
  {
    id: "appointments",
    emoji: "📅",
    title: "Book appointments",
    description: "Book, reschedule and cancel appointments, and send confirmations.",
    preview: "Book appointments",
    prompt: "Let customers of [my business] book, reschedule or cancel [appointments] and send them a confirmation.",
  },
];

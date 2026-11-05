import { ShoppingBag } from "lucide-react";
import type { TagTone, TemplateIconKind, TemplateTag } from "../../data/agentTemplates";

/** Tag colours, all from design-system tokens. */
const TONE: Record<TagTone, string> = {
  support: "bg-pitch-20 text-red-100",
  chat: "bg-purple-10 text-purple-100",
  ecommerce: "bg-navy-20 text-navy-100",
  store: "bg-blue-30 text-blue-100",
  shopify: "bg-green-20 text-green-100",
  woo: "bg-pitch-20 text-red-100",
  sales: "bg-green-10 text-green-100",
  whatsapp: "bg-green-10 text-green-100",
  voice: "bg-yellow-20 text-black",
};

export function TemplateTags({ tags, size = "sm" }: { tags: TemplateTag[]; size?: "sm" | "md" }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span
          key={t.label}
          className={`${TONE[t.tone]} rounded-sm ${size === "md" ? "text-body-500-l px-2 py-0.5" : "text-body-500-s px-1.5 py-0.5"}`}
        >
          {t.label}
        </span>
      ))}
    </div>
  );
}

export function TemplateIcon({ icon, size = 24 }: { icon: TemplateIconKind; size?: number }) {
  if (icon === "shopify") {
    return (
      <span className="flex items-center justify-center rounded-md bg-green-90 text-white" style={{ width: size, height: size }}>
        <ShoppingBag size={size * 0.62} strokeWidth={2.2} />
      </span>
    );
  }
  if (icon === "woo") {
    return (
      <span
        className="flex items-center justify-center rounded-md bg-purple-100 text-body-700-l text-white"
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        woo
      </span>
    );
  }
  return (
    <span className="leading-none" style={{ fontSize: size }} aria-hidden="true">
      {icon}
    </span>
  );
}

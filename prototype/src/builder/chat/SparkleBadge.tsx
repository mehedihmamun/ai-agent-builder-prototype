import { Sparkles } from "lucide-react";

/** The Builder assistant mark: a glossy purple orb with a white sparkle (top bar button, panel header). */
export function SparkleBadge({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-white shadow-sm ${className}`}
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 32% 28%, var(--purple-40) 0%, var(--purple-100) 55%, var(--navy-100) 100%)",
      }}
    >
      <Sparkles size={Math.round(size * 0.5)} strokeWidth={2.2} fill="currentColor" />
    </span>
  );
}

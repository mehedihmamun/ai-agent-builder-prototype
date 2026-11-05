import { SparkleBadge } from "./SparkleBadge";

/** The assistant's mark. Pulses while it is thinking. */
export function AssistantMark({ spinning = false }: { spinning?: boolean }) {
  return <SparkleBadge size={24} className={spinning ? "spark-pulse" : ""} />;
}

/** "Thinking…" state: pulsing mark and a shimmering label. */
export function Thinking({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5" role="status">
      <AssistantMark spinning />
      <span className="text-body-500-l shimmer-text">{label}…</span>
    </div>
  );
}
